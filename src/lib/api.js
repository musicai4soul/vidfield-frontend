import axios from 'axios'
import { supabase } from './supabase'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// ─── Videos ────────────────────────────────────────────────────────────────
export const generateVideo = (payload) =>
  api.post('/api/videos/generate', payload)

export const getVideoHistory = (page = 1, limit = 20) =>
  api.get(`/api/videos/history?page=${page}&limit=${limit}`)

export const getVideoStatus = (jobId) =>
  api.get(`/api/videos/status/${jobId}`)

// ─── Credits & Plans ───────────────────────────────────────────────────────
export const getProfile = () =>
  api.get('/api/users/profile')

export const getPlans = () =>
  api.get('/api/payments/plans')

// ─── Payments ─────────────────────────────────────────────────────────────
// plan_id: 'starter' | 'creator' | 'pro'
export const createRazorpayOrder = (planId) =>
  api.post('/api/payments/create-order', { plan_id: planId })

export const verifyPayment = (payload) =>
  api.post('/api/payments/verify', payload)

export default api

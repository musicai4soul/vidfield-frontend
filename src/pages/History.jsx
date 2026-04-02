import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { getVideoHistory } from '../lib/api'
import {
  Film, Download, Copy, Play, Clock, CheckCircle2,
  AlertCircle, Loader2, RefreshCw, Search, Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

const STYLE_LABELS = {
  bollywood: { label: 'Bollywood', emoji: '🎬', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  cinematic: { label: 'Cinematic', emoji: '🎥', color: 'text-brand-400 bg-brand-500/10 border-brand-500/20' },
  reels:     { label: 'Reels',     emoji: '🔥', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  ugc_ad:    { label: 'UGC Ad',    emoji: '📱', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
}

function StatusIcon({ status }) {
  if (status === 'completed')  return <CheckCircle2 size={14} className="text-green-400" />
  if (status === 'processing') return <Loader2 size={14} className="text-brand-400 animate-spin" />
  if (status === 'failed')     return <AlertCircle size={14} className="text-red-400" />
  return <Clock size={14} className="text-zinc-500" />
}

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false)
  const style = STYLE_LABELS[video.style] || STYLE_LABELS.bollywood
  const date  = new Date(video.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  const time = new Date(video.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="card !p-0 overflow-hidden group hover:border-dark-400 transition-all">
      {/* Thumbnail / video */}
      <div className="relative aspect-video bg-dark-800">
        {video.status === 'completed' && video.video_url ? (
          <>
            {playing ? (
              <video
                src={video.video_url}
                autoPlay
                controls
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-900/40 to-purple-900/40 flex items-center justify-center">
                    <Film size={32} className="text-zinc-700" />
                  </div>
                )}
                <button
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Play size={18} className="text-white ml-0.5" />
                  </div>
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <StatusIcon status={video.status} />
            <span className="text-xs text-zinc-600 capitalize">{video.status}</span>
          </div>
        )}

        {/* Style badge overlay */}
        <div className="absolute top-2 left-2">
          <span className={`badge text-xs border ${style.color}`}>
            {style.emoji} {style.label}
          </span>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2">
            <span className="badge bg-black/60 backdrop-blur-sm text-zinc-300 text-xs border border-white/10">
              {video.duration}s
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <p className="text-sm text-zinc-300 line-clamp-2 mb-3 leading-relaxed">
          {video.prompt}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-600">
            {date} · {time}
          </div>
          <div className="flex items-center gap-1">
            {video.status === 'completed' && video.video_url && (
              <>
                <a
                  href={video.video_url}
                  download
                  className="p-1.5 rounded-lg bg-dark-600 hover:bg-dark-500 text-zinc-400 hover:text-zinc-200 transition-all"
                  title="Download"
                >
                  <Download size={13} />
                </a>
                <button
                  onClick={() => { navigator.clipboard.writeText(video.video_url); toast.success('Copied!') }}
                  className="p-1.5 rounded-lg bg-dark-600 hover:bg-dark-500 text-zinc-400 hover:text-zinc-200 transition-all"
                  title="Copy URL"
                >
                  <Copy size={13} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function History() {
  const [videos, setVideos]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filterStyle, setFilterStyle] = useState('all')
  const [page, setPage]         = useState(1)
  const [hasMore, setHasMore]   = useState(false)

  const fetchHistory = async (p = 1) => {
    setLoading(true)
    try {
      const { data } = await getVideoHistory(p, 12)
      setVideos(prev => p === 1 ? data.videos : [...prev, ...data.videos])
      setHasMore(data.has_more)
      setPage(p)
    } catch (e) {
      toast.error('Could not load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistory(1) }, [])

  const filtered = videos.filter(v => {
    const matchSearch = v.prompt.toLowerCase().includes(search.toLowerCase())
    const matchStyle  = filterStyle === 'all' || v.style === filterStyle
    return matchSearch && matchStyle
  })

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-100 mb-1">Video History</h1>
            <p className="text-zinc-500 text-sm">All your AI-generated videos</p>
          </div>
          <button
            onClick={() => fetchHistory(1)}
            className="btn-secondary !py-2 !px-4 text-sm flex items-center gap-2 shrink-0"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search prompts..."
              className="input pl-9 !py-2.5 text-sm"
            />
          </div>
          {/* Style filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-zinc-500" />
            {['all', 'bollywood', 'cinematic', 'reels', 'ugc_ad'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStyle(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize
                  ${filterStyle === s
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                    : 'bg-dark-700 text-zinc-500 border border-dark-600 hover:text-zinc-300'
                  }`}
              >
                {s === 'ugc_ad' ? 'UGC Ad' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading && videos.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-dark-600 overflow-hidden">
                <div className="aspect-video shimmer" />
                <div className="p-4 space-y-2">
                  <div className="h-4 shimmer rounded-lg w-3/4" />
                  <div className="h-4 shimmer rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Film size={40} className="text-zinc-700 mx-auto mb-4" />
            <h3 className="text-zinc-400 font-semibold mb-2">
              {search || filterStyle !== 'all' ? 'No videos match your filters' : 'No videos yet'}
            </h3>
            <p className="text-zinc-600 text-sm">
              {search || filterStyle !== 'all'
                ? 'Try clearing your search or filter.'
                : 'Generate your first video from the Dashboard.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(v => <VideoCard key={v.id} video={v} />)}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => fetchHistory(page + 1)}
                  disabled={loading}
                  className="btn-secondary flex items-center gap-2 mx-auto"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

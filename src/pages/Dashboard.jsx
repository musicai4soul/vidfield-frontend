import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { generateVideo, getVideoStatus } from '../lib/api'
import {
  Sparkles, Zap, Film, Download, Copy, RefreshCw,
  AlertCircle, ChevronDown, Clock, CheckCircle2, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

/* ─── Style presets ─────────────────────────────────────────────────── */
const STYLE_PRESETS = [
  {
    id: 'bollywood',
    name: 'Bollywood',
    emoji: '🎬',
    description: 'Dramatic, colorful, emotional — classic Bollywood aesthetic',
    prompt_suffix: 'Bollywood cinematic style, vibrant colors, dramatic lighting, emotional depth, Indian film aesthetics, rich color grading',
    credits: 1,
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    emoji: '🎥',
    description: 'Film-grade depth, natural color science, wide shots',
    prompt_suffix: 'cinematic 4K film quality, natural color grading, shallow depth of field, professional cinematography, anamorphic lens flare',
    credits: 1,
  },
  {
    id: 'reels',
    name: 'Viral Reels',
    emoji: '🔥',
    description: 'High energy, quick cuts, trending social media style',
    prompt_suffix: 'social media viral style, dynamic movement, trending aesthetic, high energy, fast motion, Instagram reels format',
    credits: 1,
  },
  {
    id: 'ugc_ad',
    name: 'UGC Ad',
    emoji: '📱',
    description: 'Authentic, relatable, performance-ad ready',
    prompt_suffix: 'authentic UGC content creator style, handheld camera feel, natural lighting, relatable real-person aesthetic, D2C brand friendly',
    credits: 1,
  },
]

const ASPECT_RATIOS = [
  { value: '9:16', label: '9:16 · Reels/Shorts', icon: '📱' },
  { value: '16:9', label: '16:9 · YouTube/TV', icon: '🖥️' },
  { value: '1:1',  label: '1:1 · Square Feed', icon: '⬜' },
]

const DURATIONS = [
  { value: 5,  label: '5 sec', credits: 1 },
  { value: 10, label: '10 sec', credits: 1 },
  { value: 15, label: '15 sec', credits: 1 },
  { value: 30, label: '30 sec', credits: 2 },
  { value: 60, label: '1 min',  credits: 2 },
]

const PROMPT_EXAMPLES = [
  "A Bollywood actress walks through Mumbai rain in slow motion, golden hour, dramatic music, dupatta flying",
  "Cinematic sunrise over the Taj Mahal, golden mist, birds flying, epic orchestral feel",
  "Energetic Bhangra dance opening, colorful kurta, fast cuts, festival energy",
  "Product unboxing of premium skincare, minimalist, soft natural light, UGC style",
  "Young entrepreneur in a co-working space, confident walk, modern Delhi office",
]

/* ─── Status indicator ──────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    pending:    { label: 'Queued',      color: 'text-zinc-400',  icon: Clock },
    processing: { label: 'Generating',  color: 'text-brand-400', icon: Loader2 },
    completed:  { label: 'Complete',    color: 'text-green-400', icon: CheckCircle2 },
    failed:     { label: 'Failed',      color: 'text-red-400',   icon: AlertCircle },
  }
  const s = map[status] || map.pending
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.color}`}>
      <Icon size={13} className={status === 'processing' ? 'animate-spin' : ''} />
      {s.label}
    </span>
  )
}

/* ─── Main Dashboard ────────────────────────────────────────────────── */
export default function Dashboard() {
  const { profile, refreshProfile } = useAuth()

  const [prompt, setPrompt]       = useState('')
  const [style, setStyle]         = useState(STYLE_PRESETS[0])
  const [ratio, setRatio]         = useState(ASPECT_RATIOS[0])
  const [duration, setDuration]   = useState(DURATIONS[2])
  const [generating, setGenerating] = useState(false)
  const [job, setJob]             = useState(null)          // { id, status, url }
  const [pollTimer, setPollTimer] = useState(null)
  const textareaRef = useRef(null)

  /* Auto-grow textarea */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [prompt])

  /* Cleanup poll on unmount */
  useEffect(() => () => clearInterval(pollTimer), [pollTimer])

  /* Poll job status */
  const startPolling = (jobId) => {
    const timer = setInterval(async () => {
      try {
        const { data } = await getVideoStatus(jobId)
        setJob(data)
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(timer)
          setGenerating(false)
          refreshProfile()
          if (data.status === 'completed') {
            toast.success('🎬 Video ready!')
          } else {
            toast.error('Generation failed. Credits refunded.')
          }
        }
      } catch (e) {
        console.error('Poll error:', e)
      }
    }, 3000)
    setPollTimer(timer)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error('Please enter a prompt')
    if ((profile?.credits ?? 0) < duration.credits) {
      return toast.error(`Not enough credits. You need ${duration.credits} credit(s).`)
    }

    setGenerating(true)
    setJob(null)

    try {
      const { data } = await generateVideo({
        prompt: `${prompt.trim()}, ${style.prompt_suffix}`,
        style:  style.id,
        aspect_ratio: ratio.value,
        duration: duration.value,
      })
      setJob({ id: data.job_id, status: 'processing' })
      startPolling(data.job_id)
      toast('Video is generating...', { icon: '⚡' })
    } catch (err) {
      setGenerating(false)
      const msg = err?.response?.data?.detail || 'Generation failed. Please try again.'
      toast.error(msg)
    }
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    toast.success('Prompt copied!')
  }

  const handleExamplePrompt = (example) => {
    setPrompt(example)
    textareaRef.current?.focus()
  }

  const creditsLeft = profile?.credits ?? 0
  const creditsNeeded = duration.credits
  const canGenerate = creditsLeft >= creditsNeeded && !generating

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-100 mb-1">Generate Video</h1>
            <p className="text-zinc-500 text-sm">Describe what you want to see — AI does the rest</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700 border border-dark-600 shrink-0">
            <Zap size={14} className="text-accent-gold" />
            <span className="font-bold text-zinc-200 text-sm">{creditsLeft}</span>
            <span className="text-zinc-500 text-xs">credits</span>
            {creditsLeft < 5 && (
              <Link to="/pricing" className="ml-1 text-xs text-brand-400 hover:underline">Top up →</Link>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Left: Input panel */}
          <div className="space-y-5">

            {/* Prompt input */}
            <div className="card !p-0 overflow-hidden">
              <div className="px-4 pt-4 pb-2 border-b border-dark-600 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Your Prompt</span>
                {prompt && (
                  <button onClick={handleCopyPrompt} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    <Copy size={11} /> Copy
                  </button>
                )}
              </div>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your video... e.g., A Bollywood actress walks through Mumbai rain in slow motion, golden hour lighting, emotional expression..."
                className="w-full bg-transparent text-zinc-200 placeholder-zinc-600 px-4 py-4 resize-none outline-none text-sm leading-relaxed min-h-[120px]"
                maxLength={500}
              />
              <div className="px-4 pb-3 flex items-center justify-between">
                <span className="text-xs text-zinc-600">{prompt.length}/500</span>
                <div className="flex items-center gap-2">
                  {prompt && (
                    <button
                      onClick={() => setPrompt('')}
                      className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Prompt examples */}
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2.5">✨ Try these prompts:</p>
              <div className="flex flex-wrap gap-2">
                {PROMPT_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleExamplePrompt(ex)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-600 text-zinc-400 hover:text-zinc-200 hover:border-dark-400 transition-all text-left line-clamp-1 max-w-[200px]"
                  >
                    {ex.slice(0, 40)}…
                  </button>
                ))}
              </div>
            </div>

            {/* Style presets */}
            <div>
              <label className="label">Style Preset</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STYLE_PRESETS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all
                      ${style.id === s.id
                        ? 'bg-brand-500/15 border-brand-500/40 text-brand-300'
                        : 'bg-dark-700 border-dark-600 text-zinc-400 hover:border-dark-400 hover:text-zinc-200'
                      }`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="text-xs font-semibold">{s.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-2">{style.description}</p>
            </div>

            {/* Aspect ratio & duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Aspect Ratio</label>
                <div className="space-y-2">
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRatio(r)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all
                        ${ratio.value === r.value
                          ? 'bg-brand-500/15 border-brand-500/40 text-brand-300'
                          : 'bg-dark-700 border-dark-600 text-zinc-400 hover:border-dark-400'
                        }`}
                    >
                      <span>{r.icon}</span>
                      <span className="text-xs">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Duration</label>
                <div className="space-y-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-all
                        ${duration.value === d.value
                          ? 'bg-brand-500/15 border-brand-500/40 text-brand-300'
                          : 'bg-dark-700 border-dark-600 text-zinc-400 hover:border-dark-400'
                        }`}
                    >
                      <span className="text-xs">{d.label}</span>
                      <span className="flex items-center gap-1 text-xs text-zinc-600">
                        <Zap size={10} />{d.credits}cr
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Generate + preview panel */}
          <div className="space-y-4">
            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || !prompt.trim()}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all
                ${canGenerate && prompt.trim()
                  ? 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-xl shadow-brand-950/50 active:scale-[0.98]'
                  : 'bg-dark-700 text-zinc-600 cursor-not-allowed border border-dark-600'
                }`}
            >
              {generating ? (
                <><Loader2 size={20} className="animate-spin" /> Generating...</>
              ) : (
                <><Sparkles size={20} /> Generate Video <span className="text-sm opacity-70">({creditsNeeded} cr)</span></>
              )}
            </button>

            {!profile?.plan || profile.plan === 'free' && creditsLeft === 0 ? (
              <Link
                to="/pricing"
                className="w-full py-3 rounded-xl border border-brand-500/40 text-brand-400 hover:bg-brand-500/10 text-sm font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Zap size={15} /> Get More Credits
              </Link>
            ) : null}

            {/* Video preview panel */}
            <div className={`rounded-2xl border border-dark-600 bg-dark-800 overflow-hidden
              ${ratio.value === '9:16' ? 'aspect-[9/16]' : ratio.value === '1:1' ? 'aspect-square' : 'aspect-video'}`}
            >
              {job?.status === 'completed' && job?.video_url ? (
                <video
                  src={job.video_url}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
                  {job?.status === 'processing' ? (
                    <>
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                          <Film size={28} className="text-brand-400" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-500 border-2 border-dark-800 flex items-center justify-center">
                          <Loader2 size={12} className="text-white animate-spin" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-zinc-300 mb-1">Generating your video</p>
                        <p className="text-xs text-zinc-600">This takes about 45–90 seconds…</p>
                      </div>
                      {/* Fake progress bar */}
                      <div className="w-full bg-dark-700 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full animate-pulse w-2/3" />
                      </div>
                    </>
                  ) : job?.status === 'failed' ? (
                    <div className="text-center">
                      <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-zinc-300 mb-1">Generation failed</p>
                      <p className="text-xs text-zinc-600 mb-4">Your credits have been refunded</p>
                      <button onClick={handleGenerate} className="btn-secondary text-xs flex items-center gap-1.5 mx-auto">
                        <RefreshCw size={13} /> Retry
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-dark-700 border border-dark-600 flex items-center justify-center mx-auto mb-4">
                        <Film size={28} className="text-zinc-600" />
                      </div>
                      <p className="text-sm text-zinc-500">Your video preview will appear here</p>
                      <p className="text-xs text-zinc-700 mt-1">Enter a prompt and click Generate</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Download / share actions when video is ready */}
            {job?.status === 'completed' && job?.video_url && (
              <div className="flex gap-2">
                <a
                  href={job.video_url}
                  download="vidfield-video.mp4"
                  className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                >
                  <Download size={15} /> Download
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(job.video_url)
                    toast.success('Video URL copied!')
                  }}
                  className="btn-secondary text-sm flex items-center gap-2 px-4"
                >
                  <Copy size={15} />
                </button>
              </div>
            )}

            {/* Job status */}
            {job && (
              <div className="flex items-center justify-between text-xs px-3 py-2.5 rounded-xl bg-dark-800 border border-dark-600">
                <span className="text-zinc-500">Status</span>
                <StatusBadge status={job.status} />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

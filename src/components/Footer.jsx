import { Link } from 'react-router-dom'
import { Film, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-dark-600 bg-dark-900 pt-16 pb-8">
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <Film size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-zinc-100">
                Vid<span className="text-brand-400">field</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              AI video generation built for Indian creators. Bollywood. Reels. Ads. All in seconds.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-dark-600 transition-all">
                <Twitter size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-dark-600 transition-all">
                <Instagram size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-dark-600 transition-all">
                <Youtube size={15} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-4">Product</h4>
            <ul className="space-y-2.5">
              {['Features', 'Pricing', 'Showcase', 'Changelog'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-600 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Vidfield Technologies Pvt. Ltd. All rights reserved. Made with ❤️ in India 🇮🇳
          </p>
          <p className="text-xs text-zinc-600">
            Powered by Fal.ai · Supabase · Razorpay
          </p>
        </div>
      </div>
    </footer>
  )
}

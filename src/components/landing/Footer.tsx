// Server Component - SEO friendly
import { Link2, Mail, MessageCircle, FileText, Youtube, YoutubeIcon, Send } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 rounded bg-bluelight flex items-center justify-center text-white">
                <Link2 className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white">ShortLinkmu</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The most reliable URL shortener service for publishers. Shorten,
              share and track your links with ease in a clean, modern
              environment.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-20">
            {/* Platform Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link
                    href="/payout-rates"
                    className="hover:text-white transition-colors"
                  >
                    Payout Rates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/report-abuse"
                    className="hover:text-white transition-colors"
                  >
                    Report Abuse
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 ShortLinkmu. All rights reserved.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="size-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-bluelight transition-all group"
            >
              <span className="meteor-icons--whatsapp w-5 h-5 bg-slate-400 group-hover:bg-white" />
            </a>
            <a
              href="#"
              className="size-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-bluelight transition-all group"
            >
              <span className="iconoir--telegram w-6 h-6 bg-slate-400 group-hover:bg-white" />
            </a>
            <a
              href="#"
              className="size-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-bluelight transition-all group"
            >
              <span className="mynaui--youtube w-6 h-6 bg-slate-400 group-hover:bg-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

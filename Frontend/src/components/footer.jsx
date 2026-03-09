import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-12 pb-8">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-zinc-500">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-black tracking-tighter text-white">
            Rincón<span className="text-brand-cyan">Canino</span>
          </span>
          <span className="hidden md:block h-4 w-[1px] bg-white/10" />
          <p className="text-xs font-medium uppercase tracking-widest">
            © 2026 E-ASY
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="https://es.linkedin.com/company/insideeasy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            <svg
              fill="currentColor"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

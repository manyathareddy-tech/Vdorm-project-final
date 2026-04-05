import { Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-800 bg-slate-950 text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Building2 size={20} />
          <span className="font-display font-bold text-xl tracking-tight text-white">HostelNexus</span>
        </div>
        <p className="text-slate-500 text-sm max-w-md">
          &quot;This is the difference between a hostel that reacts to problems and one that prevents them.&quot;
        </p>
        <div className="mt-4 text-xs text-slate-600">
          Designed for Solve-a-thon 2026 • Theme 1
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link'
import { ArrowRight, Search, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(37,99,235,0.12),transparent_38%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-32">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm dark:border-blue-900 dark:bg-slate-900 dark:text-blue-300"><Sparkles className="h-3.5 w-3.5" /> Simple tools. Big results.</div>
          <h1 className="max-w-3xl text-5xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">The tools you need, <span className="text-blue-600">all in one place.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">Fast, free, and beautifully simple utilities for everyday work. No sign-up, no clutter, just get things done.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="#tools" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Explore all tools <ArrowRight className="h-4 w-4" /></Link>
            <Link href="#categories" className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Browse by category</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500"><span>50+ free tools</span><span>No sign-up required</span><span>Privacy first</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800"><Search className="h-5 w-5 text-slate-400" /><span className="text-sm text-slate-400">What do you need to do?</span><kbd className="ml-auto rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-400 dark:border-slate-700 dark:bg-slate-900">⌘ K</kbd></div>
            <div className="mt-4 grid grid-cols-2 gap-3"><Preview label="Compress PDF" color="blue" /><Preview label="Generate QR code" color="violet" /><Preview label="Convert images" color="amber" /><Preview label="Count words" color="emerald" /></div>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"><Sparkles className="h-3.5 w-3.5" /> New tools added every month</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Preview({ label, color }: { label: string; color: string }) {
  return <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"><span className={`h-2.5 w-2.5 rounded-full bg-${color}-500`} />{label}</div>
}

import Link from 'next/link'
import { ArrowUpRight, Calculator, Code2, FileText, ImageIcon, LockKeyhole, Sparkles, Type } from 'lucide-react'

const categories = [
  { name: 'PDF tools', count: '15 tools', icon: FileText, color: 'blue', tools: ['Merge PDF', 'Compress PDF', 'Split PDF'] },
  { name: 'Image tools', count: '15 tools', icon: ImageIcon, color: 'violet', tools: ['Compress image', 'Resize image', 'Convert image'] },
  { name: 'Text tools', count: '12 tools', icon: Type, color: 'emerald', tools: ['Word counter', 'Case converter', 'Remove line breaks'] },
  { name: 'Developer tools', count: '14 tools', icon: Code2, color: 'amber', tools: ['JSON formatter', 'Base64 encoder', 'UUID generator'] },
  { name: 'Security tools', count: '10 tools', icon: LockKeyhole, color: 'rose', tools: ['Password generator', 'Hash generator', 'Encode URL'] },
  { name: 'Calculators', count: '18 tools', icon: Calculator, color: 'cyan', tools: ['Loan calculator', 'Percentage calculator', 'Age calculator'] },
]

const colorStyles: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300',
  cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-300',
}

export default function ToolGrid() {
  return (
    <section id="tools" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">Your toolkit</p><h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">Everything you need to get it done</h2><p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">Explore our most popular tool categories. Fast, private, and ready whenever you are.</p></div>
        <Link href="#tools" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">View all 118 tools <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
      <div id="categories" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(({ name, count, icon: Icon, color, tools }) => <article key={name} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900 dark:hover:shadow-black/20"><div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorStyles[color]}`}><Icon className="h-5 w-5" /></span><span className="text-xs font-medium text-slate-400">{count}</span></div><h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{name}</h3><ul className="mt-3 space-y-2">{tools.map(tool => <li key={tool}><Link href="#tools" className="flex items-center justify-between text-sm text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"><span>{tool}</span><ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" /></Link></li>)}</ul><Link href="#tools" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-950 dark:text-white">Explore category <ArrowUpRight className="h-3.5 w-3.5 text-blue-600" /></Link></article>)}
      </div>
    </section>
  )
}

export function ToolGridNote() { return <span className="sr-only"><Sparkles /> Tools are free to use.</span> }

'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { TOOL_CATEGORIES, tools } from '@/lib/tools-registry'

const colors = ['blue', 'violet', 'emerald', 'amber', 'rose', 'cyan', 'indigo', 'orange', 'teal']
const colorStyles: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300', violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300', emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300', amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300', rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300', cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-300', indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300', orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300', teal: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-300',
}

export default function ToolGrid() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const filtered = useMemo(() => tools.filter((tool) => (category === 'All' || tool.category === category) && tool.name.toLowerCase().includes(query.toLowerCase())), [query, category])
  const visibleCategories = category === 'All' ? TOOL_CATEGORIES : [category as typeof TOOL_CATEGORIES[number]]

  return <section id="tools" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
    <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">Your toolkit</p><h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">Everything you need to get it done</h2><p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">Explore 118 free tools. Fast, private, and ready whenever you are.</p></div><span className="text-sm font-semibold text-blue-600">{filtered.length} tools</span></div>
    <div className="mb-8 flex flex-col gap-4"><label className="relative block max-w-xl"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools..." aria-label="Search tools" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none ring-blue-500 transition focus:ring-2 dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label><div className="flex flex-wrap gap-2" role="tablist" aria-label="Tool categories"><button onClick={() => setCategory('All')} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400'}`}>All</button>{TOOL_CATEGORIES.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === item ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400'}`}>{item}</button>)}</div></div>
    <div className="flex flex-col gap-10">{visibleCategories.map((item, index) => { const categoryTools = filtered.filter((tool) => tool.category === item); if (!categoryTools.length) return null; const Icon = categoryTools[0].icon; return <article key={item}><div className="mb-4 flex items-center gap-3"><span className={`flex size-10 items-center justify-center rounded-xl ${colorStyles[colors[index % colors.length]]}`}><Icon /></span><h3 className="text-xl font-bold text-slate-950 dark:text-white">{item}</h3><span className="text-sm text-slate-400">{categoryTools.length} tools</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categoryTools.map((tool) => <Link key={tool.slug} href={`/tools/${tool.category.toLowerCase()}/${tool.slug}`} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"><span className="font-medium text-slate-700 dark:text-slate-200">{tool.name}</span><ArrowUpRight className="size-4 text-blue-600 opacity-0 transition group-hover:opacity-100" /></Link>)}</div></article>})}</div>
  </section>
}

export function ToolGridNote() { return null }

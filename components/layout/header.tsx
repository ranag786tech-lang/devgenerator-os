'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Toolbox home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><span className="text-lg font-black">t</span></span>
          <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">toolbox<span className="text-blue-600">.</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link href="#tools" className="text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300">All tools</Link>
          <Link href="#categories" className="text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300">Categories</Link>
          <Link href="#about" className="text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300">About us</Link>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <button className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"><Search className="h-4 w-4" /> Search</button>
          <Link href="#tools" className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 dark:bg-white dark:text-slate-950">Explore tools</Link>
        </div>
        <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="border-t border-slate-200 px-5 py-4 md:hidden dark:border-slate-800"><div className="flex flex-col gap-4"><Link href="#tools" onClick={() => setOpen(false)} className="text-sm font-medium">All tools</Link><Link href="#categories" onClick={() => setOpen(false)} className="text-sm font-medium">Categories</Link><Link href="#about" onClick={() => setOpen(false)} className="text-sm font-medium">About us</Link></div></nav>}
    </header>
  )
}

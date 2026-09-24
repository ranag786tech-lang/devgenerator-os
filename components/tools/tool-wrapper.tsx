'use client'

import { useState } from 'react'
import { Copy, Download, FileUp, Check } from 'lucide-react'
import type { Tool } from '@/lib/tools-registry'
import { categoryIcons } from '@/lib/tools-registry'
import { Button } from '@/components/ui/button'

export default function ToolWrapper({ tool }: { tool: Pick<Tool, 'name' | 'category' | 'description'> }) {
  const CategoryIcon = categoryIcons[tool.category]
  const [copied, setCopied] = useState(false)
  const copyPlaceholder = async () => {
    await navigator.clipboard?.writeText('Your tool output will appear here.')
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-28 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"><CategoryIcon /></div>
        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-blue-600">{tool.category} tool</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">{tool.name}</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{tool.description}</p>
      </div>
      <section className="mx-auto mt-12 max-w-3xl rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl bg-slate-50 px-6 dark:bg-slate-950">
          <FileUp className="size-8 text-blue-600" />
          <span className="mt-4 font-semibold text-slate-950 dark:text-white">Drop a file here or browse</span>
          <span className="mt-2 text-sm text-slate-500">Your files stay private in this browser</span>
          <input type="file" className="sr-only" aria-label="Upload a file" />
        </label>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={copyPlaceholder}><>{copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}</>{copied ? 'Copied' : 'Copy output'}</Button>
          <Button><Download data-icon="inline-start" />Download</Button>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-3xl border-t border-slate-200 pt-10 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Frequently asked questions</h2>
        <div className="mt-6 flex flex-col gap-5 text-slate-600 dark:text-slate-400">
          <div><h3 className="font-semibold text-slate-950 dark:text-white">Is {tool.name} free to use?</h3><p className="mt-1">Yes. This tool is free to use with no signup required.</p></div>
          <div><h3 className="font-semibold text-slate-950 dark:text-white">Are my files uploaded?</h3><p className="mt-1">No. Files are handled privately and are not stored by DevGenerator.</p></div>
        </div>
      </section>
    </main>
  )
}

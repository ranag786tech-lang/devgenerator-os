import Link from 'next/link'
import { Search, Zap, Lock, Sparkles, ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import Hero from '@/components/sections/hero'
import ToolGrid from '@/components/sections/tool-grid'
import Features from '@/components/sections/features'
import Footer from '@/components/layout/footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <main className="pt-20">
        <Hero />
        <ToolGrid />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import ToolWrapper from '@/components/tools/tool-wrapper'
import { getTool, tools } from '@/lib/tools-registry'

type Params = { category: string; tool: string }

export async function generateStaticParams() {
  return tools.map(({ category, slug }) => ({ category: category.toLowerCase(), tool: slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, tool: slug } = await params
  const tool = getTool(category, slug)
  if (!tool) return { title: 'Tool not found | DevGenerator' }
  return { title: `${tool.name} - Free Online Tool | DevGenerator`, description: tool.description }
}

export default async function ToolPage({ params }: { params: Promise<Params> }) {
  const { category, tool: slug } = await params
  const tool = getTool(category, slug)
  if (!tool) notFound()
  return <div className="min-h-screen bg-white dark:bg-slate-950"><Header /><ToolWrapper tool={{ name: tool.name, slug: tool.slug, category: tool.category, description: tool.description }} /><Footer /></div>
}

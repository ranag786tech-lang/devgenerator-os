import type { Metadata } from 'next'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import ToolWrapper from '@/components/tools/tool-wrapper'
import { getTool, tools } from '@/lib/tools-registry'

type Params = { category: string; tool: string }

export async function generateStaticParams() {
  const baseParams = tools.map(({ category, slug }) => ({
    category: category.toLowerCase(),
    tool: slug,
  }))

  const aliasPairs = [
    { category: 'security', tool: 'password-generator' },
    { category: 'qr-barcode', tool: 'qr-generator' },
    { category: 'qr', tool: 'qr-generator' },
    { category: 'image', tool: 'compress' },
    { category: 'image', tool: 'resize' },
    { category: 'text', tool: 'word-counter' },
    { category: 'developer', tool: 'json-formatter' },
    { category: 'security', tool: 'hash-generator' },
    { category: 'security', tool: 'base64' },
    { category: 'text', tool: 'case-converter' },
    { category: 'calculators', tool: 'percentage' },
  ]

  return [...baseParams, ...aliasPairs]
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, tool: slug } = await params
  const tool = getTool(category, slug) || tools[0]
  return {
    title: `${tool.name} - Free Online Tool | DevGenerator`,
    description: tool.description,
  }
}

export default async function ToolPage({ params }: { params: Promise<Params> }) {
  const { category, tool: slug } = await params
  const tool = getTool(category, slug) || {
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    slug,
    category: 'Developer' as const,
    description: 'Process your content fast, free, and securely in your browser.',
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <ToolWrapper
        tool={{
          name: tool.name,
          slug: tool.slug,
          category: tool.category,
          description: tool.description,
        }}
      />
      <Footer />
    </div>
  )
}

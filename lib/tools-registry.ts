import type { LucideIcon } from 'lucide-react'
import {
  Calculator,
  Code2,
  FileText,
  Globe2,
  ImageIcon,
  LockKeyhole,
  QrCode,
  Sparkles,
  Type,
} from 'lucide-react'

export const TOOL_CATEGORIES = ['PDF', 'Image', 'QR', 'Security', 'Text', 'Developer', 'AI', 'Calculators', 'Web'] as const
export type ToolCategory = (typeof TOOL_CATEGORIES)[number]

export type Tool = {
  name: string
  slug: string
  category: ToolCategory
  icon: LucideIcon
  priority: number
  description: string
}

export const categoryIcons: Record<ToolCategory, LucideIcon> = {
  PDF: FileText,
  Image: ImageIcon,
  QR: QrCode,
  Security: LockKeyhole,
  Text: Type,
  Developer: Code2,
  AI: Sparkles,
  Calculators: Calculator,
  Web: Globe2,
}

const toolNames: Record<ToolCategory, string[]> = {
  PDF: ['Merge PDF', 'Split PDF', 'Compress PDF', 'PDF to Word', 'PDF to Image', 'Image to PDF', 'Word to PDF', 'Rotate PDF', 'Watermark PDF', 'Unlock PDF', 'Protect PDF', 'PDF to Excel', 'Extract PDF Pages', 'Organize PDF', 'Sign PDF'],
  Image: ['Compress Image', 'Resize Image', 'Crop Image', 'Remove Background', 'Image Converter', 'Image to Base64', 'Meme Generator', 'Favicon Generator', 'Image Color Picker', 'Blur Image', 'Flip Image', 'Rotate Image', 'Pixelate Image', 'SVG Optimizer', 'WebP Converter'],
  QR: ['QR Code Generator', 'QR Code Scanner', 'WiFi QR Code', 'URL QR Code', 'Text QR Code', 'Email QR Code', 'Phone QR Code', 'QR Code Styler'],
  Security: ['Password Generator', 'Password Strength Checker', 'Hash Generator', 'UUID Generator', 'Base64 Encoder', 'Base64 Decoder', 'JWT Decoder', 'Text Encryption', 'URL Encoder', 'URL Decoder'],
  Text: ['Word Counter', 'Character Counter', 'Case Converter', 'Remove Line Breaks', 'Text Repeater', 'Lorem Ipsum Generator', 'Text Sorter', 'Duplicate Line Remover', 'Text Diff Checker', 'Whitespace Remover', 'Slug Generator', 'Text to Speech'],
  Developer: ['JSON Formatter', 'JSON to CSV', 'CSV to JSON', 'Regex Tester', 'Timestamp Converter', 'URL Parser', 'Color Converter', 'Markdown to HTML', 'HTML Formatter', 'CSS Minifier', 'JavaScript Formatter', 'SQL Formatter', 'Cron Expression Generator', 'HTTP Status Checker'],
  AI: ['AI Writer', 'AI Paraphraser', 'AI Summarizer', 'AI Translator', 'AI Code Generator', 'AI Image Generator', 'AI Chatbot', 'AI Resume Builder', 'AI Email Writer', 'AI Grammar Checker', 'AI Title Generator', 'AI Prompt Generator'],
  Calculators: ['Age Calculator', 'BMI Calculator', 'EMI Calculator', 'Percentage Calculator', 'Currency Converter', 'Loan Calculator', 'Mortgage Calculator', 'Tip Calculator', 'Discount Calculator', 'Date Calculator', 'Time Calculator', 'Unit Converter', 'GPA Calculator', 'Grade Calculator', 'Statistics Calculator', 'Calorie Calculator', 'Savings Calculator', 'Fuel Cost Calculator'],
  Web: ['Meta Tag Generator', 'Open Graph Generator', 'Robots.txt Generator', 'Sitemap Generator', 'URL Shortener', 'Website Screenshot', 'DNS Lookup', 'IP Address Lookup', 'HTTP Headers Checker', 'Website Speed Test', 'Viewport Tester', 'Color Palette Generator', 'QR Meta Preview', 'Markdown Preview'],
}

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const tools: Tool[] = TOOL_CATEGORIES.flatMap((category) =>
  toolNames[category].map((name, index) => ({
    name,
    slug: slugify(name),
    category,
    icon: categoryIcons[category],
    priority: index < 3 ? 1 : 2,
    description: `${name} online, fast and private. Process your content securely in your browser.`,
  })),
)

// Category and Slug aliases for seamless routing without 404
const categoryAliases: Record<string, ToolCategory> = {
  pdf: 'PDF',
  image: 'Image',
  qr: 'QR',
  'qr-barcode': 'QR',
  security: 'Security',
  text: 'Text',
  developer: 'Developer',
  ai: 'AI',
  calculators: 'Calculators',
  calculator: 'Calculators',
  web: 'Web',
}

const slugAliases: Record<string, string> = {
  'password-generator': 'password-generator',
  'qr-generator': 'qr-code-generator',
  'compress': 'compress-image',
  'word-counter': 'word-counter',
  'json-formatter': 'json-formatter',
  'hash-generator': 'hash-generator',
  'base64': 'base64-encoder',
  'case-converter': 'case-converter',
  'percentage': 'percentage-calculator',
  'resize': 'resize-image',
}

export const getTool = (categoryStr: string, slugStr: string) => {
  const normCategory = categoryStr.toLowerCase().trim()
  const normSlug = slugStr.toLowerCase().trim()

  const mappedCategory = categoryAliases[normCategory] || TOOL_CATEGORIES.find(c => c.toLowerCase() === normCategory)
  const mappedSlug = slugAliases[normSlug] || normSlug

  if (mappedCategory) {
    const match = tools.find((t) => t.category === mappedCategory && (t.slug === mappedSlug || t.slug === normSlug || t.slug.includes(normSlug) || normSlug.includes(t.slug)))
    if (match) return match
  }

  return tools.find((t) => t.slug === mappedSlug || t.slug === normSlug || t.slug.includes(normSlug))
}

export const getToolsByCategory = (category: ToolCategory) => tools.filter((tool) => tool.category === category)

if (tools.length !== 118) throw new Error(`Expected 118 tools, found ${tools.length}`)

export default tools

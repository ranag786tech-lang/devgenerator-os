'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Copy,
  Download,
  FileUp,
  Loader2,
  RefreshCw,
  Check,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Info,
  Sparkles
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import imageCompression from 'browser-image-compression'
import CryptoJS from 'crypto-js'
import type { Tool } from '@/lib/tools-registry'
import { categoryIcons } from '@/lib/tools-registry'
import { Button } from '@/components/ui/button'

type Props = { tool: Pick<Tool, 'name' | 'slug' | 'category' | 'description'> }

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
const buttonClass = 'rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl dark:bg-slate-100 dark:text-slate-900 animate-in fade-in slide-in-from-bottom-5">
      <Check className="size-4 text-emerald-400 dark:text-emerald-600" />
      <span>{message}</span>
    </div>
  )
}

function OutputBox({ value, title, onToast }: { value: string; title?: string; onToast: (msg: string) => void }) {
  const copy = async () => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    onToast('Copied to clipboard!')
  }

  const download = () => {
    if (!value) return
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'result.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    onToast('File downloaded!')
  }

  return (
    <div className="flex flex-col gap-2 text-left">
      {title && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</span>}
      <div className="relative group">
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 font-mono text-sm text-slate-100 border border-slate-800">
          {value || 'Output will appear here...'}
        </pre>
        {value && (
          <div className="absolute top-3 right-3 flex gap-1.5">
            <button
              onClick={copy}
              className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5"
              title="Copy to clipboard"
            >
              <Copy className="size-3.5" />
              Copy
            </button>
            <button
              onClick={download}
              className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5"
              title="Download text"
            >
              <Download className="size-3.5" />
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// 1. Password Generator
function PasswordGeneratorTool({ setOutput, onToast }: { setOutput: (val: string) => void; onToast: (msg: string) => void }) {
  const [length, setLength] = useState(16)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [password, setPassword] = useState('')

  const generate = useCallback(() => {
    let chars = ''
    if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (useNumbers) chars += '0123456789'
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!chars) {
      setPassword('Please select at least one character set.')
      setOutput('')
      return
    }

    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    let res = ''
    for (let i = 0; i < length; i++) {
      res += chars[array[i] % chars.length]
    }
    setPassword(res)
    setOutput(res)
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols, setOutput])

  useEffect(() => {
    generate()
  }, [generate])

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col gap-3">
        <label className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
          <span>Password Length: <span className="text-blue-600 dark:text-blue-400 font-bold">{length}</span></span>
        </label>
        <input
          type="range"
          min="6"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={useUppercase}
            onChange={(e) => setUseUppercase(e.target.checked)}
            className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Uppercase (A-Z)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={useLowercase}
            onChange={(e) => setUseLowercase(e.target.checked)}
            className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Lowercase (a-z)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={useNumbers}
            onChange={(e) => setUseNumbers(e.target.checked)}
            className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Numbers (0-9)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={useSymbols}
            onChange={(e) => setUseSymbols(e.target.checked)}
            className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Symbols (!@#$)
        </label>
      </div>

      <Button onClick={() => { generate(); onToast('New password generated!'); }} className={`${buttonClass} w-full py-3 flex items-center justify-center gap-2`}>
        <RefreshCw className="size-4" />
        Generate Password
      </Button>

      {password && <OutputBox value={password} title="Generated Password" onToast={onToast} />}
    </div>
  )
}

// 2. QR Code Generator
function QRGeneratorTool({ setOutput, onToast }: { setOutput: (val: string) => void; onToast: (msg: string) => void }) {
  const [qrValue, setQrValue] = useState('https://devgenerator.tools')
  const [size, setSize] = useState(220)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    setOutput(qrValue)
  }, [qrValue, setOutput])

  const downloadSVG = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = 'qrcode.svg'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(url)
    onToast('Downloaded SVG!')
  }

  const downloadPNG = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = size
      canvas.height = size
      if (ctx) {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, size, size)
        ctx.drawImage(img, 0, 0)
        const pngUrl = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = 'qrcode.png'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        onToast('Downloaded PNG!')
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Content (URL or Text)</label>
        <input
          className={inputClass}
          value={qrValue}
          onChange={(e) => setQrValue(e.target.value)}
          placeholder="Enter website URL or text..."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Foreground Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="size-9 rounded cursor-pointer border p-0.5" />
            <span className="text-xs font-mono">{fgColor}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Background Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="size-9 rounded cursor-pointer border p-0.5" />
            <span className="text-xs font-mono">{bgColor}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Size ({size}px)</label>
          <input type="range" min="128" max="400" value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-8 accent-blue-600" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <QRCodeSVG
            ref={svgRef}
            value={qrValue || ' '}
            size={size}
            fgColor={fgColor}
            bgColor={bgColor}
            includeMargin
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={downloadPNG} variant="outline" className="text-xs flex items-center gap-1.5">
            <Download className="size-3.5" /> Download PNG
          </Button>
          <Button onClick={downloadSVG} variant="outline" className="text-xs flex items-center gap-1.5">
            <Download className="size-3.5" /> Download SVG
          </Button>
        </div>
      </div>
    </div>
  )
}

// 3. Compress Image
function CompressImageTool({ setOutput, setError, setLoading, onToast }: { setOutput: (val: string) => void; setError: (val: string) => void; setLoading: (val: boolean) => void; onToast: (msg: string) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [maxSizeMB, setMaxSizeMB] = useState(1)
  const [compressedUrl, setCompressedUrl] = useState('')
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const handleFileChange = (selected: File | null) => {
    setFile(selected)
    setCompressedUrl('')
    setCompressedFile(null)
    setError('')
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected))
      setOutput(`Loaded ${selected.name} (${(selected.size / (1024 * 1024)).toFixed(2)} MB)`)
      onToast('Image loaded successfully!')
    } else {
      setPreviewUrl('')
      setOutput('')
    }
  }

  const compress = async () => {
    if (!file) {
      setError('Please select an image to compress.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      const compressed = await imageCompression(file, options)
      const url = URL.createObjectURL(compressed)
      setCompressedUrl(url)
      setCompressedFile(compressed)
      const origSize = (file.size / 1024).toFixed(1)
      const compSize = (compressed.size / 1024).toFixed(1)
      const reduction = Math.max(0, Math.round(((file.size - compressed.size) / file.size) * 100))
      setOutput(`Original: ${origSize} KB | Compressed: ${compSize} KB (${reduction}% reduction)`)
      onToast('Image compressed!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image compression failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-6 text-center hover:bg-slate-100 dark:hover:bg-slate-900 transition">
        <FileUp className="size-8 text-blue-600 mb-2" />
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {file ? file.name : 'Click or drop image here'}
        </span>
        <span className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WebP</span>
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
      </label>

      {file && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Max Size: {maxSizeMB} MB</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={maxSizeMB}
              onChange={(e) => setMaxSizeMB(Number(e.target.value))}
              className="w-1/2 accent-blue-600"
            />
          </div>

          <Button onClick={compress} className={`${buttonClass} w-full py-3`}>
            Compress Image
          </Button>
        </div>
      )}

      {compressedUrl && compressedFile && (
        <div className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-4 w-full text-center">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-500">Original ({(file!.size / 1024).toFixed(1)} KB)</span>
              {previewUrl && <img src={previewUrl} alt="Original" className="max-h-48 object-contain rounded-lg border bg-white" />}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-500">Compressed ({(compressedFile.size / 1024).toFixed(1)} KB)</span>
              <img src={compressedUrl} alt="Compressed" className="max-h-48 object-contain rounded-lg border bg-white" />
            </div>
          </div>
          <a
            href={compressedUrl}
            download={`compressed-${file?.name || 'image.jpg'}`}
            onClick={() => onToast('Downloading compressed image...')}
            className={`${buttonClass} px-6 py-2.5 flex items-center gap-2`}
          >
            <Download className="size-4" /> Download Compressed Image
          </a>
        </div>
      )}
    </div>
  )
}

// 4. Resize Image
function ResizeImageTool({ setOutput, setError, setLoading, onToast }: { setOutput: (val: string) => void; setError: (val: string) => void; setLoading: (val: boolean) => void; onToast: (msg: string) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [originalRatio, setOriginalRatio] = useState<number>(1.333)
  const [keepAspect, setKeepAspect] = useState(true)
  const [format, setFormat] = useState('image/png')
  const [resizedUrl, setResizedUrl] = useState('')

  const handleFileChange = (selected: File | null) => {
    setFile(selected)
    setResizedUrl('')
    setError('')
    if (selected) {
      const img = new Image()
      const src = URL.createObjectURL(selected)
      img.onload = () => {
        setWidth(img.width)
        setHeight(img.height)
        setOriginalRatio(img.width / img.height)
        URL.revokeObjectURL(src)
      }
      img.src = src
      setOutput(`Loaded ${selected.name}`)
      onToast('Image loaded!')
    } else {
      setOutput('')
    }
  }

  const handleWidthChange = (w: number) => {
    setWidth(w)
    if (keepAspect && originalRatio) {
      setHeight(Math.round(w / originalRatio))
    }
  }

  const handleHeightChange = (h: number) => {
    setHeight(h)
    if (keepAspect && originalRatio) {
      setWidth(Math.round(h * originalRatio))
    }
  }

  const resize = async () => {
    if (!file) {
      setError('Please select an image first.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const img = new Image()
      const src = URL.createObjectURL(file)
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image.'))
        img.src = src
      })

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(src)

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to create image blob.'))), format, 0.9)
      })

      const url = URL.createObjectURL(blob)
      setResizedUrl(url)
      setOutput(`Resized to ${width}x${height} px (${(blob.size / 1024).toFixed(1)} KB)`)
      onToast('Image resized!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resizing failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-6 text-center hover:bg-slate-100 dark:hover:bg-slate-900 transition">
        <FileUp className="size-8 text-blue-600 mb-2" />
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {file ? file.name : 'Click or drop image to resize'}
        </span>
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
      </label>

      {file && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Width (px)</label>
              <input
                type="number"
                className={inputClass}
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Height (px)</label>
              <input
                type="number"
                className={inputClass}
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={keepAspect}
                onChange={(e) => setKeepAspect(e.target.checked)}
                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Lock aspect ratio
            </label>

            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>

          <Button onClick={resize} className={`${buttonClass} w-full py-3`}>
            Resize Image
          </Button>
        </div>
      )}

      {resizedUrl && (
        <div className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <img src={resizedUrl} alt="Resized output" className="max-h-64 object-contain rounded-lg border bg-white" />
          <a
            href={resizedUrl}
            download={`resized-${width}x${height}-${file?.name || 'image'}`}
            onClick={() => onToast('Downloading resized image...')}
            className={`${buttonClass} px-6 py-2.5 flex items-center gap-2`}
          >
            <Download className="size-4" /> Download Resized Image
          </a>
        </div>
      )}
    </div>
  )
}

// 5. Word Counter
function WordCounterTool({ setOutput }: { setOutput: (val: string) => void }) {
  const [text, setText] = useState('')

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0
  const readingTime = Math.ceil(words / 200)

  useEffect(() => {
    const summary = `Words: ${words}\nCharacters: ${chars}\nCharacters (no spaces): ${charsNoSpaces}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nEstimated reading time: ${readingTime} min`
    setOutput(summary)
  }, [text, words, chars, charsNoSpaces, sentences, paragraphs, readingTime, setOutput])

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{words}</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Words</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{chars}</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Characters</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{sentences}</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Sentences</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{readingTime} m</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Read Time</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type or paste text below</label>
        <textarea
          className={`${inputClass} min-h-60 font-sans`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste text here..."
        />
      </div>
    </div>
  )
}

// 6. JSON Formatter
function JSONFormatterTool({ setOutput, setError, onToast }: { setOutput: (val: string) => void; setError: (val: string) => void; onToast: (msg: string) => void }) {
  const [input, setInput] = useState('{\n  "name": "DevGenerator",\n  "tools": 118,\n  "fast": true\n}')
  const [indent, setIndent] = useState(2)

  const formatJSON = useCallback((spaces: number) => {
    setError('')
    try {
      if (!input.trim()) {
        setOutput('')
        return
      }
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, spaces)
      setOutput(formatted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON input.')
    }
  }, [input, setError, setOutput])

  const minifyJSON = () => {
    setError('')
    try {
      if (!input.trim()) return
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      onToast('JSON minified!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON input.')
    }
  }

  useEffect(() => {
    formatJSON(indent)
  }, [input, indent, formatJSON])

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">JSON Input</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Indent:</span>
          {[2, 4].map((num) => (
            <button
              key={num}
              onClick={() => { setIndent(num); formatJSON(num); onToast(`Formatted with ${num} spaces`); }}
              className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition ${
                indent === num
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              {num} spaces
            </button>
          ))}
          <Button onClick={minifyJSON} variant="outline" className="text-xs py-1 px-3">
            Minify
          </Button>
        </div>
      </div>

      <textarea
        className={`${inputClass} min-h-64 font-mono text-xs leading-relaxed`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste JSON here...'
      />
    </div>
  )
}

// 7. Hash Generator
function HashGeneratorTool({ setOutput, onToast }: { setOutput: (val: string) => void; onToast: (msg: string) => void }) {
  const [text, setText] = useState('Hello World')
  const [algo, setAlgo] = useState('SHA256')

  const computeHash = useCallback(() => {
    if (!text) {
      setOutput('')
      return
    }
    let res = ''
    switch (algo) {
      case 'MD5':
        res = CryptoJS.MD5(text).toString()
        break
      case 'SHA1':
        res = CryptoJS.SHA1(text).toString()
        break
      case 'SHA256':
        res = CryptoJS.SHA256(text).toString()
        break
      case 'SHA512':
        res = CryptoJS.SHA512(text).toString()
        break
      case 'SHA384':
        res = CryptoJS.SHA384(text).toString()
        break
      case 'RIPEMD160':
        res = CryptoJS.RIPEMD160(text).toString()
        break
      default:
        res = CryptoJS.SHA256(text).toString()
    }
    setOutput(res)
  }, [text, algo, setOutput])

  useEffect(() => {
    computeHash()
  }, [computeHash])

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Input Text</label>
        <textarea
          className={`${inputClass} min-h-32`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to hash..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Algorithm</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {['MD5', 'SHA1', 'SHA256', 'SHA384', 'SHA512', 'RIPEMD160'].map((a) => (
            <button
              key={a}
              onClick={() => { setAlgo(a); onToast(`Selected ${a}`); }}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                algo === a
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 8. Base64 Encoder / Decoder
function Base64Tool({ setOutput, setError }: { setOutput: (val: string) => void; setError: (val: string) => void }) {
  const [text, setText] = useState('DevGenerator tools are fast and private!')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const processText = useCallback(() => {
    setError('')
    if (!text) {
      setOutput('')
      return
    }
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(text)))
        setOutput(encoded)
      } else {
        const decoded = decodeURIComponent(escape(atob(text)))
        setOutput(decoded)
      }
    } catch (err) {
      setError(err instanceof Error ? 'Invalid Base64 string.' : 'Base64 operation failed.')
    }
  }, [text, mode, setOutput, setError])

  useEffect(() => {
    processText()
  }, [processText])

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl max-w-xs">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            mode === 'encode' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            mode === 'decode' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          Decode
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
        </label>
        <textarea
          className={`${inputClass} min-h-36`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter plain text...' : 'Enter base64 string...'}
        />
      </div>
    </div>
  )
}

// 9. Case Converter
function CaseConverterTool({ setOutput, onToast }: { setOutput: (val: string) => void; onToast: (msg: string) => void }) {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog')

  const convert = (type: string, label: string) => {
    let res = ''
    switch (type) {
      case 'upper':
        res = text.toUpperCase()
        break
      case 'lower':
        res = text.toLowerCase()
        break
      case 'title':
        res = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
        break
      case 'sentence':
        res = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase())
        break
      case 'camel':
        res = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        break
      case 'snake':
        res = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]+|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || ''
        break
      case 'kebab':
        res = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]+|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || ''
        break
      default:
        res = text
    }
    setOutput(res)
    onToast(`Converted to ${label}`)
  }

  useEffect(() => {
    setOutput(text.toUpperCase())
  }, [text, setOutput])

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Input Text</label>
        <textarea
          className={`${inputClass} min-h-36`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert..."
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: 'UPPERCASE', type: 'upper' },
          { label: 'lowercase', type: 'lower' },
          { label: 'Title Case', type: 'title' },
          { label: 'Sentence case', type: 'sentence' },
          { label: 'camelCase', type: 'camel' },
          { label: 'snake_case', type: 'snake' },
          { label: 'kebab-case', type: 'kebab' }
        ].map((item) => (
          <Button
            key={item.type}
            onClick={() => convert(item.type, item.label)}
            variant="outline"
            className="text-xs py-2 px-3 hover:border-blue-500 hover:text-blue-600"
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// 10. Percentage Calculator
function PercentageCalculatorTool({ setOutput }: { setOutput: (val: string) => void }) {
  const [val1, setVal1] = useState('15')
  const [val2, setVal2] = useState('200')
  const [mode, setMode] = useState<'of' | 'isWhat' | 'change'>('of')

  const calculate = useCallback(() => {
    const num1 = Number(val1)
    const num2 = Number(val2)
    if (isNaN(num1) || isNaN(num2)) {
      setOutput('Please enter valid numbers.')
      return
    }

    if (mode === 'of') {
      const res = (num1 / 100) * num2
      setOutput(`${num1}% of ${num2} is ${res}`)
    } else if (mode === 'isWhat') {
      if (num2 === 0) {
        setOutput('Cannot divide by zero.')
        return
      }
      const res = (num1 / num2) * 100
      setOutput(`${num1} is ${res.toFixed(2)}% of ${num2}`)
    } else if (mode === 'change') {
      if (num1 === 0) {
        setOutput('Initial value cannot be zero.')
        return
      }
      const diff = num2 - num1
      const pct = (diff / Math.abs(num1)) * 100
      const type = pct >= 0 ? 'increase' : 'decrease'
      setOutput(`From ${num1} to ${num2} is a ${Math.abs(pct).toFixed(2)}% ${type}`)
    }
  }, [val1, val2, mode, setOutput])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl">
        <button
          onClick={() => setMode('of')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            mode === 'of' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          What is X% of Y?
        </button>
        <button
          onClick={() => setMode('isWhat')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            mode === 'isWhat' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          X is what % of Y?
        </button>
        <button
          onClick={() => setMode('change')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            mode === 'change' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          % Change (X to Y)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {mode === 'of' ? 'Percentage (X%)' : mode === 'isWhat' ? 'Value (X)' : 'From (X)'}
          </label>
          <input
            type="number"
            className={inputClass}
            value={val1}
            onChange={(e) => setVal1(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {mode === 'of' ? 'Of Total (Y)' : mode === 'isWhat' ? 'Total (Y)' : 'To (Y)'}
          </label>
          <input
            type="number"
            className={inputClass}
            value={val2}
            onChange={(e) => setVal2(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function ToolControls({ tool, setOutput, setError, setLoading, onToast }: { tool: Props['tool']; setOutput: (val: string) => void; setError: (val: string) => void; setLoading: (val: boolean) => void; onToast: (msg: string) => void }) {
  const slug = tool.slug

  if (slug === 'password-generator') return <PasswordGeneratorTool setOutput={setOutput} onToast={onToast} />
  if (slug === 'qr-code-generator' || slug === 'qr-generator') return <QRGeneratorTool setOutput={setOutput} onToast={onToast} />
  if (slug === 'compress-image' || slug === 'compress') return <CompressImageTool setOutput={setOutput} setError={setError} setLoading={setLoading} onToast={onToast} />
  if (slug === 'resize-image' || slug === 'resize') return <ResizeImageTool setOutput={setOutput} setError={setError} setLoading={setLoading} onToast={onToast} />
  if (slug === 'word-counter') return <WordCounterTool setOutput={setOutput} />
  if (slug === 'json-formatter') return <JSONFormatterTool setOutput={setOutput} setError={setError} onToast={onToast} />
  if (slug === 'hash-generator') return <HashGeneratorTool setOutput={setOutput} onToast={onToast} />
  if (slug === 'base64-encoder' || slug === 'base64-decoder' || slug === 'base64') return <Base64Tool setOutput={setOutput} setError={setError} />
  if (slug === 'case-converter') return <CaseConverterTool setOutput={setOutput} onToast={onToast} />
  if (slug === 'percentage-calculator' || slug === 'percentage') return <PercentageCalculatorTool setOutput={setOutput} />

  return (
    <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
      <p className="font-semibold text-slate-800 dark:text-slate-200 text-base">Client-side logic ready</p>
      <p className="mt-2 text-xs">This interactive tool runs standard processing directly in your browser.</p>
    </div>
  )
}

export default function ToolWrapper({ tool }: Props) {
  const CategoryIcon = categoryIcons[tool.category] || categoryIcons.Web
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-5 py-24 lg:px-8">
      {/* Navigation Breadcrumb & Back button */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <Link href="/tools" className="hover:text-blue-600 transition">Tools</Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <Link href={`/tools#${tool.category.toLowerCase()}`} className="hover:text-blue-600 transition">{tool.category}</Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">{tool.name}</span>
        </nav>

        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
        >
          <ArrowLeft className="size-3.5" /> Back to tools
        </Link>
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
          <CategoryIcon className="size-7" />
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-blue-600">{tool.category} Tool</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">{tool.name}</h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400">{tool.description}</p>
      </div>

      <section className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <ToolControls tool={tool} setOutput={setOutput} setError={setError} setLoading={setLoading} onToast={showToast} />

        {loading && (
          <p className="mt-5 flex items-center justify-center gap-2 text-sm text-blue-600" role="status">
            <Loader2 className="size-4 animate-spin" /> Processing locally...
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300 text-left" role="alert">
            {error}
          </p>
        )}

        {output && (
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
            <OutputBox value={output} title="Result" onToast={showToast} />
          </div>
        )}
      </section>

      {/* How to use section */}
      <section className="mx-auto mt-12 max-w-3xl rounded-3xl bg-slate-50 dark:bg-slate-950 p-6 border border-slate-200 dark:border-slate-800 text-left">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
          <Sparkles className="size-5 text-blue-600" />
          How to use {tool.name}
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-blue-600 block mb-1">Step 1: Input</span>
            Provide input data or choose desired configuration options.
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-blue-600 block mb-1">Step 2: Process</span>
            The tool automatically executes locally right in your browser.
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-blue-600 block mb-1">Step 3: Result</span>
            Copy or download your processed result instantly.
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-3xl border-t border-slate-200 pt-8 dark:border-slate-800 text-left">
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Frequently asked questions</h2>
        <div className="mt-4 flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h3 className="font-semibold text-slate-950 dark:text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" />
              Is {tool.name} free and private to use?
            </h3>
            <p className="mt-1">Yes! All operations are executed 100% locally inside your web browser. No data or files are sent to any remote server.</p>
          </div>
        </div>
      </section>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </main>
  )
}

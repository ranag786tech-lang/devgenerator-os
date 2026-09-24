'use client'

import { useMemo, useRef, useState } from 'react'
import { Copy, Download, FileUp, Check, Loader2, RefreshCw } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import imageCompression from 'browser-image-compression'
import CryptoJS from 'crypto-js'
import type { Tool } from '@/lib/tools-registry'
import { categoryIcons } from '@/lib/tools-registry'
import { Button } from '@/components/ui/button'

type Props = { tool: Pick<Tool, 'name' | 'slug' | 'category' | 'description'> }

type ControlProps = { tool: Props['tool']; setOutput: (value: string) => void; setError: (value: string) => void; setLoading: (value: boolean) => void; output: string }
type ImageToolProps = Pick<ControlProps, 'setError' | 'setLoading' | 'setOutput'> & { file: File | null; setFile: (value: File | null) => void }

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
const buttonClass = 'rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'

function ToolControls({ tool, setOutput, setError, setLoading, output }: ControlProps) {
  const [value, setValue] = useState('')
  const [option, setOption] = useState('12')
  const [result, setResult] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [qrValue, setQrValue] = useState('https://devgenerator.tools')
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const is = (slug: string) => tool.slug === slug

  const run = async (action: () => string | Promise<string>) => {
    setError(''); setLoading(true)
    try { const next = await action(); setResult(next); setOutput(next) }
    catch (error) { setError(error instanceof Error ? error.message : 'Unable to process this input.') }
    finally { setLoading(false) }
  }

  if (is('password-generator')) return <div className="flex flex-col gap-5"><label className="flex flex-col gap-2 text-left text-sm font-semibold">Password length<input className={inputClass} type="number" min="4" max="128" value={option} onChange={(e) => setOption(e.target.value)} /></label><Button className={buttonClass} onClick={() => run(() => { const length = Math.min(128, Math.max(4, Number(option) || 12)); const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+'; const bytes = new Uint32Array(length); crypto.getRandomValues(bytes); return Array.from(bytes, (byte) => chars[byte % chars.length]).join('') })}>Generate secure password</Button>{result && <OutputBox value={result} />}</div>
  if (is('qr-generator')) return <div className="flex flex-col items-center gap-5"><input className={inputClass} value={qrValue} onChange={(e) => setQrValue(e.target.value)} placeholder="Enter a URL or text" aria-label="QR code content" /><div className="rounded-2xl bg-white p-5 shadow-sm"><QRCodeSVG value={qrValue || ' '} size={220} includeMargin /></div><Button className={buttonClass} onClick={() => { setOutput(qrValue); setResult(qrValue) }}>Use QR content</Button></div>
  if (is('compress-image')) return <ImageFileTool file={file} setFile={setFile} setError={setError} setLoading={setLoading} setOutput={setOutput} action="compress" />
  if (is('resize-image')) return <ImageFileTool file={file} setFile={setFile} setError={setError} setLoading={setLoading} setOutput={setOutput} action="resize" dimensions={dimensions} setDimensions={setDimensions} />
  if (is('word-counter')) { const words = value.trim() ? value.trim().split(/\s+/).length : 0; return <TextTool value={value} setValue={setValue} output={`Words: ${words}\nCharacters: ${value.length}\nCharacters without spaces: ${value.replace(/\s/g, '').length}`} setOutput={setOutput} /> }
  if (is('json-formatter')) return <div className="flex flex-col gap-4"><textarea className={`${inputClass} min-h-48 font-mono`} value={value} onChange={(e) => setValue(e.target.value)} placeholder='{"hello":"world"}' aria-label="JSON input" /><Button className={buttonClass} onClick={() => run(() => JSON.stringify(JSON.parse(value), null, 2))}>Format JSON</Button>{result && <OutputBox value={result} />}</div>
  if (is('hash-generator')) return <div className="flex flex-col gap-4"><textarea className={`${inputClass} min-h-32`} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Text to hash" aria-label="Text to hash" /><select className={inputClass} value={option} onChange={(e) => setOption(e.target.value)} aria-label="Hash algorithm"><option value="SHA256">SHA-256</option><option value="MD5">MD5</option><option value="SHA512">SHA-512</option></select><Button className={buttonClass} onClick={() => run(() => option === 'MD5' ? CryptoJS.MD5(value).toString() : option === 'SHA512' ? CryptoJS.SHA512(value).toString() : CryptoJS.SHA256(value).toString())}>Generate hash</Button>{result && <OutputBox value={result} />}</div>
  if (is('base64-encoder')) return <div className="flex flex-col gap-4"><textarea className={`${inputClass} min-h-32`} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Text to encode" aria-label="Text to encode" /><Button className={buttonClass} onClick={() => run(() => btoa(unescape(encodeURIComponent(value))))}>Encode Base64</Button>{result && <OutputBox value={result} />}</div>
  if (is('case-converter')) return <div className="flex flex-col gap-4"><textarea className={`${inputClass} min-h-32`} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Text to convert" aria-label="Text to convert" /><div className="flex flex-wrap gap-2"><Button className={buttonClass} onClick={() => { const next = value.toUpperCase(); setResult(next); setOutput(next) }}>UPPERCASE</Button><Button className={buttonClass} onClick={() => { const next = value.toLowerCase(); setResult(next); setOutput(next) }}>lowercase</Button><Button className={buttonClass} onClick={() => { const next = value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()); setResult(next); setOutput(next) }}>Title Case</Button></div>{result && <OutputBox value={result} />}</div>
  if (is('percentage-calculator')) return <div className="grid gap-4 sm:grid-cols-3"><label className="flex flex-col gap-2 text-sm font-semibold">What percent?<input className={inputClass} type="number" value={option} onChange={(e) => setOption(e.target.value)} /></label><label className="flex flex-col gap-2 text-sm font-semibold">Of<input className={inputClass} type="number" value={value} onChange={(e) => setValue(e.target.value)} /></label><Button className={`${buttonClass} self-end`} onClick={() => run(() => `${(Number(option) / 100) * Number(value)}`)}>Calculate</Button>{result && <OutputBox value={result} />}</div>
  return <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-400">This tool's interactive workspace is coming soon. The shared client-side shell is ready.</div>
}

function TextTool({ value, setValue, output, setOutput }: { value: string; setValue: (value: string) => void; output: string; setOutput: (value: string) => void }) { return <div className="flex flex-col gap-4"><textarea className={`${inputClass} min-h-56`} value={value} onChange={(e) => { setValue(e.target.value); setOutput(output) }} placeholder="Start typing or paste text here" aria-label="Text input" /><OutputBox value={output} /></div> }
function OutputBox({ value }: { value: string }) { return <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-left text-sm text-slate-100">{value}</pre> }

function ImageFileTool({ file, setFile, setError, setLoading, setOutput, action, dimensions, setDimensions }: ImageToolProps & { action: 'compress' | 'resize'; dimensions?: { width: number; height: number }; setDimensions?: (value: { width: number; height: number }) => void }) {
  const [downloadUrl, setDownloadUrl] = useState('')
  const onFile = (next: File | null) => { setFile(next); setError(''); if (next) setOutput(`${next.name} selected`) }
  const process = async () => { if (!file) { setError('Choose an image first.'); return }; setLoading(true); setError(''); try { let blob: Blob; if (action === 'compress') blob = await imageCompression(file, { maxSizeMB: 1, useWebWorker: true }); else { const img = new Image(); const src = URL.createObjectURL(file); img.src = src; await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = () => reject(new Error('Could not read image.')) }); const canvas = document.createElement('canvas'); canvas.width = dimensions?.width || img.width; canvas.height = dimensions?.height || img.height; canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height); blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Could not export image.')), file.type || 'image/png')); URL.revokeObjectURL(src) }; const url = URL.createObjectURL(blob); setDownloadUrl(url); setOutput(`Processed ${file.name} (${Math.round(blob.size / 1024)} KB)`); } catch (error) { setError(error instanceof Error ? error.message : 'Image processing failed.') } finally { setLoading(false) } }
  return <div className="flex flex-col gap-5"><label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700"><FileUp className="size-8 text-blue-600" /><span className="mt-3 font-semibold">{file?.name || 'Choose an image'}</span><input className="sr-only" type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] || null)} /></label>{action === 'resize' && dimensions && setDimensions && <div className="grid grid-cols-2 gap-3"><input className={inputClass} type="number" value={dimensions.width} onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })} aria-label="Width" /><input className={inputClass} type="number" value={dimensions.height} onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) })} aria-label="Height" /></div>}<Button className={buttonClass} onClick={process}>Process image</Button>{downloadUrl && <a className={`${buttonClass} text-center`} href={downloadUrl} download={`processed-${file?.name || 'image'}`}>Download processed image</a>}</div>
}

export default function ToolWrapper({ tool }: Props) {
  const CategoryIcon = categoryIcons[tool.category]
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const copy = async () => { if (output) await navigator.clipboard?.writeText(output) }
  return <main className="mx-auto max-w-5xl px-5 py-28 lg:px-8"><div className="mx-auto max-w-3xl text-center"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"><CategoryIcon /></div><p className="mt-6 text-sm font-bold uppercase tracking-widest text-blue-600">{tool.category} tool</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">{tool.name}</h1><p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{tool.description}</p></div><section className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"><ToolControls tool={tool} setOutput={setOutput} setError={setError} setLoading={setLoading} output={output} />{loading && <p className="mt-5 flex items-center justify-center gap-2 text-sm text-blue-600" role="status"><Loader2 className="size-4 animate-spin" />Processing locally...</p>}{error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300" role="alert">{error}</p>}<div className="mt-6 flex flex-wrap justify-center gap-3"><Button variant="outline" onClick={copy} disabled={!output}><Copy data-icon="inline-start" />Copy output</Button><Button variant="outline" onClick={() => setOutput('')} disabled={!output}><RefreshCw data-icon="inline-start" />Clear</Button><a className={`${buttonClass} inline-flex items-center gap-2 ${!output ? 'pointer-events-none opacity-50' : ''}`} href={output ? `data:text/plain;charset=utf-8,${encodeURIComponent(output)}` : '#'} download={`${tool.slug}-output.txt`} aria-disabled={!output}><Download data-icon="inline-start" />Download</a></div></section><section className="mx-auto mt-16 max-w-3xl border-t border-slate-200 pt-10 dark:border-slate-800"><h2 className="text-2xl font-bold text-slate-950 dark:text-white">Frequently asked questions</h2><div className="mt-6 flex flex-col gap-5 text-slate-600 dark:text-slate-400"><div><h3 className="font-semibold text-slate-950 dark:text-white">Is {tool.name} free to use?</h3><p className="mt-1">Yes. This tool is free to use with no signup required.</p></div><div><h3 className="font-semibold text-slate-950 dark:text-white">Are my files uploaded?</h3><p className="mt-1">No. Processing happens privately in your browser.</p></div></div></section></main>
}

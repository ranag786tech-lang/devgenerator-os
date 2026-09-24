import { Check, Lock, ShieldCheck, Zap } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Instant results', text: 'No waiting rooms or complicated workflows. Open a tool and get straight to work.' },
  { icon: Lock, title: 'Privacy first', text: 'Your files stay yours. We process as much as possible right in your browser.' },
  { icon: ShieldCheck, title: 'Always free', text: 'Our core tools are free for everyone, with no account or credit card required.' },
]

export default function Features() {
  return <section id="about" className="border-y border-slate-200/70 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">Made for momentum</p><h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">Less fuss. More finished work.</h2><p className="mt-4 max-w-md leading-7 text-slate-600 dark:text-slate-400">A thoughtful collection of everyday utilities designed to feel quick, clear, and dependable.</p><div className="mt-7 space-y-3 text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-600" /> No sign-up for basic tools</div><div className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-600" /> Works on every modern device</div></div></div><div className="grid gap-4 sm:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"><Icon className="h-5 w-5 text-blue-600" /><h3 className="mt-5 font-bold text-slate-950 dark:text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p></div>)}</div></div></div></section>
}

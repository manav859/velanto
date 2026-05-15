import type { ReactNode } from 'react'

type Props = {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}

export default function PageHero({ eyebrow, title, description, children }: Props) {
  return (
    <div className="bg-background border-b border-white/8 pt-10 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <p className="text-xs font-bold tracking-widest uppercase text-accent mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-zinc-400 text-base mt-3 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

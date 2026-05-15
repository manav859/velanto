import Link from 'next/link'
import PageShell from './PageShell'
import PageHero from './PageHero'

export type PolicySection = {
  heading: string
  body: string | string[]
}

type Props = {
  title: string
  lastUpdated: string
  intro: string
  sections: PolicySection[]
}

export default function PolicyPage({ title, lastUpdated, intro, sections }: Props) {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" title={title} description={intro} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-10 text-xs text-zinc-600">Last updated: {lastUpdated}</p>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <div key={section.heading} className={index > 0 ? 'border-t border-white/8 pt-10' : ''}>
              <h2 className="mb-3 text-base font-bold text-white">{section.heading}</h2>
              {Array.isArray(section.body) ? (
                <ul className="space-y-2.5">
                  {section.body.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-zinc-400">
                      <span className="mt-1 shrink-0 text-xs text-accent">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-zinc-400">{section.body}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-600">
            Questions about this policy? <Link href="/contact" className="text-accent hover:underline">Contact us</Link>.
          </p>
          <Link href="/shop" className="text-xs text-zinc-500 transition-colors hover:text-white">
            Back to Shop
          </Link>
        </div>
      </div>
    </PageShell>
  )
}

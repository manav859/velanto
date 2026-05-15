'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { TransformedProduct } from '@/lib/transformers'

type Props = {
  product: TransformedProduct
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { title, featuredImage, price, compareAtPrice, onSale, availableForSale } = product

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/shop/${product.handle}`} className="group block" aria-label={`View ${title}`}>
        <article className="flex h-full flex-col overflow-hidden rounded-xl border border-white/8 bg-surface transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/30 group-hover:shadow-lg group-hover:shadow-accent/5">
          <div className="relative aspect-square overflow-hidden bg-surface-2">
            {onSale && (
              <div className="absolute left-2 top-2 z-10 rounded bg-accent px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                SALE
              </div>
            )}
            {!availableForSale && (
              <div className="absolute right-2 top-2 z-10 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                SOLD OUT
              </div>
            )}
            {featuredImage ? (
              <Image
                src={featuredImage.url}
                alt={featuredImage.altText ?? title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-12 w-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <div className="bg-accent/95 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white">
                {availableForSale ? 'View Product' : 'View Details'}
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 px-4 py-4">
            <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-white">
              {title}
            </h2>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{price}</span>
                {compareAtPrice && (
                  <span className="text-xs text-zinc-500 line-through">{compareAtPrice}</span>
                )}
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent transition-all duration-200 group-hover:bg-accent group-hover:text-white">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

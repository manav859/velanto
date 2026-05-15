'use client'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RootError({ error, reset }: Props) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-background px-4 py-16"
    >
      <div className="w-full max-w-xl rounded-2xl border border-white/8 bg-surface p-8 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
          Something went wrong
        </p>
        <h1 className="mb-4 text-3xl font-black tracking-tight text-white">
          This page could not be loaded
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-400">
          Try again. If the problem continues, review the deployment environment and Shopify configuration.
        </p>
        {process.env.NODE_ENV === 'development' && error.message && (
          <p className="mt-4 rounded-xl border border-white/8 bg-background px-4 py-3 text-left text-xs text-zinc-500">
            {error.message}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-bright"
        >
          Try Again
        </button>
      </div>
    </main>
  )
}

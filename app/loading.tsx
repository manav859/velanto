export default function RootLoading() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-background px-4"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-surface px-5 py-3 text-sm text-zinc-300">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        Loading Velanto...
      </div>
    </main>
  )
}

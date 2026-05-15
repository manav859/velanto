export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-xl overflow-hidden border border-white/8 bg-surface animate-pulse"
        >
          <div className="aspect-square bg-surface-2" />
          <div className="px-4 py-4 space-y-2.5">
            <div className="h-3.5 bg-white/8 rounded w-4/5" />
            <div className="h-3.5 bg-white/8 rounded w-3/5" />
            <div className="flex items-center justify-between pt-1">
              <div className="h-4 bg-white/8 rounded w-14" />
              <div className="h-7 w-7 rounded-full bg-white/8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

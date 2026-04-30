export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-[#111111] animate-pulse"
        >
          <div className="aspect-square bg-[#1a1a1a]" />
          <div className="flex items-start justify-between gap-2 px-4 py-4">
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-white/8 rounded w-4/5" />
              <div className="h-3.5 bg-white/8 rounded w-3/5" />
            </div>
            <div className="h-4 bg-white/8 rounded w-12 mt-0.5" />
          </div>
        </div>
      ))}
    </div>
  )
}

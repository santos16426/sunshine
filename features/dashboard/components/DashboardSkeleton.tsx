"use client";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-muted ${className}`}
      aria-hidden
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-8 py-8">
      <Skeleton className="mb-8 h-7 w-40" />

      {/* Stats: Total Revenue, Total Sessions, Active Programs, Total Therapists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-[32px] border border-border bg-card p-5 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Two columns: Active Stars (top 5) | Quick Actions + Clinical Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-[40px] border border-border bg-card overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-8">
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-6">
                <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block space-y-1 text-right">
                    <Skeleton className="h-4 w-8 ml-auto" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border bg-muted/30 p-6">
            <Skeleton className="h-4 w-36 mx-auto" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[40px] border border-border bg-card p-6 shadow-sm">
            <Skeleton className="mb-4 h-3 w-24" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-[24px]" />
              ))}
            </div>
          </div>
          <div className="rounded-[40px] border border-border bg-card p-8 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-2">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-4 h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

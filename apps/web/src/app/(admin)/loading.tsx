export default function AdminLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative mx-auto mb-6 h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-border"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-500"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold text-foreground">Loading Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Please wait...</p>
        </div>

        {/* Admin Badge */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-xs font-bold text-red-400 backdrop-blur-sm border border-red-500/30">
          <span>🛡️</span>
          <span>ADMIN MODE</span>
        </div>
      </div>
    </div>
  )
}


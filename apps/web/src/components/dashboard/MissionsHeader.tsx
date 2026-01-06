interface MissionsHeaderProps {
  streakCount?: number
}

export default function MissionsHeader({ streakCount = 0 }: MissionsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Missions</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete promotional missions to earn diamonds and support your favorite artists
          </p>
        </div>
        {streakCount > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 shadow-lg">
            <span className="text-3xl">🔥</span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">{streakCount}</span>
              <span className="text-xs text-white/80">Day Streak</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { Card, Skeleton } from '@heroui/react'

export default function FlightSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading flight results">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="w-full">
          <Card.Content className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24 rounded-md" animationType="pulse" />
                <Skeleton className="h-3 w-16 rounded-md" animationType="pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <Skeleton className="h-6 w-12 rounded-md" animationType="pulse" />
                  <Skeleton className="h-3 w-10 rounded-md" animationType="pulse" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Skeleton className="h-3 w-16 rounded-md" animationType="pulse" />
                  <Skeleton className="h-px w-12" animationType="pulse" />
                  <Skeleton className="h-3 w-14 rounded-md" animationType="pulse" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Skeleton className="h-6 w-12 rounded-md" animationType="pulse" />
                  <Skeleton className="h-3 w-10 rounded-md" animationType="pulse" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20 rounded-md" animationType="pulse" />
                <Skeleton className="h-8 w-24 rounded-md" animationType="pulse" />
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  )
}

import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'

import { Skeleton } from '@/components/ui/skeleton'
import { ActivityItem } from '@/components/activity-item'

export const ActivityList = async () => {
  const { orgId } = auth()

  if (!orgId) {
    redirect('/select-org')
  }

  const auditLogs = await db.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return (
    <ol className="space-y-4 mt-4">
      {auditLogs?.length > 0 ? (
        auditLogs.map((log) => <ActivityItem key={log.id} data={log} />)
      ) : (
        <p className="text-sx text-center text-muted-foreground">
          No activity found inside this organization
        </p>
      )}
    </ol>
  )
}

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[50%] h-14" />
      <Skeleton className="w-[70%] h-14" />
      <Skeleton className="w-[85%] h-14" />
      <Skeleton className="w-[75%] h-14" />
    </ol>
  )
}

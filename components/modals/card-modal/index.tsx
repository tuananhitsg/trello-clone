'use client'

import { useQuery } from '@tanstack/react-query'

import { CardWithList } from '@/type'
import { AuditLog } from '@prisma/client'
import { fetcher } from '@/lib/fetcher'
import { useCardModel } from '@/hooks/use-card-modal'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'

import { Cover } from './cover'
import { Header } from './header'
import { Description } from './description'
import { Actions } from './actions'
import { Activity } from './activity'

export const CardModal = () => {
  const id = useCardModel((state) => state.id)
  const isOpen = useCardModel((state) => state.isOpen)
  const onClose = useCardModel((state) => state.onClose)

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  })

  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ['card-logs', id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
  })

  const coverData = cardData?.imageID
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex flex-col">
          <DialogHeader>
            {!coverData ? null : (
              <Cover isCoverHeader data={cardData} className="rounded-t-md h-[160px]" />
            )}
          </DialogHeader>
        </div>
        <div className="p-6">
          {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
            <div className="col-span-3">
              <div className="w-full space-y-6">
                {!cardData ? (
                  <Description.Skeleton />
                ) : (
                  <Description data={cardData} />
                )}
                {!auditLogsData ? (
                  <Activity.Skeleton />
                ) : (
                  <Activity items={auditLogsData} />
                )}
              </div>
            </div>
            {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

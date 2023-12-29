'use client'

import { Card } from '@prisma/client'
import { Draggable } from '@hello-pangea/dnd'
import { useCardModel } from '@/hooks/use-card-modal'
import { Cover } from '@/components/modals/card-modal/cover'
import { useQuery } from '@tanstack/react-query'
import { CardWithList } from '@/type'
import { fetcher } from '@/lib/fetcher'

interface CardItemProps {
  data: Card
  index: number
}
export const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModel()

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', data.id],
    queryFn: () => fetcher(`/api/cards/${data.id}`),
  })
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="truncate hover:ring-2 hover:ring-opacity-100 text-sm bg-white rounded-md shadow-sm "
        >
          {!cardData?.imageID ? null : (
            <Cover data={cardData} className="h-[180px] w-full" />
          )}
          <div className="py-2 px-3">{data.title}</div>
        </div>
      )}
    </Draggable>
  )
}

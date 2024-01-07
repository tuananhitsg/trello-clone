'use client'

import { Card } from '@prisma/client'
import { Draggable } from '@hello-pangea/dnd'
import { useCardModel } from '@/hooks/use-card-modal'
import { Cover } from '@/components/modals/card-modal/cover'
import { useQuery } from '@tanstack/react-query'
import { CardWithList } from '@/type'
import { fetcher } from '@/lib/fetcher'
import { CardOverlay } from './card-overlay'
import { Button } from '@/components/ui/button'
import { Pen } from 'lucide-react'
import { Actions } from '@/components/modals/card-modal/actions'
import { toast } from 'sonner'
import { ElementRef, useRef, useState } from 'react'
import { FormTextarea } from '@/components/form/form-textarea'
import { FormSubmit } from '@/components/form/form-submit'
import { useOnClickOutside } from 'usehooks-ts'

interface CardItemProps {
  data: Card
  index: number
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModel()
  const [isEditing, setIsEditing] = useState(false)

  const [cardPosition, setCardPosition] = useState<DOMRect | null>(null)

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', data.id],
    queryFn: () => fetcher(`/api/cards/${data.id}`),
  })

  const disableEditing = () => {
    setIsEditing(false)
    setCardPosition(null)
  }

  const enableEditing = () => {
    setIsEditing(true)
    const cardEl = document.getElementById(data.id)

    if (cardEl) {
      const position = cardEl.getBoundingClientRect()
      setCardPosition(position)
    }
  }

  return (
    <>
      {isEditing && cardPosition && (
        <CardOverlay
          data={cardData!}
          disableEditing={disableEditing}
          enableEditing={enableEditing}
          isEditing={isEditing}
          cardPosition={cardPosition}
        />
      )}
      <Draggable draggableId={data.id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            role="button"
            id={data.id}
            onClick={() => cardModal.onOpen(data.id)}
            className="flex flex-col relative group hover:ring-2 hover:ring-opacity-100 text-sm bg-white rounded-md shadow-sm "
          >
            <Button
              className="absolute self-end m-1 p-2 rounded-full w-auto h-auto invisible group-hover:visible"
              variant="gray"
              onClick={(e) => {
                e.stopPropagation() // Ngăn chặn sự kiện click lan truyền lên div cha
                enableEditing()
              }}
            >
              <Pen className="h-3 w-3" />
            </Button>
            {!cardData?.imageID ? null : (
              <Cover
                data={cardData}
                className="h-[180px] w-full rounded-t-md "
              />
            )}
            <div className="supports-[overflow-wrap:anywhere]:[overflow-wrap:anywhere] py-2 px-3">
              {data.title}
            </div>
          </div>
        )}
      </Draggable>
    </>
  )
}

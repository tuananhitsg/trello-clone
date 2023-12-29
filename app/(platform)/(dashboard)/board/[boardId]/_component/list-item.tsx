'use-client'

import { ElementRef, useRef, useState } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'

import { cn } from '@/lib/utils'
import { ListWithCard } from '@/type'

import { ListHeader } from './list-header'
import { CardForm } from './card-form'
import { CardItem } from './card-item'

interface ListItemProps {
  data: ListWithCard
  index: number
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<'textarea'>>(null)

  const [isEditing, setIsEditing] = useState(false)

  const disableEditing = () => {
    setIsEditing(false)
  }

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none "
        >
          <div
            {...provided.dragHandleProps}
            className="flex flex-col w-full rounded-md bg-[#f1f2f4] shadow-md pb-2 max-h-full"
          >
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'mx-1 px-1 flex flex-col py-0.5 gap-y-2 overflow-y-auto',
                    data.cards.length > 0 ? 'mt-2' : 'mt-0'
                  )}
                >
                  {data.cards.map((card, index) => (
                    <li key={index}>
                      <CardItem index={index} data={card} key={card.id} />
                    </li>
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  )
}

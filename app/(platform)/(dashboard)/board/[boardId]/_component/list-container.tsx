'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'

import { useAction } from '@/hooks/use-action'
import { updateListOrder } from '@/actions/update-list-order'
import { updateCardOrder } from '@/actions/update-card-order'

import { ListWithCard } from '@/type'

import { ListForm } from './list-form'
import { ListItem } from './list-item'
import { toast } from 'sonner'

interface ListContainerProps {
  data: ListWithCard[]
  boardId: string
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data)

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: (data) => {
      toast.success('List reordered')
    },
    onError: (error) => {
      toast.error(error)
    },
  })

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: (data) => {
      toast.success('Card reordered')
    },
    onError: (error) => {
      toast.error(error)
    },
  })

  useEffect(() => {
    setOrderedData(data)
  }, [data])

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result

    if (!destination) {
      return
    }

    //neu tha cung 1 vi tri
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    //nguoi dung di chuyen list
    if (type === 'list') {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      )
      setOrderedData(items)
      executeUpdateListOrder({ items, boardId })
    }

    //nguoi dung di chuyen card
    if (type === 'card') {
      let newOrderedData = [...orderedData]

      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      )
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      )

      if (!sourceList || !destList) {
        return
      }
      //kiem tra card ton tai o source list
      if (!sourceList.cards) {
        sourceList.cards = []
      }

      //kiem tra card ton tai o dest list
      if (!destList.cards) {
        destList.cards = []
      }

      //di chuyen card cung list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        )

        reorderedCards.forEach((card, idx) => {
          card.order = idx
        })

        sourceList.cards = reorderedCards

        setOrderedData(newOrderedData)
        executeUpdateCardOrder({ boardId: boardId, items: reorderedCards })
        //nguoi dung di chuyen card sang list khac
      } else {
        //xoa card tu source list
        const [movedCard] = sourceList.cards.splice(source.index, 1)

        //them listId moi vao movedCard
        movedCard.listId = destination.droppableId

        //them card vao dest list
        destList.cards.splice(destination.index, 0, movedCard)

        sourceList.cards.forEach((card, idx) => {
          card.order = idx
        })

        //cap nhat thu tu moi cho card trong dest list
        destList.cards.forEach((card, idx) => {
          card.order = idx
        })

        setOrderedData(newOrderedData)
        executeUpdateCardOrder({
          boardId: boardId,
          items: destList.cards,
        })
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full "
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}

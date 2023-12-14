'use client'

import { ListWithCard } from '@/type'
import { ListForm } from './list-form'
import { useEffect, useState } from 'react'
import { ListItem } from './list-item'

interface ListContainerProps {
  data: ListWithCard[]
  boardId: string
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderData, setOrderData] = useState(data)

  useEffect(() => {
    setOrderData(data)
  }, [data])

  return (
    <ol className='flex gap-x-3 h-full'>
      {orderData.map((list, index) => {
        return <ListItem key={list.id} index={index} data={list} />
      })}
      <ListForm />
      <div className="flex-shrink-0 w-1" />
    </ol>
  )
}

'use client'

import { ElementRef, useRef } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@/components/ui/popover'
import { useAction } from '@/hooks/use-action'
import { Button } from '@/components/ui/button'
import { createBoard } from '@/actions/create-board'
import { updateCard } from '@/actions/update-card'

import { FormInput } from './form-input'
import { FormSubmit } from './form-submit'
import { FormPicker } from './form-picker'
import { useQueryClient } from '@tanstack/react-query'
import { CardWithList } from '@/type'

interface FormCoverProps {
  children: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  data: CardWithList
}

export const FormCover = ({
  children,
  side = 'bottom',
  align,
  sideOffset = 0,
  data,
}: FormCoverProps) => {
  const router = useRouter()
  const param = useParams()
  const queryClient = useQueryClient()

  const closeRef = useRef<ElementRef<'button'>>(null)

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id],
      })
      toast.success(`Card "${data.title}"'s cover updated`)
    },
    onError: (error) => {
      toast.error(error)
    },
  })
  const onAddCover = (formData: FormData) => {
    const coverImg = formData.get('image') as string

    const [imageID, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
      coverImg!.split('|')
    const boardId = param.boardId as string

    execute({
      id: data.id,
      boardId,
      imageID,
      imageThumbUrl,
      imageFullUrl,
      imageLinkHTML,
      imageUserName,
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Cover
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form action={onAddCover} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            {/* <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            /> */}
          </div>
          <FormSubmit className="w-full">
            {data.imageID ? 'Update' : 'Add'}
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}

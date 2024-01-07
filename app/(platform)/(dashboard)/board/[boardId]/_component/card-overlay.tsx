'use client'

import { CardWithList } from '@/type'

import {
  ElementRef,
  KeyboardEventHandler,
  forwardRef,
  useRef,
  useState,
} from 'react'
import { FormTextarea } from '@/components/form/form-textarea'
import { FormSubmit } from '@/components/form/form-submit'
import { Cover } from '@/components/modals/card-modal/cover'
import { useEventListener, useOnClickOutside, useScreen } from 'usehooks-ts'
import { useParams } from 'next/navigation'
import { useAction } from '@/hooks/use-action'
import { updateCard } from '@/actions/update-card'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Actions } from '@/components/modals/card-modal/actions'

interface CardOverlayProps {
  data: CardWithList
  enableEditing: () => void
  disableEditing: () => void
  isEditing: boolean
  cardPosition: DOMRect
}

export const CardOverlay = forwardRef<HTMLTextAreaElement, CardOverlayProps>(
  ({ data, disableEditing, enableEditing, isEditing, cardPosition }, ref) => {
    const textareaRef = useRef<ElementRef<'textarea'>>(null)
    const formRef = useRef<ElementRef<'form'>>(null)
    const divRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()
    const params = useParams()

    const [title, setTitle] = useState(data.title)

    if (isEditing) {
      setTimeout(() => {
        textareaRef.current?.select()
      })
    }

    let innerHeight

    // const screen = useScreen() dung useHook, lam sau

    if (typeof window !== 'undefined') {
      // Render trên client
      innerHeight = window.innerHeight
    }
    let isOffBottom

    if (innerHeight) {
      isOffBottom = cardPosition.top + cardPosition.height > innerHeight
    }

    const handleOverlayClick = () => {}

    const { execute } = useAction(updateCard, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['card', data.id],
        })
        queryClient.invalidateQueries({
          queryKey: ['card-logs', data.id],
        })

        toast.success(`Renamed to ${data.title}`)
        setTitle(data.title)
        disableEditing()
      },
      onError: (error) => {
        toast.error(error)
      },
    })

    const onSubmit = (formData: FormData) => {
      const title = formData.get('title') as string
      const boardId = params.boardId as string

      if (title === data.title) return

      execute({
        title,
        boardId,
        id: data.id,
      })
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        disableEditing()
      }
    }

    useOnClickOutside(divRef, disableEditing)
    useEventListener('keydown', onKeyDown)

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        formRef.current?.requestSubmit()
      }
    }

    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/80">
        <div
          className="fixed inset-0 text-sm shadow-sm"
          ref={divRef}
          style={{
            width: cardPosition?.width,
            height: cardPosition?.height,
            top: isOffBottom
              ? innerHeight! - cardPosition.height
              : cardPosition.top,
            left: cardPosition?.left,
          }}
        >
          {!data?.imageID ? null : (
            <Cover
              data={data}
              className="h-[180px] bg-gray-600 rounded-t-md w-full "
            />
          )}
          <form ref={formRef} action={onSubmit} className="space-y-2">
            <FormTextarea
              ref={textareaRef}
              id="title"
              defaultValue={title || undefined}
              className="w-full rounded-b-md"
              onKeyDown={onTextareaKeyDown}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
            </div>
          </form>
          <div
            className="fixed"
            style={{
              top: cardPosition.top - 8,
              left: cardPosition.right + 8,
            }}
          >
            <Actions data={data} isQuickEdit className="w-min" />
          </div>
        </div>
      </div>
    )
  }
)
CardOverlay.displayName = 'CardOverlay'

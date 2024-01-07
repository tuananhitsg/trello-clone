'use client'

import { toast } from 'sonner'
import { Copy, PanelTop, Trash, Layout } from 'lucide-react'
import { useParams } from 'next/navigation'

import { CardWithList } from '@/type'
import { useAction } from '@/hooks/use-action'
import { Button } from '@/components/ui/button'
import { copyCard } from '@/actions/copy-card'
import { deleteCard } from '@/actions/delete-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCardModel } from '@/hooks/use-card-modal'
import { FormCover } from '@/components/form/form-cover'
import { cn } from '@/lib/utils'

interface ActionsProps {
  data: CardWithList
  isQuickEdit?: boolean
  className?: string
}

export const Actions = ({ data, isQuickEdit, className }: ActionsProps) => {
  const params = useParams()
  const cardModal = useCardModel()

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" copied`)
        cardModal.onClose()
      },
      onError: (error) => {
        toast.error(error)
      },
    }
  )

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" deleted`)
        cardModal.onClose()
      },
      onError: (error) => {
        toast.error(error)
      },
    }
  )

  const onOpen = () => {
    cardModal.onOpen(data.id)
  }

  const onCopy = () => {
    const boardId = params.boardId as string

    executeCopyCard({
      id: data.id,
      boardId,
    })
  }

  const onDelete = () => {
    const boardId = params.boardId as string

    executeDeleteCard({
      id: data.id,
      boardId,
    })
  }

  return (
    <div className={cn('space-y-2 mt-2', className)}>
      {!isQuickEdit ? (
        <p className="text-xs font-semibold">Actions</p>
      ) : (
        <Button
          onClick={() => cardModal.onOpen(data.id)}
          disabled={isLoadingCopy}
          variant="gray"
          className="w-full justify-start"
          size="inline"
        >
          <Layout className="h-4 w-4 mr-2" />
          Open card
        </Button>
      )}
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
      {data.imageID && !isQuickEdit ? null : (
        <FormCover data={data} align="start" side="right" sideOffset={30}>
          <Button variant="gray" className="w-full justify-start" size="inline">
            <PanelTop className="h-4 w-4 mr-2" />
            {isQuickEdit ? 'Change cover' : 'Add cover'}
          </Button>
        </FormCover>
      )}
    </div>
  )
}

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  )
}

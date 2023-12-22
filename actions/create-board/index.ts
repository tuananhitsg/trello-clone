'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

import { db } from '@/lib/db'
import { createAuditLog } from '@/lib/create-audit-log'
import { createSafeAction } from '@/lib/create-safe-action'

import { InputType, ReturnType } from './type'
import { CreateBoard } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    }
  }
  const { title, image } = data

  const [imageID, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split('|')

  if (
    !imageID ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: 'Missing field. Failed to create image.',
    }
  }

  let board
  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageID,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
      },
    })
    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    })
  } catch (error) {
    return {
      error: 'Failed to create board.',
    }
  }

  revalidatePath(`/board/${board.id}`)
  return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler)

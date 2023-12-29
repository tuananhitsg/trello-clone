'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'

import { UpdateCard } from './schema'
import { InputType, ReturnType } from './types'
import { createSafeAction } from '@/lib/create-safe-action'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    }
  }

  const { id, boardId, coverImg, ...values } = data
  const [imageID, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    coverImg!.split('|')
  let card

  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        imageID,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
        ...values,
      },
    })
    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
    })
  } catch (error) {
    return {
      error: 'Failed to update.',
    }
  }
  revalidatePath(`/board/${boardId}`)
  return { data: card }
}

export const updateCard = createSafeAction(UpdateCard, handler)

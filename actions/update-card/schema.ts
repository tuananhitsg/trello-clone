import { z } from 'zod'

export const UpdateCard = z.object({
  boardId: z.string(),

  imageID: z.optional(
    z.string({
      required_error: 'imageID is required',
      invalid_type_error: 'imageID is required',
    })
  ),
  imageThumbUrl: z.optional(
    z.string({
      required_error: 'imageThumbUrl is required',
      invalid_type_error: 'imageThumbUrl is required',
    })
  ),
  imageFullUrl: z.optional(
    z.string({
      required_error: 'imageFullUrl is required',
      invalid_type_error: 'imageFullUrl is required',
    })
  ),
  imageLinkHTML: z.optional(
    z.string({
      required_error: 'imageLinkHTML is required',
      invalid_type_error: 'imageLinkHTML is required',
    })
  ),
  imageUserName: z.optional(
    z.string({
      required_error: 'imageUserName is required',
      invalid_type_error: 'imageUserName is required',
    })
  ),
  description: z.optional(
    z
      .string({
        required_error: 'Description is required',
        invalid_type_error: 'Description is required',
      })
      .min(3, {
        message: 'Description is too short',
      })
  ), //TODO: seems like this no need to check the description
  title: z.optional(
    z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title is required',
      })
      .min(3, {
        message: 'Title is too short',
      })
  ),
  id: z.string(),
})

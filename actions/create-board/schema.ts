import { z } from 'zod'

export const CreateBoard = z.object({
   title: z.string({
    required_error: 'Titlle is required',
    invalid_type_error: 'Titlle is required',
   }).min(3, { 
    message: "Titlle is too short."
   })

})
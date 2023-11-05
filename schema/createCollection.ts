import { CollectionColors } from '@/lib/constants'
import {z} from 'zod'

export const createCollectionSchema = z.object({
    name: z.string().min(3, {
        message:"Name should be atleast 3 Characters long."
    }),
    color: z.string().refine(color => Object.keys(CollectionColors).includes(color))
})

export type createCollectionSchemaType = z.infer<typeof createCollectionSchema>;
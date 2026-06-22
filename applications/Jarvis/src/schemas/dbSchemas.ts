import { z } from 'zod'

export const DbMessageSchema = z.object({
    id: z.string(),
    content: z.string(),
    role: z.union([z.literal('user'), z.literal('assistant')]),
    created_at: z.string()
})

export const DbConversationSchema = z.object({
    id: z.string(),
    title: z.string(),
    flowise_chat_id: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    messages: z.array(DbMessageSchema).optional()
})

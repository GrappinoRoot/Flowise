import type { Conversation, ChatMessage } from '../types/chat'
import type { DbConversation } from '../types/supabaseModel'
import { DbConversationSchema } from '../schemas/dbSchemas'

export function mapDbConversationToConversation(conv: DbConversation): Conversation {
    const parsed = DbConversationSchema.safeParse(conv)
    if (!parsed.success) {
        console.warn('Invalid DB conversation shape', parsed.error)
        const fallback = conv as DbConversation
        return {
            Id: fallback.id,
            title: fallback.title,
            flowiseChatId: fallback.flowise_chat_id,
            messages: (fallback.messages ?? [])
                .map(
                    (m): ChatMessage => ({
                        Id: m.id,
                        content: m.content,
                        role: m.role,
                        createdAt: new Date(m.created_at).getTime()
                    })
                )
                .sort((a, b) => a.createdAt - b.createdAt),
            createdAt: new Date(fallback.created_at).getTime(),
            updatedAt: new Date(fallback.updated_at).getTime()
        }
    }

    const data = parsed.data
    return {
        Id: data.id,
        title: data.title,
        flowiseChatId: data.flowise_chat_id,
        messages: (data.messages ?? [])
            .map(
                (m): ChatMessage => ({
                    Id: m.id,
                    content: m.content,
                    role: m.role,
                    createdAt: new Date(m.created_at).getTime()
                })
            )
            .sort((a, b) => a.createdAt - b.createdAt),
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime()
    }
}

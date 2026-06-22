export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
    Id: string
    role: ChatRole
    content: string
    createdAt: number
    updatedAt?: number
}

export type Conversation = {
    Id: string
    title: string
    messages: ChatMessage[]
    createdAt: number
    updatedAt: number
    flowiseChatId?: string | null
}

export type User = {
    id: string
    email: string
    avatarUrl?: string
}

export type AppState = {
    conversations: Conversation[]
    activeConversationId: string | null
    loading: boolean
    user: User | null
}

export type ButtonVariant = 'primary' | 'secondary' | 'logout' | 'ghost'

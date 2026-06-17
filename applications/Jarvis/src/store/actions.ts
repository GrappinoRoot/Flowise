import type { ChatMessage } from '../types/chat'

export const actions: {
    [K in keyof ActionPayloadMap]: { id: number; process: (payload: ActionPayloadMap[K]) => ActionPayloadMap[K] }
} = {
    CONVERSATION_CREATED: { id: 0, process: (payload) => payload },
    CONVERSATION_SELECTED: { id: 1, process: (payload) => payload },
    MESSAGE_ADDED: { id: 2, process: (payload) => payload },
    LOADING_STARTED: { id: 3, process: () => undefined },
    LOADING_FINISHED: { id: 4, process: () => undefined },
    USER_MESSAGE_SUBMITTED: { id: 5, process: (payload) => payload },
    CONVERSATION_RENAMED: { id: 6, process: (payload) => payload },
    CONVERSATION_DELETED: { id: 7, process: (payload) => payload },
    FLOWISE_CHAT_ID_UPDATED: { id: 8, process: (payload) => payload },
    USER_SET: { id: 9, process: (payload) => payload },
    USER_CLEAR: { id: 10, process: (payload) => payload }
}

export type ActionPayloadMap = {
    CONVERSATION_CREATED: { Id: string; title: string }
    CONVERSATION_SELECTED: { conversationId: string }
    MESSAGE_ADDED: { conversationId: string; message: ChatMessage }
    LOADING_STARTED: void
    LOADING_FINISHED: void
    USER_MESSAGE_SUBMITTED: { content: string }
    CONVERSATION_RENAMED: { conversationId: string; title: string }
    CONVERSATION_DELETED: { conversationId: string }
    FLOWISE_CHAT_ID_UPDATED: { conversationId: string; flowiseChatId: string }
    USER_SET: { user: { id: string; email: string; avatarUrl?: string } }
    USER_CLEAR: void
}

export type ActionType = keyof ActionPayloadMap

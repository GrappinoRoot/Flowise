export type ChatRole = 'user' | 'assistant'
export type AuthMode = 'signin' | 'signup'

export type ChatMessage = {
    Id: string
    role: ChatRole
    content: string
    createdAt: number
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

export type NavbarProps = {
    isAuthenticated: boolean
    onNavigateAuth: () => void
    onLogout: () => Promise<void>
}

export type ButtonType = 'button' | 'submit' | 'reset'

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'link'
    | 'logout'
    | 'danger'
    | 'ghost'
    | 'success'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'

export type ButtonProps = {
    label: string
    onClick?: () => void
    type?: ButtonType
    variant?: ButtonVariant
    className?: string
    icon?: string
}

export type IconProps = {
    src: string
    alt?: string
    className?: string
}

export type ConversationItemProps = {
    id: string
    title: string
    active: boolean
}

export type ProfileButtonProps = {
    email: string
    avatarUrl?: string
    onLogout: () => Promise<void>
}

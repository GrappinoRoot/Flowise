export type PostStatus = 'draft' | 'pending_approval' | 'published' | 'failed'

export interface Agent {
    id: string
    name: string
    icon: string
    status: 'active' | 'inactive' | 'running'
    workflowId: string
}

export interface Post {
    id: string
    content: string
    platform: 'Instagram' | 'Twitter' | 'LinkedIn'
    date: string
    status: PostStatus
    agentId?: string
}

export interface Activity {
    id: string
    message: string
    timestamp: Date
}

type Listener<T> = (data: T) => void

export class DataService {
    private static instance: DataService

    private agents: Agent[] = [
        { id: '1', name: 'Instagram Creator', icon: '🤖', status: 'active', workflowId: 'wf-insta' },
        { id: '2', name: 'Twitter Bot', icon: '🐦', status: 'inactive', workflowId: 'wf-twitter' },
        { id: '3', name: 'LinkedIn Expert', icon: '💼', status: 'active', workflowId: 'wf-linkedin' }
    ]

    private posts: Post[] = [
        {
            id: 'p1',
            content: 'AI is changing the world! #tech',
            platform: 'Instagram',
            date: '2023-10-27',
            status: 'published',
            agentId: '1'
        },
        {
            id: 'p2',
            content: 'Just launched my new project! 🚀',
            platform: 'Twitter',
            date: '2023-10-26',
            status: 'pending_approval',
            agentId: '1'
        },
        { id: 'p3', content: 'Networking is key in 2024.', platform: 'LinkedIn', date: '2023-10-25', status: 'draft', agentId: '3' }
    ]

    private activities: Activity[] = [
        { id: 'a1', message: 'Agent Instagram Creator started a task', timestamp: new Date() },
        { id: 'a2', message: 'User Admin approved post #p1', timestamp: new Date() }
    ]

    private agentsListeners: Listener<Agent[]>[] = []
    private postsListeners: Listener<Post[]>[] = []
    private activitiesListeners: Listener<Activity[]>[] = []

    private constructor() {}

    public static getInstance(): DataService {
        if (!DataService.instance) {
            DataService.instance = new DataService()
        }
        return DataService.instance
    }

    // --- Getters ---

    getAgents(): Agent[] {
        return [...this.agents]
    }

    getPosts(): Post[] {
        return [...this.posts]
    }

    getPendingApprovals(): Post[] {
        return this.posts.filter((p) => p.status === 'pending_approval')
    }

    getActivities(): Activity[] {
        return [...this.activities]
    }

    getAgentByPostId(postId: string): Agent | undefined {
        const post = this.posts.find((p) => p.id === postId)
        if (!post || !post.agentId) return undefined
        return this.agents.find((a) => a.id === post.agentId)
    }

    // --- Setters & Actions ---

    updateAgentStatus(agentId: string, status: Agent['status']): void {
        const agentIndex = this.agents.findIndex((a) => a.id === agentId)
        if (agentIndex !== -1) {
            this.agents[agentIndex].status = status
            this.notifyAgents()
        }
    }

    updatePostStatus(postId: string, status: PostStatus): void {
        const postIndex = this.posts.findIndex((p) => p.id === postId)
        if (postIndex !== -1) {
            this.posts[postIndex].status = status
            this.notifyPosts()
            this.addActivity(`Post ${postId} status updated to ${status}`)
        }
    }

    private addActivity(message: string): void {
        const newActivity: Activity = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            timestamp: new Date()
        }
        this.activities.unshift(newActivity)
        this.notifyActivities()
    }

    // --- Subscription Mechanism ---

    subscribeAgents(listener: Listener<Agent[]>): void {
        this.agentsListeners.push(listener)
        listener(this.getAgents())
    }

    subscribePosts(listener: Listener<Post[]>): void {
        this.postsListeners.push(listener)
        listener(this.getPosts())
    }

    subscribeActivities(listener: Listener<Activity[]>): void {
        this.activitiesListeners.push(listener)
        listener(this.getActivities())
    }

    private notifyAgents(): void {
        const data = this.getAgents()
        this.agentsListeners.forEach((l) => l(data))
    }

    private notifyPosts(): void {
        const data = this.getPosts()
        this.postsListeners.forEach((l) => l(data))
    }

    private notifyActivities(): void {
        const data = this.getActivities()
        this.activitiesListeners.forEach((l) => l(data))
    }
}

export const dataService = DataService.getInstance()

export class DataService {
    static instance
    agents = [
        { id: '1', name: 'Instagram Creator', icon: '🤖', status: 'active' },
        { id: '2', name: 'Twitter Bot', icon: '🐦', status: 'inactive' },
        { id: '3', name: 'LinkedIn Expert', icon: '💼', status: 'active' }
    ]
    posts = [
        { id: 'p1', content: 'AI is changing the world! #tech', platform: 'Instagram', date: '2023-10-27', status: 'published' },
        { id: 'p2', content: 'Just launched my new project! 🚀', platform: 'Twitter', date: '2023-10-26', status: 'pending_approval' },
        { id: 'p3', content: 'Networking is key in 2024.', platform: 'LinkedIn', date: '2023-10-25', status: 'draft' }
    ]
    activities = [
        { id: 'a1', message: 'Agent Instagram Creator started a task', timestamp: new Date() },
        { id: 'a2', message: 'User Admin approved post #p1', timestamp: new Date() }
    ]
    agentsListeners = []
    postsListeners = []
    activitiesListeners = []
    constructor() {}
    static getInstance() {
        if (!DataService.instance) {
            DataService.instance = new DataService()
        }
        return DataService.instance
    }
    // --- Getters ---
    getAgents() {
        return [...this.agents]
    }
    getPosts() {
        return [...this.posts]
    }
    getPendingApprovals() {
        return this.posts.filter((p) => p.status === 'pending_approval')
    }
    getActivities() {
        return [...this.activities]
    }
    getStats() {
        return {
            totalPosts: this.posts.length,
            pendingApprovals: this.getPendingApprovals().length,
            activeAgents: this.agents.filter((a) => a.status === 'active').length
        }
    }
    // --- Setters & Actions ---
    updatePostStatus(postId, newStatus) {
        const postIndex = this.posts.findIndex((p) => p.id === postId)
        if (postIndex !== -1) {
            this.posts[postIndex].status = newStatus
            this.notifyPosts()
            this.addActivity(`Post ${postId} status updated to ${newStatus}`)
        }
    }
    addActivity(message) {
        const newActivity = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            timestamp: new Date()
        }
        this.activities.unshift(newActivity)
        this.notifyActivities()
    }
    // --- Subscription Mechanism ---
    subscribeAgents(listener) {
        this.agentsListeners.push(listener)
        listener(this.getAgents())
    }
    subscribePosts(listener) {
        this.postsListeners.push(listener)
        listener(this.getPosts())
    }
    subscribeActivities(listener) {
        this.activitiesListeners.push(listener)
        listener(this.getActivities())
    }
    notifyAgents() {
        const data = this.getAgents()
        this.agentsListeners.forEach((l) => l(data))
    }
    notifyPosts() {
        const data = this.getPosts()
        this.postsListeners.forEach((l) => l(data))
    }
    notifyActivities() {
        const data = this.getActivities()
        this.activitiesListeners.forEach((l) => l(data))
    }
}
export const dataService = DataService.getInstance()

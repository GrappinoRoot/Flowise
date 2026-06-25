import template from './ApprovalView.html?raw'
import { createTemplate } from '../utils/createTemplate'
import { dataService, Post } from '../services/dataService'
import { workflowService } from '../services/workflowService'

export class ApprovalView extends HTMLElement {
    connectedCallback(): void {
        const content = createTemplate(template)
        this.appendChild(content)

        dataService.subscribePosts((posts) => this.renderApprovals(posts))
    }

    private renderApprovals(posts: Post[]): void {
        const listEl = this.querySelector<HTMLElement>('.approval-list')
        if (!listEl) return

        const pending = posts.filter((p) => p.status === 'pending_approval')

        if (pending.length === 0) {
            listEl.innerHTML = '<p class="empty-msg">No pending approvals</p>'
            return
        }

        listEl.innerHTML = pending
            .map(
                (post) => `
            <div class="approval-card">
                <div class="preview-container">
                    <span class="platform">${post.platform}</span>
                    <p class="content">"${post.content}"</p>
                </div>
                <div class="actions">
                    <button class="btn-reject" data-id="${post.id}">Reject</button>
                    <button class="btn-approve" data-id="${post.id}">Approve</button>
                </div>
            </div>
        `
            )
            .join('')

        this.setupEventListeners()
    }

    private setupEventListeners(): void {
        this.querySelectorAll('.btn-approve').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id')
                if (id) {
                    const post = dataService.getPosts().find((p) => p.id === id)
                    if (post?.agentId) {
                        await dataService.updatePostStatus(id, 'published')
                        await workflowService.resumeWorkflowByAgentId(post.agentId)
                    } else {
                        await dataService.updatePostStatus(id, 'published')
                    }
                }
            })
        })

        this.querySelectorAll('.btn-reject').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id')
                if (id) {
                    const post = dataService.getPosts().find((p) => p.id === id)
                    if (post?.agentId) {
                        await dataService.updatePostStatus(id, 'failed')
                    } else {
                        await dataService.updatePostStatus(id, 'failed')
                    }
                }
            })
        })
    }
}

customElements.define('app-approval-view', ApprovalView)

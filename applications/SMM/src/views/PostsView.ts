import template from './PostsView.html?raw'
import { createTemplate } from '../utils/createTemplate'
import { dataService, Post } from '../services/dataService'

export class PostsView extends HTMLElement {
    connectedCallback(): void {
        const content = createTemplate(template)
        this.appendChild(content)

        dataService.subscribePosts((posts) => this.renderPosts(posts))
    }

    private renderPosts(posts: Post[]): void {
        const listEl = this.querySelector<HTMLElement>('.posts-list')
        if (!listEl) return

        listEl.innerHTML = posts
            .map(
                (post) => `
            <div class="post-item">
                <div class="post-content">
                    <span class="post-platform">${post.platform}</span>
                    <p class="post-text">${post.content}</p>
                </div>
                <div class="post-meta">
                    <span class="post-date">${post.date}</span>
                    <span class="post-status status-${post.status}">${post.status}</span>
                </div>
            </div>
        `
            )
            .join('')
    }
}

customElements.define('app-posts-view', PostsView)

import template from './Dashboard.html?raw'
import { createTemplate } from '../../utils/createTemplate'
import { dataService } from '../../services/dataService'

export class AppDashboard extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback(): void {
        const content = createTemplate(template)
        this.appendChild(content)

        // Initial render
        this.renderStats()

        // Subscribe to activities
        dataService.subscribeActivities((activities) => this.renderActivities(activities))
    }

    private renderStats(): void {
        const stats = dataService.getStats()
        const totalEl = this.querySelector<HTMLElement>('#stat-total')
        const pendingEl = this.querySelector<HTMLElement>('#stat-pending')
        const agentsEl = this.querySelector<HTMLElement>('#stat-agents')

        if (totalEl) totalEl.textContent = stats.totalPosts.toString()
        if (pendingEl) pendingEl.textContent = stats.pendingApprovals.toString()
        if (agentsEl) agentsEl.textContent = stats.activeAgents.toString()
    }

    private renderActivities(activities: any[]): void {
        const listEl = this.querySelector<HTMLElement>('#activity-list')
        if (!listEl) return

        if (activities.length === 0) {
            listEl.innerHTML = '<div class="activity-item"><p>No recent activity</p></div>'
            return
        }

        listEl.innerHTML = activities
            .map(
                (act) => `
            <div class="activity-item">
                <div class="activity-info">
                    <strong>${act.message}</strong>
                </div>
                <span class="activity-time">${new Date(act.timestamp).toLocaleTimeString()}</span>
            </div>
        `
            )
            .join('')
    }
}

customElements.define('app-dashboard', AppDashboard)

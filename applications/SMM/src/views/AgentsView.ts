import template from './AgentsView.html?raw'
import { createTemplate } from '../utils/createTemplate'
import { dataService, Agent } from '../services/dataService'
import { workflowService } from '../services/workflowService'

export class AgentsView extends HTMLElement {
    connectedCallback(): void {
        const content = createTemplate(template)
        this.appendChild(content)

        dataService.subscribeAgents((agents) => this.renderAgents(agents))
    }

    private renderAgents(agents: Agent[]): void {
        const gridEl = this.querySelector<HTMLElement>('.agents-grid')
        if (!gridEl) return

        gridEl.innerHTML = agents
            .map(
                (agent) => `
            <div class="agent-card" data-agent-id="${agent.id}">
                <div class="agent-icon">${agent.icon}</div>
                <div class="agent-info">
                    <span class="agent-name">${agent.name}</span>
                    <span class="agent-status status-${agent.status}">${agent.status}</span>
                </div>
                <button class="btn-run" ${agent.status === 'running' ? 'disabled' : ''}>
                    ${agent.status === 'running' ? '...' : 'Run'}
                </button>
            </div>
        `
            )
            .join('')

        this.setupEventListeners()
    }

    private setupEventListeners(): void {
        this.querySelectorAll('.btn-run').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const card = (e.target as HTMLElement).closest('.agent-card')
                const agentId = card?.getAttribute('data-agent-id')
                if (agentId) {
                    workflowService.startWorkflow(agentId)
                }
            })
        })
    }
}

customElements.define('app-agents-view', AgentsView)

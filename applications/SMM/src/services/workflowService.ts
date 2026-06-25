import { dataService } from './dataService'
import { GraphRunner, AgentFlow, FlowContext } from '../core/agentflow'

export class WorkflowService {
    private static instance: WorkflowService
    private workflows: Map<string, AgentFlow<any>> = new Map()
    private activeContexts: Map<string, { context: FlowContext; lastNodeId: string | null }> = new Map()

    private constructor() {
        this.registerSampleWorkflows()
    }

    public static getInstance(): WorkflowService {
        if (!WorkflowService.instance) {
            WorkflowService.instance = new WorkflowService()
        }
        return WorkflowService.instance
    }

    private registerSampleWorkflows() {
        // Sample Workflow for Instagram
        const instaFlow: AgentFlow<FlowContext> = {
            id: 'wf-insta',
            startNodeId: 'node-1',
            nodes: new Map([
                [
                    'node-1',
                    {
                        id: 'node-1',
                        execute: async (ctx) => {
                            console.log('[Workflow] Node 1: Generating content...')
                            await new Promise((r) => setTimeout(r, 2000))
                            ctx.data.generated_content = 'Hello from Instagram Agent! #ai'
                            ctx.status = 'awaiting_approval'
                            return { context: ctx }
                        }
                    }
                ],
                [
                    'node-2',
                    {
                        id: 'node-2',
                        execute: async (ctx) => {
                            console.log('[Workflow] Node 2: Publishing...')
                            await new Promise((r) => setTimeout(r, 1000))
                            ctx.status = 'completed'
                            return { context: ctx }
                        }
                    }
                ]
            ]),
            edges: [{ from: 'node-1', to: 'node-2', condition: (ctx) => ctx.status === 'approved' }]
        }
        this.workflows.set('wf-insta', instaFlow)
    }

    private deactivateAgent(agentId: string): void {
        dataService.updateAgentStatus(agentId, 'active')
        this.runningWorkflows.delete(agentId)
        this.activeContexts.delete(agentId)
    }

    async startWorkflow(agentId: string): Promise<void> {
        const agent = dataService.getAgents().find((a) => a.id === agentId)
        if (!agent || !agent.workflowId || this.runningWorkflows.has(agentId)) return

        const workflow = this.workflows.get(agent.workflowId)
        if (!workflow) {
            console.error(`Workflow ${agent.workflowId} not found`)
            return
        }

        console.log(`[WorkflowService] Starting workflow ${workflow.id} for agent ${agent.name}`)

        this.runningWorkflows.add(agentId)
        dataService.updateAgentStatus(agentId, 'running')

        const context: FlowContext = {
            workflowId: workflow.id,
            data: {},
            status: 'running'
        }

        const runner = new GraphRunner(workflow)

        try {
            const { context: currentContext, lastNodeId } = await runner.run(context)
            this.activeContexts.set(agentId, { context: currentContext, lastNodeId })

            if (currentContext.status === 'awaiting_approval') {
                console.log(`[WorkflowService] Workflow ${workflow.id} is waiting for approval.`)
            } else if (currentContext.status === 'completed' || currentContext.status === 'failed') {
                console.log(`[WorkflowService] Workflow ${workflow.id} ${currentContext.status}.`)
                this.deactivateAgent(agentId)
            }
        } catch (err) {
            console.error(`[WorkflowService] Critical error in workflow ${workflow.id}:`, err)
            this.deactivateAgent(agentId)
        }
    }

    async resumeWorkflowByAgentId(agentId: string): Promise<void> {
        const stored = this.activeContexts.get(agentId)
        if (!stored) return

        const { context, lastNodeId } = stored
        const agent = dataService.getAgents().find((a) => a.id === agentId)
        if (!agent || !agent.workflowId) return

        const workflow = this.workflows.get(agent.workflowId)
        if (!workflow || !lastNodeId) return

        console.log(`[WorkflowService] Resuming workflow ${workflow.id} for agent ${agent.name}`)

        // Update context to 'approved' so the edge condition is met
        context.status = 'approved'

        // Find the next node
        const nextEdge = workflow.edges.find((e) => e.from === lastNodeId && (!e.condition || e.condition(context)))
        if (!nextEdge) {
            console.error(`[WorkflowService] No valid next edge found from ${lastNodeId}`)
            this.deactivateAgent(agentId)
            return
        }

        const runner = new GraphRunner(workflow)
        try {
            const { context: updatedContext } = await runner.run(context)
            this.activeContexts.set(agentId, { context: updatedContext, lastNodeId: null }) // Simplified

            if (updatedContext.status === 'completed' || updatedContext.status === 'failed') {
                this.deactivateAgent(agentId)
            }
        } catch (err) {
            console.error(`[WorkflowService] Error resuming workflow:`, err)
            this.deactivateAgent(agentId)
        }
    }

    async resumeWorkflow(agentId: string, workflowId: string, nextNodeId: string): Promise<void> {
        const workflow = this.workflows.get(workflowId)
        if (!workflow) return

        const context: FlowContext = {
            workflowId: workflow.id,
            data: {}, // In a real app, we'd retrieve the last context
            status: 'running'
        }

        const runner = new GraphRunner(workflow)
        const result = await runner.resume(context, nextNodeId)

        if (result.status === 'completed' || result.status === 'failed') {
            this.deactivateAgent(agentId)
        }
    }

    isAgentRunning(agentId: string): boolean {
        return this.runningWorkflows.has(agentId)
    }
}

export const workflowService = WorkflowService.getInstance()

import { AgentFlow, FlowContext, Edge } from './types'

export class GraphRunner<T extends FlowContext> {
    constructor(private flow: AgentFlow<T>) {}

    async run(context: T): Promise<RunResult<T>> {
        let currentNodeId: string | null = this.flow.startNodeId
        let currentContext = { ...context }

        console.log(`[GraphRunner] Starting workflow: ${this.flow.id}`)

        while (currentNodeId) {
            const node = this.flow.nodes.get(currentNodeId)
            if (!node) {
                console.error(`[GraphRunner] Node not found: ${currentNodeId}`)
                break
            }

            console.log(`[GraphRunner] Entering Node: ${currentNodeId}`)
            const result = await node.execute(currentContext)
            currentContext = result.context

            if (result.error) {
                console.error(`[GraphRunner] Error in node ${currentNodeId}: ${result.error.message}`)
                currentContext.status = 'failed'
                break
            }

            if (currentContext.status === 'awaiting_approval') {
                console.log(`[GraphRunner] Workflow paused at node: ${currentNodeId} (Awaiting Approval)`)
                break
            }

            if (currentContext.status === 'completed') {
                console.log(`[GraphRunner] Workflow completed successfully.`)
                break
            }

            const edge = this.flow.edges.find((e: Edge<T>) => e.from === currentNodeId && (!e.condition || e.condition(currentContext)))

            if (edge) {
                currentNodeId = edge.to
            } else {
                console.log(`[GraphRunner] No more edges found from node: ${currentNodeId}. Stopping.`)
                currentNodeId = null
            }
        }

        return { context: currentContext, lastNodeId: currentNodeId }
    }

    async resume(context: T, nextNodeId: string): Promise<T> {
        console.log(`[GraphRunner] Resuming workflow: ${this.flow.id} from node: ${nextNodeId}`)

        let currentNodeId: string | null = nextNodeId
        let currentContext = context

        while (currentNodeId) {
            const node = this.flow.nodes.get(currentNodeId)
            if (!node) break

            const result = await node.execute(currentContext)
            currentContext = result.context

            if (result.error || currentContext.status === 'awaiting_approval' || currentContext.status === 'completed') {
                break
            }

            const edge = this.flow.edges.find((e: Edge<T>) => e.from === currentNodeId && (!e.condition || e.condition(currentContext)))
            currentNodeId = edge ? edge.to : null
        }

        return currentContext
    }
}

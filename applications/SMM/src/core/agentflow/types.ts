export type FlowStatus = 'running' | 'awaiting_approval' | 'approved' | 'completed' | 'failed'

export interface FlowContext {
    workflowId: string
    data: Record<string, any>
    status: FlowStatus
    metadata?: Record<string, any>
}

export interface NodeResult<T extends FlowContext> {
    context: T
    error?: Error
}

export interface AgentFlowNode<T extends FlowContext> {
    id: string
    execute(context: T): Promise<NodeResult<T>>
}

export interface Edge<T extends FlowContext> {
    from: string
    to: string
    condition?: (context: T) => boolean
}

export interface AgentFlow<T extends FlowContext> {
    id: string
    nodes: Map<string, AgentFlowNode<T>>
    edges: Edge<T>[]
    startNodeId: string
}

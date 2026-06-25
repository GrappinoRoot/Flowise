import { AgentFlowNode, FlowContext, NodeResult } from '../types'

export abstract class BaseNode<T extends FlowContext> implements AgentFlowNode<T> {
    constructor(public id: string) {}

    abstract execute(context: T): Promise<NodeResult<T>>

    // Helper to wrap execution with basic error handling
    protected async run(context: T, action: (ctx: T) => Promise<void>): Promise<NodeResult<T>> {
        try {
            await action(context)
            return { context }
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error))
            return {
                context: { ...context, status: 'failed' as any },
                error: err
            }
        }
    }
}

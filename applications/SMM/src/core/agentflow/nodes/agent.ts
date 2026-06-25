import { BaseNode } from './base'
import { FlowContext, NodeResult } from '../types'

export class AgentNode<T extends FlowContext> extends BaseNode<T> {
    constructor(id: string, private modelId: string) {
        super(id)
    }

    async execute(context: T): Promise<NodeResult<T>> {
        return this.run(context, async (ctx) => {
            console.log(`[AgentNode: ${this.id}] Executing with model ${this.modelId}...`)

            // Placeholder: In un ambiente reale, questo chiamerà ZenMux tramite l'estensione
            await new Promise((resolve) => setTimeout(resolve, 1000))

            ctx.data[`last_agent_action_${this.id}`] = `Processed by ${this.modelId}`
        })
    }
}

import { BaseNode } from './base'
import { FlowContext, NodeResult } from '../types'

export class ToolNode<T extends FlowContext> extends BaseNode<T> {
    constructor(id: string, private action: (ctx: T) => Promise<void>) {
        super(id)
    }

    async execute(context: T): Promise<NodeResult<T>> {
        return this.run(context, async (ctx) => {
            console.log(`[ToolNode: ${this.id}] Executing action...`)
            await this.action(ctx)
        })
    }
}

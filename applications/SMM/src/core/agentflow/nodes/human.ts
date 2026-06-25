import { BaseNode } from './base'
import { FlowContext, NodeResult } from '../types'

export class HumanNode<T extends FlowContext> extends BaseNode<T> {
    constructor(id: string, public prompt: string) {
        super(id)
    }

    async execute(context: T): Promise<NodeResult<T>> {
        return this.run(context, async (ctx) => {
            console.log(`[HumanNode: ${this.id}] Pausing for approval. Prompt: ${this.prompt}`)

            // Questo nodo non esegue codice; mette lo stato in 'awaiting_approval'
            // e ferma l'esecuzione del grafo finché un evento esterno non lo riprende.
            ctx.status = 'awaiting_approval'
            ctx.data['pending_approval_node'] = this.id
            ctx.data['approval_prompt'] = this.prompt
        })
    }
}

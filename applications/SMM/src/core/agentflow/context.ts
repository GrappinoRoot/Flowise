import { FlowContext } from './types.ts'

export function createFlowContext(workflowId: string, initialData: Record<string, any> = {}): FlowContext {
    return {
        workflowId,
        data: initialData,
        status: 'running',
        metadata: {}
    }
}

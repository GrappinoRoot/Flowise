import ky, { HTTPError } from 'ky'

const FLOWISE_BASE_URL = import.meta.env.VITE_FLOWISE_BASE_URL
const FLOWISE_CHATFLOW_ID = import.meta.env.VITE_FLOWISE_CHATFLOW_ID

export type FlowisePredictionResponse = {
    text: string
    chatId: string
    chatMessageId: string
}

export async function sendToFlowise(question: string, chatId?: string): Promise<FlowisePredictionResponse> {
    try {
        const response = await ky
            .post(`${FLOWISE_BASE_URL}/api/v1/prediction/${FLOWISE_CHATFLOW_ID}`, {
                json: {
                    question,
                    chatId,
                    streaming: false,
                    overrideConfig: {}
                }
            })
            .json<FlowisePredictionResponse>()

        return response
    } catch (error: unknown) {
        if (error instanceof HTTPError) {
            const errorText = await error.response.text()
            throw new Error(`Flowise request failed: ${error.response.status} ${errorText}`)
        }
        throw error
    }
}

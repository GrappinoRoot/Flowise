import type { AppState } from '../types/chat'
import { reducer } from './reducer'
import { notify } from './subscribers'
import type { ActionType, ActionPayloadMap } from './actions'
import { runMiddlewares } from '../middleware/middleware'
import { actions } from './actions'

let state: AppState = {
    user: null,
    conversations: [],
    activeConversationId: null,
    loading: false
}

export function getState(): AppState {
    return state
}

export function setState(newState: AppState) {
    state = newState
    notify()
}

export function dispatchStore<K extends ActionType>(type: K, payload: ActionPayloadMap[K]) {
    runMiddlewares(type, payload, {
        dispatch: dispatchStore,
        getState: getState
    })

    const action = actions[type]
    const processedPayload = action.process(payload)

    state = reducer(state, type, processedPayload as ActionPayloadMap[ActionType])
    notify()
}

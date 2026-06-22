import { create } from 'zustand'
import type { AppState } from '../types/chat'
import { reducer } from './reducer'
import type { ActionType, ActionPayloadMap } from './actions'
import { runMiddlewares } from '../middleware/middleware'

// STORE
export const useAppStore = create<
    AppState & {
        dispatchStore: <K extends ActionType>(type: K, payload: ActionPayloadMap[K]) => void
    }
>((set, get) => ({
    user: null,
    conversations: [],
    activeConversationId: null,
    loading: false,

    dispatchStore: (type, payload) => {
        runMiddlewares(type, payload, {
            dispatch: get().dispatchStore,
            getState: () => get()
        })
        const newState = reducer(get(), type, payload)
        set(newState)
        // Zustand notifica automaticamente tutti i subscriber
    }
}))

export function getState(): AppState {
    return useAppStore.getState()
}

/** Sottoscrizione allo store — restituisce la funzione di unsubscribe */
export function subscribe(cb: () => void): () => void {
    return useAppStore.subscribe(() => cb())
}

export function dispatchStore<K extends ActionType>(type: K, payload: ActionPayloadMap[K]) {
    return useAppStore.getState().dispatchStore(type, payload)
}

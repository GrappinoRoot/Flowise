import { create } from 'zustand'
import type { AppState } from '../types/chat'
import { reducer } from './reducer'
import type { ActionType, ActionPayloadMap } from './actions'
import { runMiddlewares } from '../middleware/middleware'

let subscribers: (() => void)[] = []

export function notify() {
    subscribers.forEach((cb) => cb())
}

export function subscribe(cb: () => void) {
    subscribers.push(cb)
    return () => {
        subscribers = subscribers.filter((c) => c != cb)
    }
}

// STORE
export const useAppStore = create<
    AppState & {
        dispatchStore: <K extends ActionType>(type: K, payload: ActionPayloadMap[K]) => void
        setUser: (user: AppState['user']) => void
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
        notify()
    },

    setUser: (user) => {
        set({ user })
        notify()
    }
}))

export function getState(): AppState {
    return useAppStore.getState()
}

export function setState(newState: AppState) {
    useAppStore.setState(newState)
    notify()
}

export function dispatchStore<K extends ActionType>(type: K, payload: ActionPayloadMap[K]) {
    return useAppStore.getState().dispatchStore(type, payload)
}

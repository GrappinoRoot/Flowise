import type { AppState } from '../types/chat'
import type { ActionPayloadMap, ActionType } from './actions'
import { createConversation, renameConversation, deleteConversation, selectConversation } from './reducersUtility/conversationReducer'
import { addMessage } from './reducersUtility/messageReducer'
import { startLoading, stopLoading } from './reducersUtility/uiReducer'

export function reducer(currentState: AppState, type: ActionType, payload: ActionPayloadMap[ActionType]): AppState {
    switch (type) {
        case 'CONVERSATION_CREATED':
            return createConversation(currentState, payload as ActionPayloadMap['CONVERSATION_CREATED'])
        case 'CONVERSATION_SELECTED':
            return selectConversation(currentState, payload as ActionPayloadMap['CONVERSATION_SELECTED'])
        case 'MESSAGE_ADDED':
            return addMessage(currentState, payload as ActionPayloadMap['MESSAGE_ADDED'])
        case 'LOADING_STARTED':
            return startLoading(currentState)
        case 'LOADING_FINISHED':
            return stopLoading(currentState)
        case 'CONVERSATION_RENAMED':
            return renameConversation(currentState, payload as ActionPayloadMap['CONVERSATION_RENAMED'])
        case 'CONVERSATION_DELETED':
            return deleteConversation(currentState, payload as ActionPayloadMap['CONVERSATION_DELETED'])
        case 'USER_SET':
            return { ...currentState, user: (payload as ActionPayloadMap['USER_SET']).user }
        case 'USER_CLEAR':
            return { ...currentState, user: null }
        default:
            return currentState
    }
}

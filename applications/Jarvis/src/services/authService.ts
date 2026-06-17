import { supabase } from '../lib/supabaseClient'
import { dispatchStore } from '../store/store'

export async function getCurrentSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
}

export async function hydrateAuth() {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
        dispatchStore('USER_SET', {
            user: {
                id: data.user.id,
                email: data.user.email!,
                avatarUrl: data.user.user_metadata?.avatar_url
            }
        })
    } else {
        dispatchStore('USER_CLEAR', undefined)
    }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Errore durante il logout:', error)
}

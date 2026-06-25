/**
 * Parsa un HTML string che DEVE avere un singolo <template> wrapper radice.
 * Restituisce il DocumentFragment del contenuto interno, clonato e pronto per l'uso.
 *
 * Convenzione: ogni file .html di un componente inizia con <template> e finisce con </template>.
 */
export function createTemplate(html: string): DocumentFragment {
    const outer = document.createElement('template')
    outer.innerHTML = html

    const inner = outer.content.firstElementChild

    if (!(inner instanceof HTMLTemplateElement)) {
        throw new Error('[createTemplate] Il file HTML deve essere wrappato in un tag <template>.')
    }

    return inner.content.cloneNode(true) as DocumentFragment
}

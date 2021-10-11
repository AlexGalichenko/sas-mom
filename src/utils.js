export function message(content) {
    if (typeof content === 'object') return JSON.stringify(content)
    return Buffer.from(content.toString())
}

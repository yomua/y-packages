export default (obj: Record<string, any>) => {
    let isEmpty = true

    isEmpty = Object.keys(obj).length === 0

    if (Object.getOwnPropertySymbols(obj).length > 0) {
        isEmpty = false
    }

    return isEmpty
}

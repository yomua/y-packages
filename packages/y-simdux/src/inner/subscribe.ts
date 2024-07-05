import store from '../store'

export default function subscribe(fn: () => void) {
    store.saveSubscribe(fn)
}

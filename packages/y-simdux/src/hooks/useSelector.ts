import { Selector } from '../types.d'
import store from '../store'

export default function useSelector(selector: Selector) {
    const state = selector(store.states)

    return state
}

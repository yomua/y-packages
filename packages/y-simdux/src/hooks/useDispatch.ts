import store from '../store'
import { Action, ScopeName } from '../types.d'

export default function useDispatch() {
    if (Object.keys(store.states).length === 0) {
        throw new Error('请先创建分片: createSlice is undefined')
    }

    const dispatch = (action: Action) => {
        const { type } = action

        const scopeName: ScopeName = type.split('/')[0]

        const reducer = store.getReducer(type)

        if (!reducer || typeof reducer !== 'function') {
            throw new Error('reducer is undefined')
        }

        const prevState = store.getState(scopeName)

        const newState = reducer(prevState, action)

        store.saveState(scopeName, {
            ...prevState,
            ...newState,
        })

        // 数据都更新后才通知所有订阅者
        store.subscribes.forEach((fn) => fn())
    }

    return dispatch
}

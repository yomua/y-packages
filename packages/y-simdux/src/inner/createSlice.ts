import store from '../store'
import { Action, Reducer, State } from '../types.d'

type SliceOptions = {
    name: string
    initialState: State
    reducers: Record<string, Reducer>
    // extraReducers?: object
    // caseReducers?: object
    // extraArgument?: object
    // reducerPath?: string
    // middleware?: object
    // devTools?: object
    // enhancers?: object
    // preloadedState?: object
}

type ReducerState = {
    [Key in keyof State]?: State[Key]
}

// 对用户定义的 reducers 进行代理
// 当用户调用 createSlice 返回的 actions 中的 reducer 时，
// 会经过这一层, 返回一个 Action, 再被用户使用
function getProxyActions(
    scopeName: SliceOptions['name'],
    reducers: SliceOptions['reducers'],
) {
    const proxyReducers: Record<string, (payload: any) => Action> = {}

    for (const fnName in reducers) {
        const type = `${scopeName}/${fnName}` as Action['type']

        store.saveReducer(type, reducers[fnName])

        proxyReducers[fnName] = function (payload: any) {
            return {
                type,
                payload,
            }
        }
    }

    return proxyReducers
}

export default function createSlice(config: SliceOptions) {
    const { name, initialState, reducers } = config

    if (store.getState(name)) {
        throw new Error(`分片 ${name} 已经存在`)
    }

    store.saveState(name, initialState)

    const actions = getProxyActions(name, reducers)

    const reducer = (state: ReducerState, action: Action): ReducerState => {
        if (state === void 0) {
            state = store.getState(name)
        }

        const reducerFn = store.getReducer(action.type)

        return reducerFn && typeof reducerFn === 'function'
            ? {
                  ...state,
                  ...reducerFn(state, action),
              }
            : state
    }

    return {
        actions,
        reducer,
    }
}

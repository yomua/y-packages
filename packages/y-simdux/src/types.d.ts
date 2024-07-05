type FnName = string // createSlice 传入的 reducers 对象的每个方法名
type ScopeName = string // 使用 createSlice 时传入的 name

export type State = Record<string, any>

export type Action = {
    type: `${ScopeName}/${FnName}`
    payload: any
}

export type Reducer = (state: State, action: Action) => any

export type Selector = (state: State) => any

export type Subscribe = () => void

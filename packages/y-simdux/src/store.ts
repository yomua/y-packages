/* eslint-disable */
import { Action, Reducer, ScopeName, Subscribe } from './types.d'

// 全局存储
class Store {
    static instance: Store
    private reducerMap: Record<Action['type'], Function>
    private stateMap: Record<ScopeName, any>
    private subscribeArray: Subscribe[]

    constructor() {
        this.reducerMap = {}
        this.stateMap = {}
        this.subscribeArray = []
    }

    static get singleInstance() {
        if (!this.instance) {
            this.instance = new Store()
        }

        return this.instance
    }

    saveReducer(type: Action['type'], reducer: Function) {
        this.reducerMap[type] = reducer
    }

    getReducer(type: Action['type']) {
        return this.reducerMap[type] as Reducer
    }

    saveState(scopeName: ScopeName, state: any) {
        this.stateMap[scopeName] = state
    }

    getState(scopeName: ScopeName) {
        return this.stateMap[scopeName]
    }

    saveSubscribe(subscribe: Subscribe) {
        this.subscribeArray.push(subscribe)
    }

    get reducers() {
        return this.reducerMap
    }

    get states() {
        return this.stateMap
    }

    get subscribes() {
        return this.subscribeArray
    }
}

export default Store.singleInstance

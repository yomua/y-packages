declare module '@yomua/y-indexeddb' {
  export default class IndexedDB {
    static get singleInstance(): IndexedDB
    open(options?: {
      dbVersion?: number
      specifyKey?: string
      dbName?: string
      dbStoreName?: string
    }): void
    getDataFromStore(filepath: string): IDBRequest<any> | undefined
    addDataFromStore(filepath: string, data: Data): void
    deleteDataFromStore(filepath: string): void
    updateDataFromStore(filepath: string, updateData: string): void
    clearDataFromStore(): void
  }
}

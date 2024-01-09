export class SingletonEventemitter {
  static instance: SingletonEventemitter
  static get singleInstance(): SingletonEventemitter
  on<T extends string | symbol>(
    event: T,
    fn: (...args: any[]) => void,
    context?: any,
  ): void
  emit<T extends string | symbol>(event: T, ...args: any[]): void
  off<T extends string | symbol>(
    event: T,
    fn?: ((...args: any[]) => void) | undefined,
    context?: any,
    once?: boolean | undefined,
  ): void
  removeAllListeners(event?: string | symbol | undefined): void
}

export default SingletonEventemitter.singleInstance

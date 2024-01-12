import type HTTP from 'http'

export type Request = HTTP.IncomingMessage
export type Response = HTTP.ServerResponse<HTTP.IncomingMessage> & {
  req: HTTP.IncomingMessage
}

export interface Server {
  listener(
    path: string,
    onListener: (req: Request, res: Response) => void,
  ): void
  cors(onCors: (req: Request, res: Response) => void): void
  start(port: number, onStart: (port: number) => void): void
}

export default function ServerFn(): Server

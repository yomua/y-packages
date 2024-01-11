import store from "../store.js";
import type { Request, Response } from "../index.d";


export default function (
  path: string,
  onListener: (req: Request, res: Response) => void
) {
  store.savePath(path, onListener);
}

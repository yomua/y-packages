import store from "../store.js";
import type { Request, Response } from "../index.d";

export default function (onCors: (req: Request, res: Response) => void) {
  store.saveCors(onCors);
}

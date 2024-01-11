import type { GB } from "./index.d";
import listener from "./methods/listener.js";
import cors from "./methods/cors.js";
import start from "./methods/start.js";

export default function gb(): GB {
  if (new.target) {
    throw new TypeError("Cannot use new to call gb");
  }

  return {
    cors, // 解决跨域的
    listener, // 监听路由的
    start, // 启动服务的
  };
}

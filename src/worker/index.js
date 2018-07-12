import { VirtualStageManager } from "./VirtualStageManager";

const vsm = new VirtualStageManager();

onmessage = e => vsm.handle(e.data);

vsm.on("emit", e => postMessage(e));
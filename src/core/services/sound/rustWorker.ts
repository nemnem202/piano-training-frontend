// wasmWorker.ts
import initRustSynth, {
  generate_buffer,
  init_buffer,
  play_note,
  stop_note,
} from "./rust-synth/build/rust_synth.js";

let wasmReady = false;
let flag: Int32Array;

const initModule = async () => {
  await initRustSynth();
  console.log("[RUST WORKER] Rust WASM ready in Worker!");
  wasmReady = true;
};

initModule();

self.onmessage = (e: MessageEvent) => {
  if (e.data.type === "init") {
    const sharedBuffer = e.data.sharedBuffer;
    const ringBufferSize = e.data.ringBufferSize;

    if (!(sharedBuffer instanceof SharedArrayBuffer) || typeof ringBufferSize !== "number") return;

    const indexes = new Int32Array(sharedBuffer, 0, 3);
    flag = indexes.subarray(0, 1);

    init_buffer(sharedBuffer, ringBufferSize);

    console.log("[RUST WORKER] initialisation done, processing loop...");
    processLoop();
  }
};

const processLoop = () => {
  while (true) {
    Atomics.wait(flag, 0, 1); // tant que la valeur est 1, on bloque le processus

    console.log("[RUST WORKER] flag changed, processing buffer");

    generate_buffer();

    Atomics.store(flag, 0, 1);
  }
};

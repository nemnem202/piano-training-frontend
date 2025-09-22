// wasmWorker.ts
import initRustSynth, { init_buffer, process_loop } from "./rust-synth/build/rust_synth.js";

const initModule = async () => {
  await initRustSynth();
  console.log("[RUST WORKER] Rust WASM ready in Worker!");
  self.postMessage({ type: "module_end_init" });
};

initModule();

self.onmessage = (e: MessageEvent) => {
  if (e.data.type === "init_wasm") {
    const sharedBuffer = e.data.sharedBuffer;
    const ringBufferSize = e.data.ringBufferSize;

    if (!(sharedBuffer instanceof SharedArrayBuffer) || typeof ringBufferSize !== "number") return;

    init_buffer(sharedBuffer, ringBufferSize);

    console.log("[RUST WORKER] initialisation done, processing loop...");
    // processLoop(sharedBuffer, ringBufferSize);
    // processLoop();
    process_loop();
  }
};

// const processLoop = (buff: SharedArrayBuffer, size: number) => {
//   const indexes = new Int32Array(buff, 0, 3);
//   const flag = indexes.subarray(0, 1);
//   const readIndex = indexes.subarray(1, 2);
//   const writeIndex = indexes.subarray(2, 3);

//   const indexesBytes = Int32Array.BYTES_PER_ELEMENT * 3;
//   const ringBuffer = new Float32Array(buff, indexesBytes, size);

//   const freq = 440;
//   const sampleRate = 44100;
//   let phase = 0;

//   const N = ringBuffer.length;

//   while (true) {
//     // attend que flag ait été posé à 0 par le worklet (le wait bloque si flag === 1)
//     Atomics.wait(flag, 0, 1);

//     // on récupère les positions
//     const rIndex = Atomics.load(readIndex, 0);
//     let wIndex = Atomics.load(writeIndex, 0);

//     // calcule l'espace libre (on réserve 1 slot pour éviter overwrite)
//     const spaceToWrite = (rIndex - wIndex - 1 + N) % N;

//     if (spaceToWrite > 0) {
//       // si tu veux limiter la taille écrite en un seul block (recommandé),
//       // choisis chunk = Math.min(spaceToWrite, someChunkSize)
//       const chunk = spaceToWrite; // ou Math.min(spaceToWrite, YOUR_CHUNK_SIZE)

//       for (let i = 0; i < chunk; i++) {
//         const sample = Math.sin(phase * 2 * Math.PI);
//         ringBuffer[wIndex] = sample;
//         wIndex = (wIndex + 1) % N;

//         phase += freq / sampleRate;
//         if (phase >= 1) phase -= 1;
//       }

//       // mettre à jour writeIndex en une seule opération atomique
//       Atomics.store(writeIndex, 0, wIndex);
//     } else {
//       // pas d'espace : possible si readIndex n'a pas avancé
//       // (on peut logguer si besoin)
//       // console.warn("no space to write");
//     }

//     // signaler au worklet que les données sont prêtes
//     Atomics.store(flag, 0, 1);
//     Atomics.notify(flag, 0, 1);
//   }
// };

// const processLoop = () => {
//   while (true) {
//     Atomics.wait(flag, 0, 1); // tant que la valeur est 1, on bloque le processus

//     console.log("[RUST WORKER] flag changed, processing buffer");

//     generate_buffer();

//     Atomics.store(flag, 0, 1);
//     Atomics.notify(flag, 0);
//   }
// };

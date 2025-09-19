const BUFFER_SIZE = 1024;
const BUFFER_QUEUE_LENGTH = 2;
const RING_BUFFER_SIZE = BUFFER_SIZE * BUFFER_QUEUE_LENGTH;

export class AudioEngineOrchestrator {
  private static instance: AudioEngineOrchestrator;

  private refCount = 0;

  private audioCtx!: AudioContext;
  private workletNode!: AudioWorkletNode;
  private rustWorker!: Worker;

  private constructor() {}

  public static getInstance(): AudioEngineOrchestrator {
    if (!this.instance) {
      this.instance = new AudioEngineOrchestrator();
    }
    return this.instance;
  }

  public async init() {
    if (this.audioCtx) return;

    /////////////////////////////////////
    // définition du buffer partagé,
    // il contient le tableau du current buffer,
    // un flag pour synchroniser les threads et
    // un undex de lecture + un index d'ecriture
    //////////////////////////////////////////////

    const float32ringBufferBytes = RING_BUFFER_SIZE * Float32Array.BYTES_PER_ELEMENT;

    const indexesBytes = Int32Array.BYTES_PER_ELEMENT * 3;

    const sharedBuffer = new SharedArrayBuffer(indexesBytes + float32ringBufferBytes);

    // on crée un tableau indexes ou 1 = flag,
    // 2 et 3 => read et write index qui seront utiles dan sl'audioWorklet

    const indexes = new Int32Array(sharedBuffer, 0, 3);
    const flag = indexes.subarray(0, 1);

    Atomics.store(flag, 0, 1);

    //////////////////////////////////////
    // Initialisation du worker wasm
    /////////////////////////////////////

    console.log("[SOUND ENGINE] creation of rust worker...");

    this.rustWorker = new Worker(new URL("./rustWorker.ts", import.meta.url), {
      type: "module",
      name: "rustWorker",
    });

    this.rustWorker.onmessage = (e: MessageEvent) => {
      if (e.data.type === "module_end_init") {
        console.log("[SOUND ENGINE] worker module init end, init wasm...");
        this.rustWorker.postMessage({
          type: "init_wasm",
          sharedBuffer: sharedBuffer,
          ringBufferSize: RING_BUFFER_SIZE,
        });
      }
    };

    ///////////////////////////////////////
    // initialisation du contexte audio
    /////////////////////////////////////

    this.audioCtx = new AudioContext({ sampleRate: 44100 });

    await this.audioCtx.resume();

    const moduleUrl = new URL("./audioWorkletModule.ts", import.meta.url);
    await this.audioCtx.audioWorklet.addModule(moduleUrl.href);

    this.workletNode = new AudioWorkletNode(this.audioCtx, "sound-processor", {
      outputChannelCount: [2],
      processorOptions: {
        bufferSize: BUFFER_SIZE,
        ringBufferSize: RING_BUFFER_SIZE,
        sharedBuffer: sharedBuffer,
      },
    });

    this.workletNode.connect(this.audioCtx.destination);

    /////////////////////////////
    // mise en place des logs pour le debug
    ////////////////////////////

    let lastBufferRequestTime: number | null = null;

    this.workletNode.port.onmessage = (event) => {
      if (event.data.type === "log" && event.data.message === "[AUDIO WORKLET] buffer requested") {
        const now = performance.now(); // timestamp haute précision en ms

        if (lastBufferRequestTime !== null) {
          const delta = now - lastBufferRequestTime;
          console.log(`Intervalle depuis dernier buffer request: ${delta.toFixed(2)} ms`);
        }

        lastBufferRequestTime = now;
      }
    };
  }

  release() {
    this.refCount--;
    if (this.refCount <= 0) {
      console.log("stop to audio context");
      if (this.workletNode) this.workletNode.disconnect();

      this.audioCtx.close();
      this.rustWorker.terminate();
      this.audioCtx = null!;
      this.workletNode = null!;
      this.rustWorker = null!;
      AudioEngineOrchestrator.instance = null!;
    }
  }
}

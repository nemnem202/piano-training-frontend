const BUFFER_SIZE = 4096;
const BUFFER_QUEUE_LENGTH = 2;
const RING_BUFFER_SIZE = BUFFER_SIZE * BUFFER_QUEUE_LENGTH;

export class SoundEngine {
  private static instance: SoundEngine;
  private audioCtx!: AudioContext;
  private workletNode!: AudioWorkletNode;

  private constructor() {}

  public static getInstance(): SoundEngine {
    if (!this.instance) {
      this.instance = new SoundEngine();
    }
    return this.instance;
  }

  public async init() {
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

    const rustWorker = new Worker(new URL("./rustWorker.ts", import.meta.url), {
      type: "module",
      name: "rustWorker",
    });

    rustWorker.postMessage({
      type: "init",
      sharedBuffer: sharedBuffer,
      ringBufferSize: RING_BUFFER_SIZE,
    });

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

    this.workletNode.port.onmessage = async (event) => {
      if (event.data.type === "log") {
        console.log(event.data.message);
      }
    };
  }
}

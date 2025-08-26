const BUFFER_SIZE = 4096;

export class SoundEngine {
  private static instance: SoundEngine;
  private static module: any;
  private audioCtx!: AudioContext;
  private workletNode!: AudioWorkletNode;
  private bufferMomentum: number = 0;
  private constructor() {}

  public static getInstance(): SoundEngine {
    if (!this.instance) {
      this.instance = new SoundEngine();
    }
    return this.instance;
  }

  public async init(module: any) {
    SoundEngine.module = module;

    this.audioCtx = new AudioContext({ sampleRate: 44100 });
    await this.audioCtx.resume();

    await this.audioCtx.audioWorklet.addModule("/lib/audioWorkletModule.js");

    this.workletNode = new AudioWorkletNode(this.audioCtx, "sound-processor", {
      outputChannelCount: [2],
      processorOptions: {
        bufferSize: BUFFER_SIZE,
      },
    });

    this.workletNode.connect(this.audioCtx.destination);

    console.log("AudioWorklet initialized");

    this.workletNode.port.onmessage = async (event) => {
      if (event.data.type === "buffer-request") {
        
        const buffer = new Float32Array(BUFFER_SIZE);
        for (let i = 0; i < BUFFER_SIZE; i++) {
          buffer[i] = Math.sin((2 * Math.PI * 440 * i) / this.audioCtx.sampleRate);
        }

        this.workletNode.port.postMessage({ type: "buffer", buffer }, [buffer.buffer]);
      }
    };
  }
}

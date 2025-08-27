import { generate_buffer } from "./rust-synth/build/rust_synth";

const BUFFER_SIZE = 4096 / 2 / 2;

export class SoundEngine {
  private static instance: SoundEngine;
  private audioCtx!: AudioContext;
  private workletNode!: AudioWorkletNode;

  private a = 0;
  private constructor() {}

  public static getInstance(): SoundEngine {
    if (!this.instance) {
      this.instance = new SoundEngine();
    }
    return this.instance;
  }

  public async init() {
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

    this.workletNode.port.onmessage = async (event) => {
      if (event.data.type === "buffer-request") {
        const buffer = new Float32Array(BUFFER_SIZE);
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] = Math.sin((2 * Math.PI * 440 * this.a) / 44100);
          this.a++;
        }
        console.log(buffer.length);
        this.workletNode.port.postMessage({ type: "buffer", buffer }, [buffer.buffer]);
      } else if (event.data.type === "log") {
        console.log(event.data.message);
      }
    };
  }
}

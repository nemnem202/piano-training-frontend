class AudioWorkletModule extends AudioWorkletProcessor {
  private bufferSize: number;
  private ringBufferSize: number;

  private ringBuffer: Float32Array<any>;

  private readIndex: Int32Array<any>;
  private writeIndex: Int32Array<any>;
  private availableSamples = 0;

  private flag: Int32Array;

  constructor(options: AudioWorkletNodeOptions) {
    super();

    this.bufferSize = options.processorOptions.bufferSize; // taille d’un chunk
    this.ringBufferSize = options.processorOptions.ringBufferSize;

    const sharedBuffer = options.processorOptions.sharedBuffer;

    const indexes = new Int32Array(sharedBuffer, 0, 3);
    this.flag = indexes.subarray(0, 1);
    this.readIndex = indexes.subarray(1, 2);
    this.writeIndex = indexes.subarray(2, 3);

    const indexesBytes = Int32Array.BYTES_PER_ELEMENT * 3;
    this.ringBuffer = new Float32Array(sharedBuffer, indexesBytes, this.ringBufferSize);
  }

  process(inputs: any, outputs: any, parameters: any) {
    const output = outputs[0];
    const left = output[0];
    const right = output[1];

    const rIndex = Atomics.load(this.readIndex, 0);
    const wIndex = Atomics.load(this.writeIndex, 0);

    for (let i = 0; i < left.length; i++) {
      if (rIndex === wIndex) {
        // 🔇 Pas de donnée -> silence
        left[i] = 0;
        right[i] = 0;

        // Préviens main thread qu’on a besoin de data
        this.port.postMessage({ type: "log", message: "[AUDIO WOKLET] no inputs" });
      } else {
        // 🔊 Lire un sample du ring buffer
        const sample = this.ringBuffer[rIndex];
        left[i] = sample;
        right[i] = sample; // copie en stéréo pour l’instant

        // avancer readIndex
        Atomics.store(this.readIndex, 0, (rIndex + 1) % this.ringBufferSize);
      }
    }

    const availableSamples = (wIndex - rIndex + this.ringBufferSize) % this.ringBufferSize;

    if (availableSamples < this.bufferSize && Atomics.load(this.flag, 0) === 1) {
      this.port.postMessage({ type: "log", message: "[AUDIO WORKLET] buffer requested" });
      Atomics.store(this.flag, 0, 0);
      Atomics.notify(this.flag, 0);
    }

    return false;
  }
}

registerProcessor("sound-processor", AudioWorkletModule);

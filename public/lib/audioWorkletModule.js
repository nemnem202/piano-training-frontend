const BUFFER_SIZE = 2048 / 2 / 2;

class AudioWorkletModule extends AudioWorkletProcessor {
  processingBuffer = false;
  constructor(options) {
    super();

    this.bufferSize = options.processorOptions.bufferSize * 2; // tampon circulaire
    this.buffer = new Float32Array(this.bufferSize);
    this.readIndex = 0;
    this.writeIndex = 0;
    this.availableSamples = 0;

    this.port.onmessage = (event) => {
      if (event.data.type === "buffer") {
        const data = event.data.buffer;
        for (let i = 0; i < data.length; i++) {
          this.buffer[this.writeIndex] = data[i];
          this.writeIndex = (this.writeIndex + 1) % this.bufferSize;
        }
        this.availableSamples += data.length;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0]; // stéréo
    const left = output[0];
    const right = output[1];

    for (let i = 0; i < left.length; i++) {
      if (this.availableSamples > 0) {
        left[i] = this.buffer[this.readIndex];
        right[i] = this.buffer[this.readIndex];
        this.readIndex = (this.readIndex + 1) % this.bufferSize;
        this.availableSamples--;
      } else {
        left[i] = 0; // silence si vide
        right[i] = 0;
      }
    }

    if (this.availableSamples < BUFFER_SIZE && !this.processingBuffer) {
      this.port.postMessage({ type: "buffer-request" });
      this.processingBuffer = true;
    } else if (this.availableSamples >= BUFFER_SIZE) {
      this.processingBuffer = false;
    } else if (this.availableSamples === 0) {
      this.port.postMessage({ type: "log", message: "glitch !" });
    }

    return true;
  }
}

registerProcessor("sound-processor", AudioWorkletModule);

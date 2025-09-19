export async function audioFileToFloat32Array(file: File): Promise<Float32Array[]> {
  const arrayBuffer = await file.arrayBuffer();

  // Crée un contexte audio (44.1 kHz par défaut)
  const audioContext = new AudioContext({ sampleRate: 44100 });

  // Décodage en AudioBuffer (chaque canal a ses samples en Float32)
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const channels: Float32Array[] = [];
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i)); // Float32Array
  }

  return channels; // tableau de canaux, chaque canal = Float32Array
}

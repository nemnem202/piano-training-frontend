#include <algorithm>
#include <cstdint>
#include <emscripten/bind.h>
#include <emscripten/emscripten.h>
#include <emscripten/val.h>
#include <vector>

using namespace emscripten;

const int SAMPLE_RATE = 44100;

enum class Waveform : uint8_t { Sin, Square, Saw, Sawtooth, Sample };

struct Filter {
  uint8_t type;
  uint8_t q;
  uint16_t freq;
  int8_t gain;
};

struct Envelope {
  uint8_t attack;
  uint8_t decay;
  uint8_t release;
};

struct Oscillator {
  Waveform waveform;
  Envelope envelope;
  std::vector<Filter> filters;
};

struct Note {
  uint8_t value;
  uint8_t velocity;
  float phase;
  bool hasEnded;
};

bool isValidFilter(val filter) {

  return filter.hasOwnProperty("type") && filter["type"].isNumber() &&
         filter.hasOwnProperty("q") && filter["q"].isNumber() &&
         filter.hasOwnProperty("frequency") && filter["frequency"].isNumber() &&
         filter.hasOwnProperty("gain") && filter["gain"].isNumber();
}

bool isValidOscillator(val osc) {
  return osc.hasOwnProperty("waveform") && osc["waveform"].isNumber() &&
         osc.hasOwnProperty("attack") && osc["attack"].isNumber() &&
         osc.hasOwnProperty("decay") && osc["decay"].isNumber() &&
         osc.hasOwnProperty("release") && osc["release"].isNumber() &&
         osc.hasOwnProperty("filters") && osc["filters"].isArray();
}

bool validateSynthConfig(val config) {
  if (!config.hasOwnProperty("oscillators") || !config["oscillators"].isArray())
    return false;
  if (!config.hasOwnProperty("log") || config["log"].isUndefined())
    return false;

  val oscillators = config["oscillators"];
  for (unsigned int i = 0; i < oscillators["length"].as<unsigned int>(); ++i) {
    if (!isValidOscillator(oscillators[i]))
      return false;

    val filters = oscillators[i]["filters"];
    for (unsigned int j = 0; j < filters["length"].as<unsigned int>(); ++j) {
      if (!isValidFilter(filters[j]))
        return false;
    }
  }
  return true;
}

class Synth {

private:
  std::vector<Note> notes;
  std::vector<float> buffer;

  void logNotes() {
    std::string notesStr = "notes: [";
    for (const auto &n : notes) {
      notesStr += std::to_string(n.value) + ", ";
    }

    notesStr += "]";
    log(val(notesStr));
  };

public:
  val synthConfig;

  Synth() {}

  void init(val config) {

    if (!validateSynthConfig(config)) {
      log(val("an error occured"));
      return;
    }
    synthConfig = config;

    log(val("synth initialized"));
  }

  void playNote(uint8_t value, uint8_t velocity) {

    notes.push_back({value, velocity, 0.0f, false});

    logNotes();
  }

  void stopNote(uint8_t value) {
    notes.erase(
        std::remove_if(notes.begin(), notes.end(),
                       [value](const Note &n) { return n.value == value; }),
        notes.end());

    logNotes();
  }

  void log(val params) {
    if (synthConfig["log"].as<bool>() != false) {
      synthConfig["log"](params);
    }
  };

  /////////////////////////////

  uintptr_t allocateBuffer(size_t size) {
    buffer.resize(size, 0.0f);
    return reinterpret_cast<uintptr_t>(buffer.data());
  }

  size_t getBufferSize() const { return buffer.size(); }

  void fillSine(float freq) {
    for (size_t i = 0; i < buffer.size(); i++) {
      buffer[i] = sinf(2.f * 3.14159265f * freq * i / SAMPLE_RATE);
    }
  }
};

Synth &getSynth() {
  static Synth instance;
  return instance;
}

void initSynth(val config) { getSynth().init(config); }

void playSynthNote(uint8_t value, uint8_t velocity) {
  getSynth().playNote(value, velocity);
}

void stopSynthNote(uint8_t value) { getSynth().stopNote(value); }

uintptr_t allocateSynthBuffer(size_t size) {
  return getSynth().allocateBuffer(size);
}

size_t getSynthBufferSize() { return getSynth().getBufferSize(); }

void fillSynthSine(float freq) { getSynth().fillSine(freq); }
EMSCRIPTEN_BINDINGS(my_module) {

  function("initSynth", &initSynth);
  function("playNote", &playSynthNote);
  function("stopNote", &stopSynthNote);

  // Buffer optimisé
  function("allocateSynthBuffer", &allocateSynthBuffer, allow_raw_pointers());
  function("getSynthBufferSize", &getSynthBufferSize);
  function("fillSynthSine", &fillSynthSine);
}

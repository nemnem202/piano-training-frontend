use std::{cell::RefCell, f64::consts::PI};
use wasm_bindgen::prelude::*;

#[derive(Debug)]
struct Note {
    value: u8,
    velocity: u8,
    phase: u64,
    has_ended: bool,
}

#[derive(Debug, Clone, Copy)]
pub enum Waveform {
    Sin,
    Square,
    Saw,
    Sawtooth,
}

// Types de filtre
#[derive(Debug, Clone, Copy)]
pub enum FilterType {
    LowCut,
    HighCut,
    Bell,
    LowShelf,
    HighShelf,
}

// Structure d'un filtre
#[derive(Debug, Clone)]
pub struct Filter {
    pub filter_type: FilterType,
    pub q: f32,
    pub frequency: f32,
    pub gain: f32,
}

// Structure d'un oscillateur
#[derive(Debug, Clone)]
pub struct Oscillator {
    pub waveform: Waveform,
    pub attack: u8,
    pub decay: u8,
    pub release: u8,
    pub filters: Vec<Filter>,
    pub gain: u8,
}

#[derive(Debug, Clone)]
pub struct SynthConfig {
    pub oscillators: Vec<Oscillator>,
}

thread_local! {
    static PHASE_SCALE: f64 = 2.0f64.powi(64);
    static SAMPLE_RATE: u16= 44100;
    static TWO_PI: f64 = (PI * 2.0) as f64;
    static NOTES: RefCell<Vec<Note>> = RefCell::new(Vec::new());
    static SYNTH_CONFIG: RefCell<SynthConfig> = RefCell::new(SynthConfig { oscillators: vec![
        Oscillator {
            waveform: Waveform::Sin,
            attack:15,
            decay:50,
            release:200,
            filters: Vec::new(),
            gain:1
        }
    ] })
}

#[wasm_bindgen]
pub fn play_note(value: u8, velocity: u8) -> String {
    let note = Note {
        value,
        velocity,
        phase: 0,
        has_ended: false,
    };
    NOTES.with(|notes| notes.borrow_mut().push(note));

    return NOTES.with(|notes| {
        notes
            .borrow()
            .iter()
            .map(|n| n.value.to_string()) // convertit chaque valeur en String
            .collect::<Vec<String>>() // on récupère un Vec<String>
            .join(",") // on joint avec des virgules (ou autre séparateur)
    });
}

#[wasm_bindgen]
pub fn stop_note(value: u8) {
    NOTES.with(|notes| {
        // for note in notes.borrow_mut().iter_mut() {
        //     if note.value == value {
        //         note.has_ended = false;
        //     }
        // }

        notes.borrow_mut().retain(|note| note.value != value)
    });
}

#[wasm_bindgen]
pub fn generate_buffer(size: u16) -> Vec<f32> {
    let mut buffer = vec![0.0f32; size as usize];

    SYNTH_CONFIG.with(|config| {
        for osc in config.borrow().oscillators.iter() {
            let oscillator_buffer = get_buffer_of_an_oscillator(&osc, &size);
            add_buffer_to_main_buffer(&oscillator_buffer, &mut buffer);
        }
    });

    return buffer;
}

// une fonction qui recupere la synthconfig et qui applique les oscillateur pour chaque note
fn get_buffer_of_an_oscillator(osc: &Oscillator, size: &u16) -> Vec<f32> {
    let mut buffer_OSC = vec![0.0f32; *size as usize];

    NOTES.with(|notes| {
        for note in notes.borrow_mut().iter_mut() {
            let note_buffer = apply_oscillator_to_a_note(osc, note, size);
            add_buffer_to_main_buffer(&note_buffer, &mut buffer_OSC);
        }
    });

    return buffer_OSC;
}

// une fonction qui ajoute chaque oscillateur au buffer
fn add_buffer_to_main_buffer(osc_buff: &Vec<f32>, main_buff: &mut Vec<f32>) {
    for (i, sample) in osc_buff.iter().enumerate() {
        main_buff[i] += sample;
    }
}

fn apply_oscillator_to_a_note(osc: &Oscillator, note: &mut Note, size: &u16) -> Vec<f32> {
    let mut buffer = vec![0.0f32; *size as usize];

    for (index, value) in buffer.iter_mut().enumerate() {
        *value = calculate_note_in_buffer_item(index, note);
    }

    return buffer;
}

fn calculate_note_in_buffer_item(index: usize, note: &mut Note) -> f32 {
    return get_value_for_sin(&mut note.phase, note.value);
}

fn midi_to_freq(value: u8) -> f64 {
    return (440.0 / 32.0) * ((2.0_f64).powf((value as f64 - 9.0) / 12.0));
}

fn get_value_for_sin(phase: &mut u64, value: u8) -> f32 {
    let f = midi_to_freq(value);

    let phase_inc = PHASE_SCALE.with(|scale| {
        SAMPLE_RATE.with(|sr| {
            // scale et sr sont des références ici, on les utilise pour le calcul
            (f * *scale / *sr as f64) as u64
        })
    });
    *phase = phase.wrapping_add(phase_inc);

    let phase_angle = (*phase as f64 / PHASE_SCALE.with(|s| *s)) * 2.0 * PI;

    return (phase_angle.sin() * 0.1) as f32;
}

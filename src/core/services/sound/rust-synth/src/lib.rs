use std::{cell::RefCell, f32::consts::PI};
use wasm_bindgen::prelude::*;

thread_local! {
    static NOTES: RefCell<Vec<Note>> = RefCell::new(Vec::new());
}

#[derive(Debug)]
struct Note {
    value: u8,
    velocity: u8,
}

#[wasm_bindgen]
pub fn play_note(value: u8, velocity: u8) -> String {
    let note = Note { value, velocity };
    NOTES.with(|notes| notes.borrow_mut().push(note));
    NOTES.with(|notes| format!("{:?}", notes.borrow()))
}

#[wasm_bindgen]
pub fn stop_note(value: u8) -> String {
    NOTES.with(|notes| {
        notes.borrow_mut().retain(|n| !(n.value == value));
    });
    NOTES.with(|notes| format!("{:?}", notes.borrow()))
}

#[wasm_bindgen]
pub fn generate_buffer(size: u16) -> Vec<f32> {
    let mut buffer = vec![0.0f32; size as usize];

    for (index, value) in buffer.iter_mut().enumerate() {
        *value = ((2.0f32 * PI * 440.0f32 * index as f32) / 44100.0f32).sin();
    }

    buffer
}

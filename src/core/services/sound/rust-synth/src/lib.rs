use js_sys::{Float32Array, Int32Array, SharedArrayBuffer};
use once_cell::unsync::OnceCell;
use wasm_bindgen::prelude::*;

thread_local! {
    static FLAG: OnceCell<Int32Array> = OnceCell::new();
    static READ_INDEX: OnceCell<Int32Array> = OnceCell::new();
    static WRITE_INDEX: OnceCell<Int32Array> = OnceCell::new();
    static RING_BUFFER: OnceCell<Float32Array> = OnceCell::new();
}

struct Note {
    value: u8,
    velocity: u8,
    has_ended: bool,
}

#[wasm_bindgen]
pub fn init_buffer(shared: SharedArrayBuffer, ring_buffer_size: u32) {
    // 3 premiers int32 = flag, readIndex, writeIndex
    let indexes = Int32Array::new(&shared).subarray(0, 3);
    let flag = indexes.subarray(0, 1);
    let read_index = indexes.subarray(1, 2);
    let write_index = indexes.subarray(2, 3);

    let indexes_bytes = (4 // 4 bytes
         * 3) as u32;

    let ring_buffer = Float32Array::new(&shared)
        .subarray(indexes_bytes / 4, (indexes_bytes / 4) + ring_buffer_size);

    FLAG.with(|f| {
        f.set(flag).ok();
    });
    READ_INDEX.with(|ri| {
        ri.set(read_index).ok();
    });
    WRITE_INDEX.with(|wi| {
        wi.set(write_index).ok();
    });
    RING_BUFFER.with(|rb| {
        rb.set(ring_buffer).ok();
    });
}

#[wasm_bindgen]
pub fn generate_buffer() {
    RING_BUFFER.with(|rb| {
        if let Some(ring) = rb.get() {
            // calcule un chunk en Vec<f32>
            let mut local: Vec<f32> = Vec::with_capacity(128);

            for i in 0..128 {
                let sample = ((i as f32) * 0.01).sin();
                local.push(sample);
            }

            let slice = Float32Array::from(local.as_slice());
            ring.set(&slice, 0); // copie en bloc
        }
    });
}

#[wasm_bindgen]
pub fn play_note(value: u8, velocity: u8) -> String {
    return value.to_string();
}

#[wasm_bindgen]
pub fn stop_note(value: u8) -> String {
    return value.to_string();
}

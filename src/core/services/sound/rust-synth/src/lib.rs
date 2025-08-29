use js_sys::{Atomics, Float32Array, Int32Array, SharedArrayBuffer};
use once_cell::unsync::OnceCell;
use std::f32::consts::TAU;
use wasm_bindgen::prelude::*;

thread_local! {
    static FLAG: OnceCell<Int32Array> = OnceCell::new();
    static READ_INDEX: OnceCell<Int32Array> = OnceCell::new();
    static WRITE_INDEX: OnceCell<Int32Array> = OnceCell::new();
    static RING_BUFFER: OnceCell<Float32Array> = OnceCell::new();
}

/// Initialise les vues globales à partir du SharedArrayBuffer côté JS.
/// ring_buffer_size = nombre d'éléments float32 dans le ring buffer (N)
#[wasm_bindgen]
pub fn init_buffer(shared: SharedArrayBuffer, ring_buffer_size: u32) {
    // first 3 Int32 : flag, readIndex, writeIndex
    let indexes = Int32Array::new(&shared).subarray(0, 3);

    let flag = indexes.subarray(0, 1);
    let read_index = indexes.subarray(1, 2);
    let write_index = indexes.subarray(2, 3);

    // offset en éléments Float32 après les 3 Int32 (3 * 4 bytes) => /4 pour index en éléments
    let indexes_bytes = 3 * 4; // 3 * sizeof(Int32)
    let start_elem = (indexes_bytes / 4) as u32;
    let ring_end = start_elem + ring_buffer_size;

    let ring = Float32Array::new(&shared).subarray(start_elem, ring_end);

    FLAG.with(|c| {
        let _ = c.set(flag);
    });
    READ_INDEX.with(|c| {
        let _ = c.set(read_index);
    });
    WRITE_INDEX.with(|c| {
        let _ = c.set(write_index);
    });
    RING_BUFFER.with(|c| {
        let _ = c.set(ring);
    });
}

/// Boucle principale exécutée côté WASM (appelée depuis le Worker).
/// Elle bloque sur Atomics.wait(flag, 0, 1) et génère des blocs sinusoïdaux dans le ring buffer.
#[wasm_bindgen]
pub fn process_loop() {
    // paramètres de synthèse — tu peux ajouter setters si tu veux contrôler depuis JS
    let freq: f32 = 440.0;
    let sample_rate: f32 = 44100.0;
    let mut phase: f32 = 0.0;

    // Récupère les vistas globales (closures thread_local)
    // On répète le corps tant que les vues existent
    FLAG.with(|flag_cell| {
        READ_INDEX.with(|r_cell| {
            WRITE_INDEX.with(|w_cell| {
                RING_BUFFER.with(|rb_cell| {
                    // Obliger la présence des vues
                    let flag = flag_cell.get().expect("flag not initialized");
                    let read_index = r_cell.get().expect("read_index not initialized");
                    let write_index = w_cell.get().expect("write_index not initialized");
                    let ring = rb_cell.get().expect("ring buffer not initialized");

                    // longueur N du ring buffer
                    let n = ring.length() as i32;

                    // boucle de production : bloque le thread via Atomics.wait
                    loop {
                        // Bloque tant que flag[0] === 1
                        let _ = Atomics::wait(flag, 0, 1);

                        // Lire atomiquement rIndex et wIndex
                        let r_js = Atomics::load(read_index, 0).unwrap();
                        let w_js = Atomics::load(write_index, 0).unwrap();

                        let r_index = r_js;
                        let mut w_index = w_js;

                        // Calcul espace libre (on réserve 1 slot pour distinguer plein/vide)
                        // space = (r - w - 1 + N) % N
                        let space = ((r_index - w_index - 1 + n) % n) as i32;

                        if space > 0 {
                            // Pour efficacité, on génère localement un Vec<f32> de 'space' samples
                            let mut local: Vec<f32> = Vec::with_capacity(space as usize);
                            for i in 0..space {
                                // sinusoide : incrément de phase par sample
                                let sample = (phase * TAU).sin();
                                local.push(sample);

                                phase += freq / sample_rate;
                                if phase >= 1.0 {
                                    phase -= 1.0;
                                }
                            }
                            // transforme la slice locale en Float32Array JS
                            let chunk_array = Float32Array::from(local.as_slice());

                            // écriture en 1 ou 2 opérations pour gérer le wrap-around
                            let contiguous = std::cmp::min(space, n - w_index);
                            if contiguous > 0 {
                                // copy contiguous samples starting at w_index
                                ring.set(
                                    &chunk_array.subarray(0, contiguous as u32),
                                    w_index as u32,
                                );
                            }
                            if space as i32 > contiguous {
                                // reste à écrire au début du ring
                                let rest = space - contiguous;
                                ring.set(
                                    &chunk_array
                                        .subarray(contiguous as u32, (contiguous + rest) as u32),
                                    0,
                                );
                                w_index = rest as i32; // écrit au début
                            } else {
                                w_index = (w_index + contiguous) % n;
                            }

                            // mise à jour atomique de writeIndex (en une seule opération)
                            let _ = Atomics::store(write_index, 0, w_index);
                        } // else : pas d'espace à écrire

                        // signaler que les données sont prêtes (flag = 1) et réveiller le worklet
                        let _ = Atomics::store(flag, 0, 1);
                        let _ = Atomics::notify(flag, 0);
                        // puis boucle et attend à nouveau
                    } // loop
                });
            });
        });
    });
}

import { Module } from "../../core/abstract_classes/module";
import { SynthApi } from "../../core/services/sound/synthApi";
import type { ExerciceStore } from "../../core/services/stores/exerciceStore";
import { defaultOscillator } from "../../core/settings/synth";
import type { Bounds } from "../../core/types/modules";
import type { Oscillator, SynthConfig } from "../../core/types/synth";
import type { RadioItem, RadioItems } from "../../core/types/ui";
import { Knob } from "../components/knob/knob";
import { Menu } from "../components/menu/menu";
import { Radio } from "../components/radio/radio";
import { EnveloppeComponent } from "../components/synth/eveloppe";
import { FilterComponent } from "../components/synth/filter";
import { OscillatorComponent } from "../components/synth/oscillator";
import { OscillatorParams } from "../components/synth/params";

export class SynthetizerModule extends Module {
  private localMainContainer = document.createElement("div");
  private oscillatorColumn = document.createElement("div");
  private oscillatorRowIdIndex = 0;
  private config: SynthConfig;
  private synthApi: SynthApi | null = null;

  constructor(bounds: Bounds, store: ExerciceStore) {
    super(bounds, store);

    this.config = store.getState("synthConfig") as SynthConfig;
    this.content.classList.add("synth-module");

    this.setUpSynthApi();
    this.createHeader();
    this.createNav();
    this.createLocalMainContainer();
    this.createOscillatorColumn();
    this.createOscillatorRowButton();

    for (const osc of this.config.oscillators) {
      this.newRow(osc);
    }

    this.filterColumn();
  }

  destroy() {
    this.synthApi?.destroy();
    this.synthApi = null;
  }

  private setUpSynthApi() {
    this.synthApi = new SynthApi(this.store);
  }

  private createLocalMainContainer() {
    this.localMainContainer.className = "synth-main-container";
    this.content.appendChild(this.localMainContainer);
  }

  private createHeader() {
    const header = document.createElement("div");
    header.className = "synth-header";
    this.content.appendChild(header);
  }

  private createNav() {
    const btns: RadioItems = new Set<RadioItem>();
    const main: RadioItem = { value: "Main", func: () => {} };
    const mixer: RadioItem = { value: "Mixer", func: () => {} };
    btns.add(main);
    btns.add(mixer);
    const nav = new Radio(btns);
    nav.content.classList.add("synth-nav-container");
    this.windowBar.appendChild(nav.content);
  }

  private createOscillatorColumn() {
    this.localMainContainer.appendChild(this.oscillatorColumn);
    this.oscillatorColumn.className = "syth-module-osc-col";
  }

  private filterColumn() {
    const headerFilter = this.createHeaderFilter();
    const filterOverview = this.createFilterOverview();
    const filterParams = this.createFilterParams();

    const filterColumn = document.createElement("div");
    filterColumn.appendChild(headerFilter);
    filterColumn.appendChild(filterOverview);
    filterColumn.appendChild(filterParams);

    filterColumn.className = "synth-module-filter-col";

    this.localMainContainer.appendChild(filterColumn);
  }

  private newRow(osc: Oscillator) {
    const row = document.createElement("div");
    row.id = `${this.oscillatorRowIdIndex}`;
    this.oscillatorRowIdIndex++;
    const oscillator = this.createOscillator(osc);
    const enveloppe = this.createEnveloppe(osc);
    const closeButton = this.createRemoveOscillatorButton(row.id);
    const filterLink = this.createOscillatorParams();

    row.appendChild(closeButton);
    row.appendChild(oscillator);
    row.appendChild(enveloppe);
    row.appendChild(filterLink);

    row.className = "synth-module-osc-row";

    this.oscillatorColumn.appendChild(row);
  }

  private createOscillatorRowButton() {
    const rowButtonContainer = document.createElement("div");
    rowButtonContainer.className = "synth-module-new-row-button-container";

    const button = document.createElement("div");
    button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg>`;
    button.className = "button1";

    button.addEventListener("click", () => this.newRow(defaultOscillator));
    rowButtonContainer.appendChild(button);
    this.oscillatorColumn.appendChild(rowButtonContainer);
  }

  private removeOscillatorRow(id: string) {
    console.log(id);
    this.oscillatorColumn.querySelectorAll(`#${CSS.escape(id)}`).forEach((e) => e.remove());
  }

  private createHeaderFilter(): HTMLDivElement {
    const headerFilter = document.createElement("div");
    headerFilter.className = "synth-module-header-filter";
    const btns: RadioItems = new Set<RadioItem>();
    btns.add({ value: "A", func: () => {} });
    btns.add({ value: "B", func: () => {} });
    const radio = new Radio(btns);
    headerFilter.appendChild(radio.content);
    return headerFilter;
  }

  private createFilterParams(): HTMLDivElement {
    const filterParams = document.createElement("div");
    filterParams.className = "synth-module-filter-params";
    // filterParams.innerText = "filter params";

    const frequency = new Knob((value) => {
      console.log("freq:", value);
    });

    const gain = new Knob((value) => {
      console.log("gain", value);
    });

    const q = new Knob((value) => {
      console.log("q", value);
    });

    // Frequency knob and label
    const freqContainer = document.createElement("div");
    const freqTxt = document.createElement("div");
    freqContainer.className = "filter-param-label";
    freqTxt.innerText = "Freq";
    freqContainer.appendChild(frequency.content);
    freqContainer.appendChild(freqTxt);

    // Gain knob and label
    const gainContainer = document.createElement("div");
    const gainTxt = document.createElement("div");
    gainContainer.className = "filter-param-label";
    gainTxt.innerText = "Gain";
    gainContainer.appendChild(gain.content);
    gainContainer.appendChild(gainTxt);

    // Q knob and label
    const qContainer = document.createElement("div");
    const qTxt = document.createElement("div");
    qContainer.className = "filter-param-label";
    qTxt.innerText = "Q";
    qContainer.appendChild(q.content);
    qContainer.appendChild(qTxt);

    const firstRow = document.createElement("div");
    firstRow.appendChild(freqContainer);
    firstRow.appendChild(gainContainer);
    firstRow.appendChild(qContainer);

    const secRow = document.createElement("div");

    const menuLabel = document.createElement("div");
    menuLabel.innerText = "Type";
    menuLabel.className = "filter-param-label";
    const items: Record<string, string> = {
      lowpass: "Lowpass",
      highpass: "Highpass",
      bandpass: "Bandpass",
      bell: "Bell",
    };

    const type = new Menu(items, () => console.log("menu changed value: ", type.value));

    secRow.appendChild(menuLabel);
    secRow.appendChild(type.content);

    filterParams.appendChild(firstRow);
    filterParams.appendChild(secRow);
    return filterParams;
  }

  private createFilterOverview(): HTMLCanvasElement {
    const filterOverview = new FilterComponent({ frequency: 440, gain: 50, q: 50, type: "bell" });
    return filterOverview.content;
  }

  private createRemoveOscillatorButton(id: string): HTMLDivElement {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "synth-module-remove-oscillator-btn-container";

    const button = document.createElement("div");
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z"/></svg>`;
    button.className = "button1";
    button.addEventListener("click", () => {
      this.removeOscillatorRow(id);
    });
    buttonContainer.appendChild(button);

    return buttonContainer;
  }

  private createOscillator(osc: Oscillator): HTMLDivElement {
    const oscillator = document.createElement("div");
    oscillator.className = "synth-module-osc-container";

    const oscillatorComponent = new OscillatorComponent(osc);
    oscillator.appendChild(oscillatorComponent.content);
    return oscillator;
  }

  private createEnveloppe(osc: Oscillator): HTMLDivElement {
    const enveloppe = document.createElement("div");
    enveloppe.className = "synth-module-env-container";

    const enveloppeComponent = new EnveloppeComponent(osc);
    enveloppe.appendChild(enveloppeComponent.content);
    return enveloppe;
  }

  private createOscillatorParams(): HTMLElement {
    const container = new OscillatorParams();

    return container.content;
  }
}

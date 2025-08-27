import { Module } from "../../core/abstract_classes/module";
import type { ExerciceStore } from "../../core/services/stores/exerciceStore";
import { defaultOscillator } from "../../core/settings/synth";
import type { Bounds } from "../../core/types/modules";
import type { Oscillator, SynthConfig } from "../../core/types/synth";
import { EnveloppeComponent } from "../components/synth/enveloppe/eveloppe";
import { OscillatorComponent } from "../components/synth/oscillator/oscillator";

export class SynthetizerModule extends Module {
  private localMainContainer = document.createElement("div");
  private oscillatorColumn = document.createElement("div");
  private oscillatorRowIdIndex = 0;
  private config: SynthConfig;

  constructor(bounds: Bounds, store: ExerciceStore) {
    super(bounds, store);
    this.config = store.getState("synthConfig") as SynthConfig;
    this.content.style.display = "flex";
    this.content.style.flexDirection = "column";
    this.content.style.height = "100%";
    this.createHeader();
    this.createLocalMainContainer();
    this.createOscillatorColumn();
    this.createOscillatorRowButton();
    for (const osc of this.config.oscillators) {
      this.newRow(osc);
    }
    this.filterColumn();
  }

  private createLocalMainContainer() {
    this.localMainContainer.className = "main-container";
    this.content.appendChild(this.localMainContainer);
    this.localMainContainer.style.flex = "1";
    this.localMainContainer.style.backgroundColor = "yellow";
    this.localMainContainer.style.display = "flex";
    this.localMainContainer.style.overflow = "hidden";
  }

  private createHeader() {
    const header = document.createElement("div");
    header.style.backgroundColor = "green";
    header.style.height = "10%";
    header.style.minHeight = "40px";
    header.style.width = "100%";
    this.content.appendChild(header);
  }

  private createOscillatorColumn() {
    this.localMainContainer.appendChild(this.oscillatorColumn);
    this.oscillatorColumn.style.flex = "1";
    this.oscillatorColumn.className = "oscillator-column";
    this.oscillatorColumn.style.display = "flex";
    this.oscillatorColumn.style.flexDirection = "column";
    this.oscillatorColumn.style.overflowY = "auto";
  }

  private filterColumn() {
    const headerFilter = this.createHeaderFilter();
    const filterOverview = this.createFilterOverview();
    const filterParams = this.createFilterParams();

    const filterColumn = document.createElement("div");
    filterColumn.appendChild(headerFilter);
    filterColumn.appendChild(filterOverview);
    filterColumn.appendChild(filterParams);

    filterColumn.style.height = "100%";
    filterColumn.style.width = "30%";
    filterColumn.style.border = "1px solid black";
    filterColumn.style.boxSizing = "border-box";
    filterColumn.style.display = "flex";
    filterColumn.style.flexDirection = "column";
    filterColumn.style.overflowY = "auto";

    this.localMainContainer.appendChild(filterColumn);
  }

  private newRow(osc: Oscillator) {
    const row = document.createElement("div");
    row.id = `${this.oscillatorRowIdIndex}`;
    this.oscillatorRowIdIndex++;
    const oscillator = this.createOscillator(osc);
    const enveloppe = this.createEnveloppe(osc);
    const closeButton = this.createRemoveOscillatorButton(row.id);
    const filterLink = this.createFilterLink();

    row.appendChild(closeButton);
    row.appendChild(oscillator);
    row.appendChild(enveloppe);
    row.appendChild(filterLink);

    row.style.width = "100%";
    row.style.border = "1px solid black";
    row.style.boxSizing = "border-box";
    row.style.display = "flex";
    row.style.minHeight = "100px";
    this.oscillatorColumn.appendChild(row);
  }

  private createOscillatorRowButton() {
    const rowButtonContainer = document.createElement("div");
    rowButtonContainer.style.display = "flex";
    rowButtonContainer.style.alignItems = "center";
    rowButtonContainer.style.justifyContent = "center";
    rowButtonContainer.style.order = "999";
    rowButtonContainer.style.padding = "20px";

    const button = document.createElement("button");
    button.innerText = "+";

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
    headerFilter.innerText = "header filter";
    headerFilter.style.border = "1px solid black";
    headerFilter.style.boxSizing = "border-box";
    headerFilter.style.height = "15%";
    headerFilter.style.minHeight = "40px";
    return headerFilter;
  }

  private createFilterParams(): HTMLDivElement {
    const filterParams = document.createElement("div");
    filterParams.innerText = "filter params";
    filterParams.style.border = "1px solid black";
    filterParams.style.boxSizing = "border-box";
    filterParams.style.flex = "1";
    filterParams.style.minHeight = "100px";
    return filterParams;
  }

  private createFilterOverview(): HTMLDivElement {
    const filterOverview = document.createElement("div");
    filterOverview.innerText = "filter overview";
    filterOverview.style.border = "1px solid black";
    filterOverview.style.boxSizing = "border-box";
    filterOverview.style.flex = "1";
    filterOverview.style.minHeight = "100px";
    return filterOverview;
  }

  private createRemoveOscillatorButton(id: string): HTMLDivElement {
    const buttonContainer = document.createElement("div");

    buttonContainer.style.height = "100%";
    buttonContainer.style.width = "50px";
    buttonContainer.style.display = "flex";
    buttonContainer.style.alignItems = "center";
    buttonContainer.style.justifyContent = "center";

    const button = document.createElement("button");
    button.innerText = "-";
    button.addEventListener("click", () => {
      this.removeOscillatorRow(id);
    });
    buttonContainer.appendChild(button);

    return buttonContainer;
  }

  private createOscillator(osc: Oscillator): HTMLDivElement {
    const oscillator = document.createElement("div");
    oscillator.style.border = "1px solid black";
    oscillator.style.boxSizing = "border-box";
    oscillator.style.flex = "1";

    const oscillatorComponent = new OscillatorComponent(osc);
    oscillator.appendChild(oscillatorComponent.content);
    return oscillator;
  }

  private createEnveloppe(osc: Oscillator): HTMLDivElement {
    const enveloppe = document.createElement("div");
    enveloppe.style.border = "1px solid black";
    enveloppe.style.boxSizing = "border-box";
    enveloppe.style.flex = "1";

    const enveloppeComponent = new EnveloppeComponent(osc);
    enveloppe.appendChild(enveloppeComponent.content);
    return enveloppe;
  }

  private createFilterLink(): HTMLDivElement {
    const container = document.createElement("div");

    container.style.height = "100%";
    container.style.width = "50px";

    container.innerText = "links";

    return container;
  }
}

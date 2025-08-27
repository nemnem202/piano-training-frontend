import { Module } from "../../core/abstract_classes/module";
import type { ExerciceStore } from "../../core/services/stores/exerciceStore";
import type { Bounds } from "../../core/types/modules";

export class SynthetizerModule extends Module {
  localMainContainer = document.createElement("div");

  constructor(bounds: Bounds, store: ExerciceStore) {
    super(bounds, store);
    this.content.style.display = "flex";
    this.content.style.flexDirection = "column";
    this.createHeader();
    this.createLocalMainContainer();
    this.newRow();
    this.filterColumn();
  }

  private createLocalMainContainer() {
    this.localMainContainer.className = "main-container";
    this.content.appendChild(this.localMainContainer);
    this.localMainContainer.style.flex = "1";
    this.localMainContainer.style.backgroundColor = "yellow";
    this.localMainContainer.style.display = "flex";
  }

  private createHeader() {
    const header = document.createElement("div");
    header.style.backgroundColor = "green";
    header.style.height = "10%";
    header.style.minHeight = "40px";
    header.style.width = "100%";
    this.content.appendChild(header);
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

  private newRow() {
    const oscillator = this.createOscillator();
    const enveloppe = this.createEnveloppe();

    const row = document.createElement("div");
    row.appendChild(oscillator);
    row.appendChild(enveloppe);

    row.style.flex = "1";
    row.style.border = "1px solid black";
    row.style.boxSizing = "border-box";
    row.style.display = "flex";
    row.style.maxHeight = "150px";
    this.localMainContainer.appendChild(row);
  }

  private removeRow(id: string) {}

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

  private createOscillator(): HTMLDivElement {
    const oscillator = document.createElement("div");
    oscillator.innerText = "oscillator";
    oscillator.style.border = "1px solid black";
    oscillator.style.boxSizing = "border-box";
    oscillator.style.flex = "1";
    return oscillator;
  }

  private createEnveloppe(): HTMLDivElement {
    const enveloppe = document.createElement("div");
    enveloppe.innerText = "enveloppe";
    enveloppe.style.border = "1px solid black";
    enveloppe.style.boxSizing = "border-box";
    enveloppe.style.flex = "1";
    return enveloppe;
  }
}

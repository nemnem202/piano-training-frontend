import { Component } from "../../common/abstracts/base_component";
import { Knob } from "../buttons/knob/knob";

export class OscillatorParams extends Component {
  volume: number = 50;
  pan: number = 50;

  constructor() {
    super("div", "");
    this.content.className = "oscillator-params-container";
    this.addVolumeContainer();
    this.addPanContainer();
    this.addPhaseContainer();
    this.addFilterContainer();
  }

  private addVolumeContainer() {
    const volumeContainer = document.createElement("div");
    volumeContainer.className = "oscillator-param-item";
    const knob = new Knob((value: number) => {
      this.volume = value;
      console.log("new volume: ", this.volume);
    });

    const volume = document.createElement("div");
    volume.className = "oscillator-param-text";
    volume.innerText = "Volume";

    volumeContainer.appendChild(volume);
    volumeContainer.appendChild(knob.content);

    this.content.appendChild(volumeContainer);
  }

  private addPanContainer() {
    const panContainer = document.createElement("div");
    panContainer.className = "oscillator-param-item";
    const knob = new Knob((value: number) => {
      this.volume = value;
      console.log("new volume: ", this.volume);
    });

    const pan = document.createElement("div");
    pan.className = "oscillator-param-text";
    pan.innerText = "Pan";

    panContainer.appendChild(pan);
    panContainer.appendChild(knob.content);

    this.content.appendChild(panContainer);
  }

  private addPhaseContainer() {
    const phaseContainer = document.createElement("div");
    phaseContainer.className = "oscillator-param-item";
    const knob = new Knob((value: number) => {
      this.volume = value;
      console.log("new volume: ", this.volume);
    });

    const phase = document.createElement("div");
    phase.className = "oscillator-param-text";
    phase.innerText = "Phase";

    phaseContainer.appendChild(phase);
    phaseContainer.appendChild(knob.content);

    this.content.appendChild(phaseContainer);
  }

  private addFilterContainer() {
    const filterContainer = document.createElement("div");
    filterContainer.className = "oscillator-param-item";

    const btn_a = document.createElement("div");
    const btn_b = document.createElement("div");
    btn_a.innerText = "A";
    btn_b.innerText = "B";

    btn_a.className = btn_b.className = "button1";

    const btnContainer = document.createElement("duv");
    btnContainer.className = "oscillator-param-item";
    btnContainer.appendChild(btn_a);
    btnContainer.appendChild(btn_b);

    const filters = document.createElement("div");
    filters.className = "oscillator-param-text";
    filters.innerText = "Filters";

    filterContainer.appendChild(filters);
    filterContainer.appendChild(btnContainer);

    this.content.appendChild(filterContainer);

    btn_a.addEventListener("click", () => {
      if (btn_a.classList.contains("selected")) {
        btn_a.classList.remove("selected");
      } else {
        btn_a.classList.add("selected");
      }
    });
    btn_b.addEventListener("click", () => {
      if (btn_b.classList.contains("selected")) {
        btn_b.classList.remove("selected");
      } else {
        btn_b.classList.add("selected");
      }
    });
  }
}

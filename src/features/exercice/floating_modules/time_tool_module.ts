import { FloatingModule } from "../../../common/abstracts/base_floating_module";
import type { Bounds, ModuleDTO } from "../../../common/types/floating_module";
import type { ExerciceStore } from "../../../core/state_management/exercice_state_store";

export class TimeTool extends FloatingModule {
  constructor(bounds: Bounds, store: ExerciceStore) {
    super(bounds, store);

    this.content.className = "time-tool-container";
  }

  start(): void {}

  destroy(): void {}

  export_configuration(): ModuleDTO {
    const converted_bounds = this.convertBounds(this.bounds);

    return {
      type: "TimeTool",
      params: {
        bounds: converted_bounds,
      },
    };
  }
}

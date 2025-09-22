import { FloatingModule } from "../../../common/abstracts/base_floating_module";
import type { ModuleDTO } from "../../../common/types/floating_module";

export class ChordNames extends FloatingModule {
  destroy(): void {}
  start(): void {}
  export_configuration(): ModuleDTO {
    return {
      params: { bounds: { height: 100, width: 100, x: 0, y: 0 } },
      type: "ChordNames",
    };
  }
}

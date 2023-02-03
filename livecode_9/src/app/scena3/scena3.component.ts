import { Component } from "@angular/core";
import {
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  HemisphereLightHelper,
} from "three";
import { CoreComponent } from "src/app/core/core.component";

@Component({
  selector: "app-scena3",
  templateUrl: "./scena3.component.html",
})
export class Scena3Component extends CoreComponent {
  override executeScena() {
    //hemispherelight
    var emisphereLight = new HemisphereLight(0x87ceeb, 0xffd700, 5);

    emisphereLight.position.set(0, 50, 0);

    this.scena.add(new HemisphereLightHelper(emisphereLight, 50));

    this.scena.add(emisphereLight);
  }
}

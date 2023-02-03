import { Component } from "@angular/core";
import {
  AmbientLight,
  Mesh,
  MeshPhysicalMaterial,
  RectAreaLight,
  SpotLight,
  SpotLightHelper,
  Vector2,
} from "three";
import { CoreComponent } from "src/app/core/core.component";

@Component({
  selector: "app-scena6",
  templateUrl: "./scena6.component.html",
})
export class Scena6Component extends CoreComponent {
  override executeScena() {
    var spotLight = new SpotLight("white", 50000);

    spotLight.position.set(0, 150, 100);
    spotLight.shadow.mapSize = new Vector2(2048, 2048);
    spotLight.castShadow = true;

    this.scena.add(new SpotLightHelper(spotLight));

    this.scena.add(spotLight);
  }
}

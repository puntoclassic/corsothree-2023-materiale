import { Component } from "@angular/core";
import {
  AmbientLight,
  Mesh,
  MeshPhysicalMaterial,
  RectAreaLight,
  SpotLight,
  SpotLightHelper,
} from "three";
import { CoreComponent } from "src/app/core/core.component";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";

@Component({
  selector: "app-scena6",
  templateUrl: "./scena6.component.html",
})
export class Scena6Component extends CoreComponent {
  override executeScena() {
    var spotLight = new SpotLight("white", 3500);

    spotLight.position.set(0, 100, 100);

    this.scena.add(new SpotLightHelper(spotLight));

    this.scena.add(spotLight);
  }
}

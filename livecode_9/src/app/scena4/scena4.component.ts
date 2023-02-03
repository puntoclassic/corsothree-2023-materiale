import { Component } from "@angular/core";
import {
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  HemisphereLightHelper,
  PointLight,
  PointLightHelper,
} from "three";
import { CoreComponent } from "src/app/core/core.component";

@Component({
  selector: "app-scena4",
  templateUrl: "./scena4.component.html",
})
export class Scena4Component extends CoreComponent {
  override executeScena() {
    var pointLight = new PointLight("red", 2000);
    var pointLightHelper = new PointLightHelper(pointLight, 5);

    pointLight.position.set(0, 50, 0);

    this.scena.add(pointLight);
    this.scena.add(pointLightHelper);
  }
}

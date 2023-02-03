import { Component } from "@angular/core";
import { PointLight, PointLightHelper } from "three";
import { CoreComponent } from "src/app/core/core.component";

@Component({
  selector: "app-scena4",
  templateUrl: "./scena4.component.html",
})
export class Scena4Component extends CoreComponent {
  override executeScena() {
    var pointLight = new PointLight("red", 20000);
    var pointLightHelper = new PointLightHelper(pointLight, 5);

    pointLight.castShadow = true;

    pointLight.position.set(0, 50, 50);

    this.scena.add(pointLight);
    this.scena.add(pointLightHelper);
  }
}

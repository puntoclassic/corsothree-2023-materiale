import { Component } from "@angular/core";
import { AmbientLight, DirectionalLight, DirectionalLightHelper } from "three";
import { CoreComponent } from "src/app/core/core.component";

@Component({
  selector: "app-scena2",
  templateUrl: "./scena2.component.html",
})
export class Scena2Component extends CoreComponent {
  override executeScena() {
    //directional light
    var directionalLight = new DirectionalLight("white", 5);
    directionalLight.position.set(50, 50, 0);
    this.scena.add(new DirectionalLightHelper(directionalLight, 5, "white"));
    this.scena.add(directionalLight);
  }
}

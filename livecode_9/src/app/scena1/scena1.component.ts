import { Component } from "@angular/core";
import { AmbientLight, DirectionalLight, DirectionalLightHelper } from "three";
import { CoreComponent } from "src/app/core/core.component";

@Component({
  selector: "app-scena1",
  templateUrl: "./scena1.component.html",
})
export class Scena1Component extends CoreComponent {
  override executeScena() {
    var ambientLight = new AmbientLight("white", 5);

    //ambient light
    this.scena.add(ambientLight);
  }
}

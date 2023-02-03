import { Component } from "@angular/core";
import { AmbientLight, Mesh, MeshPhysicalMaterial, RectAreaLight } from "three";
import { CoreComponent } from "src/app/core/core.component";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";

@Component({
  selector: "app-scena5",
  templateUrl: "./scena5.component.html",
})
export class Scena5Component extends CoreComponent {
  override baseScena(): void {
    super.baseScena();

    //se si decommenta questo la luce funziona ma non si vede il pannello nel caso vogliamo questo effetto
    RectAreaLightUniformsLib.init();
  }

  override executeScena() {
    var cubo = this.scena.getObjectByName("cubo");
    var piano = this.scena.getObjectByName("piano");

    if (cubo instanceof Mesh) {
      cubo.material = new MeshPhysicalMaterial({
        color: "gray",
        roughness: 0,
        reflectivity: 1,
      });
    }

    if (piano instanceof Mesh) {
      piano.material = new MeshPhysicalMaterial({
        color: "white",
        roughness: 0,
        reflectivity: 1,
      });
    }

    var rectAreaLightRed = new RectAreaLight("red", 10, 20, 20);
    var rectAreaLightBlue = new RectAreaLight("blue", 10, 20, 20);
    var rectAreaLightGreen = new RectAreaLight("green", 10, 20, 20);

    rectAreaLightRed.position.set(0, 25, 50);
    rectAreaLightBlue.position.set(25, 25, 50);
    rectAreaLightGreen.position.set(-25, 25, 50);

    this.scena.add(rectAreaLightRed);
    this.scena.add(rectAreaLightBlue);
    this.scena.add(rectAreaLightGreen);
    this.scena.add(new RectAreaLightHelper(rectAreaLightRed));
    this.scena.add(new RectAreaLightHelper(rectAreaLightBlue));
    this.scena.add(new RectAreaLightHelper(rectAreaLightGreen));
    // this.scena.add(new AmbientLight("white", 0.5));
  }
}

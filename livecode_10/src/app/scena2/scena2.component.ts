import { Component } from "@angular/core";
import {
  AmbientLight,
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
} from "three";
import { CoreComponent } from "src/app/core/core.component";

@Component({
  selector: "app-scena2",
  templateUrl: "./scena2.component.html",
})
export class Scena2Component extends CoreComponent {
  override executeScena() {
    //directional light
    var directionalLight = new DirectionalLight("white", 5);
    directionalLight.position.set(100, 100, 25);

    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.left = 100;
    directionalLight.shadow.camera.right = -100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.far = 200;

    const helper = new CameraHelper(directionalLight.shadow.camera);
    this.scena.add(helper);

    this.scena.add(new DirectionalLightHelper(directionalLight, 10, "white"));
    this.scena.add(directionalLight);
  }
}

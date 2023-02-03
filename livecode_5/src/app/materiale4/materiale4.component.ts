import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from "@angular/core";
import { CoreComponent } from "src/app/core/core.component";
import {
  ACESFilmicToneMapping,
  AxesHelper,
  BoxGeometry,
  EquirectangularReflectionMapping,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  PointLightHelper,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-materiale4",
  templateUrl: "./materiale4.component.html",
})
export class Materiale4Component extends CoreComponent {
  override executeScena(): void {
    //Aggiungo un piano
    var piano = new PlaneGeometry(30, 10, 1, 1);
    var piano2 = new PlaneGeometry(30, 30);

    var scena = this.scena;

    this.cameraDefault?.position.set(0, 10, 30);

    new RGBELoader().load(
      "/assets/forgotten_miniland_1k.hdr",
      function (mapLoaded) {
        mapLoaded.mapping = EquirectangularReflectionMapping;

        scena.environment = mapLoaded;
        // scena.background = mapLoaded;
      },
    );

    var materiale4 = new MeshStandardMaterial({
      color: "white",
      roughness: 0,
      metalness: 0.7,
    });

    var materiale5 = new MeshStandardMaterial({
      color: "white",
      roughness: 0,
      metalness: 0.5,
    });

    var mesh = new Mesh(piano, materiale4);

    var mesh2 = new Mesh(
      piano2,
      materiale5,
    );

    var mesh3 = new Mesh(
      new BoxGeometry(5, 5, 5),
      new MeshStandardMaterial({ color: "blue" }),
    );

    mesh.position.set(0, 5, 0);
    mesh2.rotation.x = -MathUtils.degToRad(90);
    mesh2.position.set(0, 0, 15);
    mesh3.position.set(0, 5, 5);

    //aggiungo la mesh alla scena
    scena.add(mesh);
    scena.add(mesh2);
    scena.add(mesh3);

    scena.add(new AxesHelper(20));

    //Aggiungo una luce alla scena
    var pointLight = new PointLight("white", 1);
    pointLight.position.set(0, 0, 100);
    this.scena.add(new PointLightHelper(pointLight));
    this.scena.add(pointLight);
  }
}

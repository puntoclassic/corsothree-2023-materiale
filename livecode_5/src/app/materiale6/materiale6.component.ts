import { Component, OnInit } from "@angular/core";
import { CoreComponent } from "src/app/core/core.component";
import {
  AmbientLight,
  BoxGeometry,
  Color,
  CubeReflectionMapping,
  CubeTextureLoader,
  EquirectangularReflectionMapping,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  PointLight,
  PointLightHelper,
} from "three";

import { Easing, Tween } from "@tweenjs/tween.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-materiale6",
  templateUrl: "./materiale6.component.html",
})
export class Materiale6Component extends CoreComponent {
  override executeScena(): void {
    var scena = this.scena;

    scena.background = new Color(0x444444);

    this.cameraDefault?.position.set(0, 10, 20);
    this.cameraDefault!.near = 5;
    this.cameraDefault?.updateProjectionMatrix();

    //Aggiungo un piano
    var cube = new BoxGeometry(10, 10, 10);

    var materiale1 = new MeshDepthMaterial();

    var mesh = new Mesh(cube, materiale1);

    new Tween({ r: 0 }).to({ r: 365 }).duration(1000 * 10).onUpdate((v) => {
      mesh.rotation.set(
        MathUtils.degToRad(v.r),
        MathUtils.degToRad(v.r),
        MathUtils.degToRad(v.r),
      );
    }).repeat(Infinity).start();

    scena.add(new AmbientLight("white", 5));

    scena.add(mesh);
  }
}

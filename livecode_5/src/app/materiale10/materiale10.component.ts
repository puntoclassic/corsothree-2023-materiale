import { Component } from "@angular/core";
import { CoreComponent } from "src/app/core/core.component";
import {
  AmbientLight,
  BoxGeometry,
  Color,
  CubeReflectionMapping,
  CubeTextureLoader,
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshToonMaterial,
  PointLight,
  PointLightHelper,
  SphereGeometry,
  SpotLight,
  SpotLightHelper,
} from "three";

import { Tween } from "@tweenjs/tween.js";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-materiale10",
  templateUrl: "./materiale10.component.html",
})
export class Materiale10Component extends CoreComponent {
  override executeScena(): void {
    var scena = this.scena;

    scena.background = new Color(0x444444);

    //Aggiungo un piano
    var cube = new BoxGeometry(10, 10, 10);

    var sfera = new SphereGeometry(5);

    var materiale1 = new MeshPhysicalMaterial({
      color: "white",

      metalness: 0,
      roughness: 0,
      transmission: 1,
      opacity: 1,
      transparent: true,
      ior: 2,
      specularIntensity: 1,
      specularColor: new Color("white"),
      envMapIntensity: 1,
    });

    materiale1.thickness = 0.01;

    var mesh = new Mesh(cube, materiale1);

    var spotLight = new SpotLight("white", 15, 50);
    spotLight.position.set(0, 20, 10);

    scena.add(spotLight);
    scena.add(mesh);

    new Tween({ r: 0 }).to({ r: 365 }).duration(1000 * 10).onUpdate((v) => {
      mesh.rotation.set(
        0,
        MathUtils.degToRad(v.r),
        0,
      );
    }).repeat(Infinity).start();

    new CubeTextureLoader().setPath("/assets/cubemaps/").load([
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png",
    ], function (mapLoaded) {
      mapLoaded.mapping = CubeReflectionMapping;

      scena.environment = mapLoaded;
      scena.background = mapLoaded;
    });
  }
}

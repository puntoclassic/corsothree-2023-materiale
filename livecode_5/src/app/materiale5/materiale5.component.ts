import { Component, OnInit } from "@angular/core";
import { CoreComponent } from "src/app/core/core.component";
import {
  AmbientLight,
  BoxGeometry,
  CubeReflectionMapping,
  CubeTextureLoader,
  EquirectangularReflectionMapping,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PointLight,
} from "three";

import { Easing, Tween } from "@tweenjs/tween.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-materiale5",
  templateUrl: "./materiale5.component.html",
})
export class Materiale5Component extends CoreComponent {
  override executeScena(): void {
    var scena = this.scena;

    new CubeTextureLoader().setPath("/assets/cubemaps/").load([
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png",
    ], function (mapLoaded) {
      mapLoaded.mapping = CubeReflectionMapping;

      //Aggiungo un piano
      var cube = new BoxGeometry(10, 10, 10);

      //imposo un materiale di colore blu
      var materiale1 = new MeshLambertMaterial({
        color: "blue",
        reflectivity: 1,
        envMap: mapLoaded,
      });

      var mesh = new Mesh(cube, materiale1);

      new Tween({ r: 0 }).to({ r: 365 }).duration(1000 * 10).onUpdate((v) => {
        mesh.rotation.set(
          MathUtils.degToRad(v.r),
          MathUtils.degToRad(v.r),
          MathUtils.degToRad(v.r),
        );
      }).repeat(Infinity).start();

      scena.add(mesh);

      scena.environment = mapLoaded;
      scena.background = mapLoaded;
    });

    this.scena.add(new AmbientLight("white"));
  }
}

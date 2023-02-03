import { Component } from "@angular/core";
import { CoreComponent } from "src/app/core/core.component";
import {
  AmbientLight,
  BoxGeometry,
  Color,
  MathUtils,
  Mesh,
  MeshPhongMaterial,
  MeshToonMaterial,
  PointLight,
} from "three";

import { Tween } from "@tweenjs/tween.js";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-materiale9",
  templateUrl: "./materiale9.component.html",
})
export class Materiale9Component extends CoreComponent {
  override executeScena(): void {
    var scena = this.scena;

    scena.background = new Color(0x444444);

    //Aggiungo un piano
    var cube = new BoxGeometry(10, 10, 10);

    var materiale1 = new MeshToonMaterial({
      color: "red",
    });

    var mesh = new Mesh(cube, materiale1);

    new Tween({ r: 0 }).to({ r: 365 }).duration(1000 * 10).onUpdate((v) => {
      mesh.rotation.set(
        MathUtils.degToRad(v.r),
        MathUtils.degToRad(v.r),
        MathUtils.degToRad(v.r),
      );
    }).repeat(Infinity).start();

    var pointLight = new PointLight("white", 1);
    pointLight.position.set(0, 5, 5);

    scena.add(pointLight);

    scena.add(mesh);
  }
}

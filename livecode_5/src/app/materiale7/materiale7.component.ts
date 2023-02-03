import { Component } from "@angular/core";
import { CoreComponent } from "src/app/core/core.component";
import {
  AmbientLight,
  BoxGeometry,
  Color,
  MathUtils,
  Mesh,
  MeshNormalMaterial,
} from "three";

import { Tween } from "@tweenjs/tween.js";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-materiale7",
  templateUrl: "./materiale7.component.html",
})
export class Materiale7Component extends CoreComponent {
  override executeScena(): void {
    var scena = this.scena;

    scena.background = new Color(0x444444);

    //Aggiungo un piano
    var cube = new BoxGeometry(10, 10, 10);

    var materiale1 = new MeshNormalMaterial();

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

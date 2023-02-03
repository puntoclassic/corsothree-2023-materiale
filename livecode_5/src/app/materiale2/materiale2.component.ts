import { Component } from "@angular/core";
import {
  LoadingManager,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  TextureLoader,
} from "three";
import { CoreComponent } from "src/app/core/core.component";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-materiale2",
  templateUrl: "./materiale2.component.html",
})
export class Materiale2Component extends CoreComponent {
  override executeScena() {
    //Aggiungo un cubo
    var piano = new PlaneGeometry(50, 50, 2048, 2048);

    var textureLoader = new TextureLoader();

    // usa una texture come alpha
    var texture = textureLoader.load("/assets/foglia.png");
    texture.flipY = true;

    var materiale2 = new MeshBasicMaterial({
      color: "green",
      alphaTest: 1,
      alphaMap: texture,
    });

    var mesh = new Mesh(piano, materiale2);

    //aggiungo la mesh alla scena
    this.scena.add(mesh);
  }
}

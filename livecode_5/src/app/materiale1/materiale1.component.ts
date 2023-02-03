import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from "@angular/core";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BackSide,
  BoxGeometry,
  Color,
  DoubleSide,
  FrontSide,
  ImageLoader,
  ImageUtils,
  LoadingManager,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PointLight,
  PointLightHelper,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  Side,
  Texture,
  TextureLoader,
  ToneMapping,
  Vector3,
  WebGLRenderer,
  Wrapping,
} from "three";
import { Easing, Tween } from "@tweenjs/tween.js";
import { CoreComponent } from "src/app/core/core.component";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-materiale1",
  templateUrl: "./materiale1.component.html",
})
export class Materiale1Component extends CoreComponent {
  override executeScena() {
    //Aggiungo un piano
    var cube = new BoxGeometry(10, 10, 10);

    //imposo un materiale di colore blu
    var materiale1 = new MeshBasicMaterial({
      color: "blue",
      name: "coloreBlu",
      opacity: 1,
      transparent: true,
    });

    var mesh = new Mesh(cube, materiale1);

    //aggiungo la mesh alla scena
    this.scena.add(mesh);
  }
}

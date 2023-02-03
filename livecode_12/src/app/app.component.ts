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
  BoxGeometry,
  Color,
  DoubleSide,
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
  Texture,
  TextureLoader,
  ToneMapping,
  Vector3,
  WebGLRenderer,
  Wrapping,
} from "three";
import { Easing, Tween } from "@tweenjs/tween.js";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
}

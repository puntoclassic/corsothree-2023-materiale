import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  AxesHelper,
  BoxGeometry,
  CameraHelper,
  Color,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { Easing, Tween } from "@tweenjs/tween.js";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = "livecode_2";

  @HostBinding("style")
  classes = "display:flex;flex-grow:1";

  @ViewChild("containermio")
  container?: ElementRef;

  scena: Scene = new Scene();
  pointX = 1;
  cubo1?: Mesh;

  cameraDefault?: PerspectiveCamera;
  renderer = new WebGLRenderer({});

  constructor() {
  }

  aggiungiCubo(
    name: string,
    width: number,
    height: number,
    depth: number,
    colore: string,
  ) {
    var cubo = new BoxGeometry(width, height, depth);
    var coloreVerde = new MeshBasicMaterial({
      color: colore,
    });

    var meshCubo = new Mesh(cubo, coloreVerde);
    meshCubo.position.setX(this.pointX);
    meshCubo.name = name;

    if (name == "Cubo1") {
      this.cubo1 = meshCubo;
    }

    this.pointX += 10;

    this.scena.add(meshCubo);
  }

  aggiungiSfera(raggio: number, colore: string) {
    var sfera = new SphereGeometry(raggio);
    var coloreVerde = new MeshBasicMaterial({
      color: colore,
    });

    var meshSfera = new Mesh(sfera, coloreVerde);
    meshSfera.position.setX(this.pointX);

    this.pointX += 10;

    this.scena.add(meshSfera);
  }

  creaTelecamera() {
    this.cameraDefault = new PerspectiveCamera(
      75,
      this.container?.nativeElement.clientWidth /
        this.container?.nativeElement.clientHeight,
      0.1,
      1000,
    );

    const helper = new CameraHelper(this.cameraDefault);
    this.scena.add(helper);

    this.cameraDefault.position.z = 10;
    this.cameraDefault.position.y = 10;
    this.cameraDefault.position.x = 30;
    this.cameraDefault.up.set(0, 0, 1);
    this.cameraDefault.updateProjectionMatrix();
    this.cameraDefault.lookAt(new Vector3(0, 0, 0));
  }

  ngOnInit(): void {
    //definizione della scena
    this.aggiungiCubo("Cubo3", 5, 10, 5, "blue");
    //this.aggiungiCubo("Cubo1", 5, 5, 5, "red");
    //this.aggiungiCubo("Cubo2", 5, 5, 5, "green");
    //this.aggiungiSfera(1, "purple");

    var piano = new PlaneGeometry(20, 20, 30);

    var mesh = new Mesh(
      piano,
      new MeshBasicMaterial({
        color: "gray",
      }),
    );

    mesh.position.setZ(-5);

    this.scena.add(
      mesh,
    );

    this.creaTelecamera();
  }

  renderizzaScena() {
    this.scena.background = new Color("white");

    var cubo1 = this.scena.getObjectByName("Cubo1");

    if (cubo1) {
      this.scena.remove(cubo1);
    }

    this.renderer.setSize(
      this.container?.nativeElement.clientWidth,
      this.container?.nativeElement.clientHeight,
    );

    this.container?.nativeElement.appendChild(this.renderer.domElement);
  }

  @HostListener("window:resize")
  onWindowResize() {
    if (this.container && this.cameraDefault) {
      this.renderer.setSize(
        this.container?.nativeElement.clientWidth,
        this.container?.nativeElement.clientHeight,
      );

      this.cameraDefault.aspect = this.container.nativeElement.clientWidth /
        this.container.nativeElement.clientHeight;
      this.renderer.setSize(
        this.container?.nativeElement.clientWidth,
        this.container?.nativeElement.clientHeight,
      );
      this.cameraDefault.updateProjectionMatrix();
    }
  }

  play() {
    requestAnimationFrame(this.play.bind(this));

    if (this.renderer && this.cameraDefault) {
      //cubo?.rotateZ(0.001);

      TWEEN.update();

      this.renderer.render(this.scena, this.cameraDefault);
    }
  }

  ngAfterViewInit(): void {
    //INTERAZIONE CON CANVAS

    this.creaTelecamera();
    this.renderizzaScena();
    this.play();

    const axesHelper = new AxesHelper(30);
    this.scena.add(axesHelper);

    var cubo = this.scena.getObjectByName("Cubo3");

    var animazione1 = new Tween({ z: 0, x: 0 }).to(
      { z: 360, x: 100 },
      1000 * 60,
    )
      .onUpdate(
        (item) => {
          cubo?.position.set(item.x, 0, 0);
          cubo?.rotation.set(0, 0, MathUtils.degToRad(item.z));
        },
      ).onComplete(() => {
        if (cubo) this.scena.remove(cubo);
      });

    animazione1.start();

    //RUOTARE MEZZO SECONDO DI 90
    setInterval(() => {
      cubo?.rotateX(MathUtils.degToRad(90));
    }, 500);

    //FILTRA PER TIPO DI GEOMETRA
    var numeroCubi = this.scena.children.filter((f: any) =>
      f.geometry.type == "BoxGeometry"
    );

    //SPOSTA LA TELECAMERA ogni secondo di 1 radiante
    setInterval(() => {
      this.cameraDefault?.position.setZ(this.cameraDefault?.position.z + 1);
    }, 1000);

    //CERCA TUTTI GLI OGGETTI CHE IL SUO NOME INIZIA CON CUBO
    var cubi = this.scena.children.filter((f: any) => {
      return f.name.startsWith("Cubo");
    });

    //GUARDA UN OGGETTO DIVERSO OGNI 2 SECONDI
    setInterval(() => {
      this.cameraDefault?.lookAt(cubi.shift()!.position);

      if (cubi.length == 0) {
        cubi = this.scena.children.filter((f: any) => {
          return f.name.startsWith("Cubo");
        });
      }
    }, 2000);

    console.log(this.cameraDefault);
  }
}

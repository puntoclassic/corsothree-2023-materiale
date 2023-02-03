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
  Fog,
  ImageLoader,
  ImageUtils,
  LoadingManager,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-core",
  templateUrl: "./core.component.html",
})
export class CoreComponent implements AfterViewInit {
  title = "livecode_10";

  //riferimento al div che contiene il canvas
  @ViewChild("canvascontainer")
  container?: ElementRef<HTMLDivElement>;

  //riferimento al canvas stesso
  @ViewChild("canvas")
  canvas?: ElementRef<HTMLCanvasElement>;

  //oggetto scena vuota
  scena: Scene = new Scene();

  //camera di default
  cameraDefault?: PerspectiveCamera;

  //renderer di partenza
  renderer = new WebGLRenderer({});

  currentBuffer?: string;

  orbiControl?: OrbitControls;

  //crea un immagine della schermata attuale e lo trasformare in buffer data
  makeScreenshot() {
    this.currentBuffer = this.renderer.domElement.toDataURL();
  }

  //preleva il buffer memorizzato su current buffer, se c'è
  //crea un link che permette il download
  //simula il click
  downloadScreenshot() {
    if (this.currentBuffer) {
      var a = document.createElement("a");
      a.href = this.currentBuffer?.replace("image/png", "image/octet-stream");
      a.download = "screen.png";
      a.click();
    }
  }

  /**
   * Visto che in più punti abbiamo la necessità di accedere alla larghezza/altezza
   * creaimo delle funzioni che ci permettano di ottenere lo stesso valore inteso come
   * metodo con cui la otteniamo
   */
  //ottengo il width dal container
  getWidth() {
    if (this.container) {
      return this.container!.nativeElement.clientWidth;
    }
    return 0;
  }

  //ottengo height dal container
  getHeight() {
    if (this.container) {
      return this.container!.nativeElement.clientHeight;
    }
    return 0;
  }

  //mi metto in ascolto dell'evento windows resize
  @HostListener("window:resize")
  onWindowResize() {
    //se container e camera non sono null
    if (this.container && this.cameraDefault) {
      //imposta la dimensione del renderer
      this.renderer.setSize(
        this.getWidth(),
        this.getHeight(),
      );

      //imposta l'aspetto della telecamera sulla base della nuova dimensione
      this.cameraDefault.aspect = this.getWidth() /
        this.getHeight();

      //aggiorna la matrice di proiezione
      this.cameraDefault.updateProjectionMatrix();
    }
  }

  baseScena() {
    var plane = new PlaneGeometry(500, 500);
    var planeMaterial = new MeshPhongMaterial({
      color: "white",
    });
    var meshPlane = new Mesh(plane, planeMaterial);
    meshPlane.name = "piano";
    meshPlane.rotation.set(-MathUtils.degToRad(90), 0, 0);
    meshPlane.receiveShadow = true;
    this.scena.add(meshPlane);

    var cube = new BoxGeometry(25, 25, 25);
    var cubeMaterial = new MeshPhongMaterial({
      color: "gray",
    });
    var meshCube = new Mesh(cube, cubeMaterial);
    meshCube.name = "cubo";
    meshCube.position.set(0, 12.5, 0);
    meshCube.castShadow = true;

    this.scena.add(meshCube);
  }

  executeScena() {
  }

  ngAfterViewInit(): void {
    //creo al telecamera di default
    this.cameraDefault = new PerspectiveCamera(
      75,
      this.getWidth() /
        this.getHeight(),
      0.1,
      1000,
    );

    //imposto dei valori per vedere il cubo leggermente dall'alto e in prospettiva
    this.cameraDefault.position.z = 60;
    this.cameraDefault.position.y = 40;
    this.cameraDefault.position.x = 0;

    //aggiorno la matrice di proiezione
    this.cameraDefault.updateProjectionMatrix();

    //imposto la telecamera in modo che il suo obbiettivo inquadri il centro della scena
    this.cameraDefault.lookAt(new Vector3(0, 0, 0));

    this.baseScena();

    this.executeScena();

    //avvio il renderer
    this.play();

    if (this.container) {
      /**
       * rispetto alla precedente lezione
       * dove abbiamo detto che appendiamo il domElement generato
       * da ora in poi useremo un nostro canvas.
       */

      this.renderer = new WebGLRenderer({
        antialias: true, //ci permette di attivare l'antialising sulla scena
        canvas: this.canvas!.nativeElement, //quale canvas deve usare
        alpha: false, // il fondo diventa trasparente
        preserveDrawingBuffer: true,
      });

      this.renderer.physicallyCorrectLights = true;

      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = PCFShadowMap;

      /**
       * Permette di specificare quale mappatura colori usare
       * per simulare HDR. Di default è su NoToneMapping.
       * Quindi non viene applicato nessun ToneMapping.
       * Si rivela utile modificare questo valore quando
       * si usano texture ambientali o se si usano texture prese
       * da un contesto reale. Edifici, mappe, ecc...
       */
      this.renderer.toneMapping = ACESFilmicToneMapping;

      //Permette di specificare il livello di esposizione.
      this.renderer.toneMappingExposure = 1;

      //permette di creare un piano di taglio
      /*this.renderer.clippingPlanes = [
        new Plane(new Vector3(10, 10, 10)),
      ];*/

      //il pixel ratio ci permette di evitare la sfocatura del canvas su schermi retina e simili
      this.renderer.setPixelRatio(window.devicePixelRatio);

      //diamo la dimensione di partenza del renderer
      this.renderer.setSize(
        this.getWidth(),
        this.getHeight(),
      );

      this.orbiControl = new OrbitControls(
        this.cameraDefault,
        this.container.nativeElement,
      );

      this.orbiControl.enableDamping = true;
    }
  }

  /**
   * Play viene eseguito ad ogni frame.
   */
  play() {
    requestAnimationFrame(this.play.bind(this));

    //se il renderer non è null e nemmeno da telecamera
    if (this.renderer && this.cameraDefault) {
      //aggiorna lo stato delle animazioni
      TWEEN.update();

      //renderizza un frame usando la scena e la camera passata come valori
      this.renderer.render(this.scena, this.cameraDefault);

      this.orbiControl?.update();
    }
  }
}

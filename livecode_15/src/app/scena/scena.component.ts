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
  AnimationMixer,
  BoxGeometry,
  Clock,
  Color,
  DataTexture,
  DoubleSide,
  EquirectangularReflectionMapping,
  EquirectangularRefractionMapping,
  Fog,
  Group,
  ImageLoader,
  ImageUtils,
  Intersection,
  LoadingManager,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PointLight,
  Raycaster,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SpotLight,
  SpotLightHelper,
  Sprite,
  SpriteMaterial,
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
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-scena",
  templateUrl: "./scena.component.html",
})
export class ScenaComponent implements AfterViewInit {
  title = "livecode_15";

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

  mixer?: AnimationMixer;

  clock?: Clock;

  rayCaster?: Raycaster = new Raycaster();
  currenMousePos?: { x: number; y: number };

  intersects: Intersection<Object3D<Event>>[] | undefined = [];

  sprites: Group = new Group();

  currentClickedName = "Nessun elemento cliccato";
  currentHoverName = "Nessuno";
  materialHoverEnabled = true;
  gruppoCloni = new Group();

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

  @HostListener("pointermove", ["$event"])
  onMouseMove(event: any) {
    var mouse = {
      x: 0,
      y: 0,
    };

    var rect = this.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    var mat = new MeshPhongMaterial({
      opacity: 0.5,
      transparent: true,
      color: new Color("yellow"),
    });

    if (this.cameraDefault) {
      this.rayCaster?.setFromCamera(mouse, this.cameraDefault);

      this.intersects = this.rayCaster?.intersectObjects(
        this.scena.children,
      );

      this.scena.traverse((obj) => {
        if (obj.userData["originalMat"]) {
          if (obj instanceof Mesh) {
            obj.material = obj.userData["originalMat"];
          }
        }
        if (obj instanceof Sprite) {
          obj.material.opacity = 0.7;
        }
      });

      if (this.intersects && this.intersects.length > 0) {
        this.currentHoverName = this.intersects[0].object.name;

        if (this.materialHoverEnabled) {
          var object = this.intersects[0].object;
          if (object instanceof Mesh) {
            object.userData = {
              ...object.userData,
              originalMat: object.material,
            };

            object.material = mat;
          }

          if (object instanceof Sprite) {
            object.material.opacity = 1;
          }
        }
      } else {
        this.currentHoverName = "Nessuno";
      }
    }
  }

  @HostListener("click", ["$event"])
  onClick(event: any) {
    const mouse = {
      x: 0,
      y: 0,
    };

    var rect = this.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    if (this.cameraDefault) {
      this.rayCaster?.setFromCamera(mouse, this.cameraDefault);

      this.intersects = this.rayCaster?.intersectObjects(
        this.scena.children,
      );

      if (this.intersects && this.intersects.length > 0) {
        this.currentClickedName = this.intersects[0].object.name;
      }
    }
  }

  baseScena() {
    this.scena.background = new Color("white");
    this.scena.add(new AmbientLight("white", 1));
    var gltfLoader = new GLTFLoader();

    var sMaterialBtnInfo = new SpriteMaterial({
      map: new TextureLoader().load("/assets/Cute_ball_info.png"),
      opacity: 0.7,
    });

    this.sprites.position.set(0, 0, 0);
    this.scena.add(this.sprites);

    gltfLoader.load("/assets/objects/scenabaked.gltf", (gltf) => {
      gltf.scene.traverse((obj) => {
        if (obj.name.startsWith("BTN_")) {
          var sprite = new Sprite(sMaterialBtnInfo);

          // sprite.scale.set(0.5, 0.5, 0.5);
          sprite.name = "Spite Info";

          sprite.position.copy(obj.position);

          this.sprites.add(sprite);
        }
      });

      this.scena.add(gltf.scene);
      console.log(this.scena);
    });
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
    this.cameraDefault.position.z = 7;
    this.cameraDefault.position.y = 3;
    this.cameraDefault.position.x = 0;

    //aggiorno la matrice di proiezione
    this.cameraDefault.updateProjectionMatrix();

    //imposto la telecamera in modo che il suo obbiettivo inquadri il centro della scena
    this.cameraDefault.lookAt(new Vector3(0, 0, 0));

    this.baseScena();

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

      this.clock = new Clock();

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
      this.orbiControl.maxDistance = 10;
      this.orbiControl.minDistance = 5;
      this.orbiControl.maxPolarAngle = 1.5;
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

      /*this.sprites.traverse((sprite) => {
        var parametro = this.sprites.position.distanceTo(
          this.cameraDefault!.position,
        ) ; //da sistemare
        sprite.scale.set(parametro, parametro, parametro);
      });*/

      this.orbiControl?.update();

      if (this.clock) {
        this.mixer?.update(this.clock.getDelta());
      }
    }
  }
}

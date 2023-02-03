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
  AxesHelper,
  BoxGeometry,
  Color,
  DoubleSide,
  Light,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PointLight,
  Scene,
  ShaderMaterial,
  Side,
  ToneMapping,
  Vector3,
  WebGLRenderer,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewInit {
  title = "livecode_4";

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

  orbitControl?: OrbitControls;

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

  ngAfterViewInit(): void {
    //creo al telecamera di default
    this.cameraDefault = new PerspectiveCamera(
      75,
      this.getWidth() /
        this.getHeight(),
      0.01,
      1000,
    );

    //imposto dei valori per vedere il cubo leggermente dall'alto e in prospettiva
    this.cameraDefault.position.z = 10;
    this.cameraDefault.position.y = 10;
    this.cameraDefault.position.x = 10;

    //aggiorno la matrice di proiezione
    this.cameraDefault.updateProjectionMatrix();

    //imposto la telecamera in modo che il suo obbiettivo inquadri il centro della scena
    this.cameraDefault.lookAt(new Vector3(0, 0, 0));

    var piano = new PlaneGeometry(1500, 1500);

    var materialePiano = new MeshPhongMaterial({
      color: "blue",
      side: DoubleSide,
      reflectivity: 1,
    });

    var mesh = new Mesh(piano, materialePiano);
    mesh.rotation.set(-MathUtils.degToRad(90), 0, 0);

    var mesh2 = new Mesh(
      new BoxGeometry(5, 5, 5),
      new MeshPhongMaterial({
        color: "white",
      }),
    );

    mesh2.position.set(0, 2.5, 0);

    //aggiungo la mesh alla scena
    this.scena.add(mesh);
    this.scena.add(mesh2);
    this.scena.add(new AxesHelper(5));
    this.scena.add(new AmbientLight("white", 1));

    this.orbitControl = new OrbitControls(
      this.cameraDefault,
      this.container?.nativeElement,
    );

    this.orbitControl.enableDamping = true;
    this.orbitControl.dampingFactor = 0.1;
    this.orbitControl.maxPolarAngle = 1.5;
    this.orbitControl.minDistance = 10;
    this.orbitControl.maxDistance = 20;

    this.orbitControl.update();

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
        preserveDrawingBuffer: true, //essenziale per fare screen
      });

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

      //abbio il renderer
      this.play();
    }
  }

  /**
   * Play viene eseguito ad ogni frame.
   */
  play() {
    requestAnimationFrame(this.play.bind(this));

    //se il renderer non è null e nemmeno da telecamera
    if (this.renderer && this.cameraDefault) {
      //renderizza un frame usando la scena e la camera passata come valori
      this.renderer.render(this.scena, this.cameraDefault);

      this.orbitControl?.update();
    }
  }
}

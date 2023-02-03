import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from "@angular/core";
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Plane,
  Scene,
  ToneMapping,
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
export class AppComponent implements AfterViewInit {
  title = "livecode_3";

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
    //imposto il fondo su bianco
    this.scena.background = new Color("white");

    //creo al telecamera di default
    this.cameraDefault = new PerspectiveCamera(
      75,
      this.getWidth() /
        this.getHeight(),
      0.1,
      1000,
    );

    //imposto dei valori per vedere il cubo leggermente dall'alto e in prospettiva
    this.cameraDefault.position.z = 20;
    this.cameraDefault.position.y = 1;
    this.cameraDefault.position.x = 20;

    //imposto gli assi in modo che l'asse il terzo valore del vettore 3 sia l'asse z.
    this.cameraDefault.up.set(0, 0, 1);

    //aggiorno la matrice di proiezione
    this.cameraDefault.updateProjectionMatrix();

    //imposto la telecamera in modo che il suo obbiettivo inquadri il centro della scena
    this.cameraDefault.lookAt(new Vector3(0, 0, 0));

    //abbio il renderer
    this.play();

    //Aggiungo un cubo
    var cubo = new BoxGeometry(5, 5, 5);
    var cubo2 = new BoxGeometry(5, 5, 5);

    //imposo un materiale di colore grigio
    var materialeCubo = new MeshBasicMaterial({
      color: "grey",
    });

    var materialeCubo2 = new MeshBasicMaterial({
      color: "green",
    });

    //creo una mesh che abbia come geometria il cubo come materiale il materiale creato nella
    //riga precedente
    var mesh = new Mesh(cubo, materialeCubo);
    var mesh2 = new Mesh(cubo2, materialeCubo2);
    mesh2.position.setZ(5);

    var group1 = new Group();
    group1.position.setY(4);
    group1.add(mesh);
    group1.add(mesh2);

    this.scena.add(group1);

    //aggiungo la mesh alla scena
    // this.scena.add(mesh);
    // this.scena.add(mesh2);

    /**
     * Creo una animazione che faccia ruotare il cubo di 360
     * all'infinito.
     * r: 0 , r: 360 indica da rotazione 0 a rotazione 360
     * duration: quanto tempo deve impiegare per andare da 0 360, maggiore è
     * il tempo minore sarà la velocità di rotazione.
     * repeat: Infinity -> l'animazione deve essere infinita.
     * onUpdate: ad ogni cambio del valore viene invocata questa callback.
     * al suo interno modifichiamo il valore z della mesh del cubo
     * start: indichiamo che l'animazione deve partire subito
     */
    new Tween({ r: 0 })
      .to({ r: 360 })
      .duration(5000)
      .repeat(Infinity)
      .onUpdate((value) => {
        group1.rotation.set(0, 0, MathUtils.degToRad(value.r));
        // mesh2.rotation.set(0, 0, MathUtils.degToRad(value.r));
      }).start();

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
    }
  }
}

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
  Clock,
  Color,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  ToneMapping,
  UniformsLib,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { Easing, Tween } from "@tweenjs/tween.js";

const TWEEN = require("@tweenjs/tween.js");

@Component({
  selector: "app-cubo-con-bordi",
  templateUrl: "./cubo-con-bordi.component.html",
  styleUrls: ["./cubo-con-bordi.component.css"],
})
export class CuboConBordiComponent implements AfterViewInit {
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
    this.cameraDefault.position.z = 10;
    this.cameraDefault.position.y = 5;
    this.cameraDefault.position.x = 5;

    //imposto gli assi in modo che l'asse il terzo valore del vettore 3 sia l'asse z.
    this.cameraDefault.up.set(0, 0, 1);

    //aggiorno la matrice di proiezione
    this.cameraDefault.updateProjectionMatrix();

    //imposto la telecamera in modo che il suo obbiettivo inquadri il centro della scena
    this.cameraDefault.lookAt(new Vector3(0, 0, 0));

    //abbio il renderer
    this.play();

    //shader per il calcolo dei vertici
    var vertexShader = `
     varying vec2 vUv;
     void main()	{
       vUv = uv;
       gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1);
     }
   `;

    //shader per il calcolo delle superfici
    var fragmentShader = `
     //#extension GL_OES_standard_derivatives : enable

     varying vec2 vUv;
     uniform float thickness;
     uniform vec3 color;

     float edgeFactor(vec2 p){
       vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
       return min(grid.x, grid.y);
     }

     void main() {

       float a = clamp(edgeFactor(vUv), 0., 1.);

       vec3 c = mix(vec3(0), color, a);

       gl_FragColor = vec4(c, 1);
     }
   `;

    //Aggiungo un cubo
    var cubo = new BoxGeometry(5, 5, 5);
    var piano = new PlaneGeometry(100, 100, 512, 512);

    //imposo un materiale di colore grigio
    var materialeCubo = new ShaderMaterial({
      uniforms: { //oggetto univorms permette di passare dei parametri al codice c
        thickness: {
          value: 0.5,
        },
        color: {
          value: new Color("green"),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      vertexColors: true,
    });

    //creo una mesh che abbia come geometria il cubo come materiale il materiale creato nella
    //riga precedente
    var mesh = new Mesh(cubo, materialeCubo);

    //aggiungo la mesh alla scena
    this.scena.add(mesh);

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
        mesh.rotation.set(0, 0, MathUtils.degToRad(value.r));
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
        preserveDrawingBuffer: true,
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

  clock = new Clock();

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

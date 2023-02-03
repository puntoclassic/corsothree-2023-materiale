import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from "@angular/core";
import {
  ACESFilmicToneMapping,
  AxesHelper,
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
  selector: "app-mare-fasullo",
  templateUrl: "./mare-fasullo.component.html",
})
export class MareFasulloComponent implements AfterViewInit {
  title = "livecode_7";

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

  materialePiano: ShaderMaterial = new ShaderMaterial({
    vertexShader: `
    #include <fog_pars_vertex>

    uniform float uTime;

    uniform float uBigWavesElevation;
    uniform vec2 uBigWavesFrequency;
    uniform float uBigWaveSpeed;

    uniform  float uSmallWavesElevation;
    uniform  float uSmallWavesFrequency;
    uniform  float uSmallWavesSpeed;
    uniform float uSmallWavesIterations;

    varying float vElevation;

    //	Classic Perlin 3D Noise
    //	by Stefan Gustavson
    //
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float cnoise(vec3 P){
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.zz, Pi1.zz);
      vec4 iz0 = Pi0.yyyy;
      vec4 iz1 = Pi1.yyyy;

      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);

      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);

      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);

      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.z,gz0.z);
      vec3 g010 = vec3(gx0.z,gy0.y,gz0.y);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.z,gz1.z);
      vec3 g011 = vec3(gx1.z,gy1.y,gz1.y);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;

      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);

      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
      return 2.2 * n_xyz;
    }

    void main() {
      #include <begin_vertex>
      #include <project_vertex>
      #include <fog_vertex>
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      float elevation =
        sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWaveSpeed)
        * sin(modelPosition.y * uBigWavesFrequency.y + uTime * uBigWaveSpeed)
        * uBigWavesElevation;

      for(float i = 1.0; i <= 10.0; i++) {

        elevation -= abs(
          cnoise(
            vec3(modelPosition.xy * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)
            )
            * uSmallWavesElevation / i
          );
         if(i >= uSmallWavesIterations ) {
          break;
        }
      }

      modelPosition.x += elevation;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;

      vElevation = elevation;
    }`,
    fragmentShader: `
    #include <fog_pars_fragment>
precision mediump float;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main() {
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  gl_FragColor = vec4(color, 1.0);
   #include <fog_fragment>
}`,
    transparent: true,
    fog: true,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new Vector2() },
      uBigWavesElevation: { value: 0.2 },
      uBigWavesFrequency: { value: new Vector2(4, 2) },
      uBigWaveSpeed: { value: 0.75 },
      // Small Waves
      uSmallWavesElevation: { value: 0.15 },
      uSmallWavesFrequency: { value: 3 },
      uSmallWavesSpeed: { value: 0.2 },
      uSmallWavesIterations: { value: 4 },
      // Color
      uDepthColor: { value: new Color("#1e4d40") },
      uSurfaceColor: { value: new Color("#4d9aaa") },
      uColorOffset: { value: 0.08 },
      uColorMultiplier: { value: 5 },

      // Fog, contains fogColor, fogDensity, fogFar and fogNear
      ...UniformsLib["fog"],
    },
  });

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

    //avvio il renderer
    this.play();

    //Aggiungo un cubo
    var piano = new PlaneGeometry(40, 40, 512, 512);

    //creo una mesh che abbia come geometria il cubo come materiale il materiale creato nella
    //riga precedente
    var mesh2 = new Mesh(
      piano,
      this.materialePiano,
    );

    this.scena.add(mesh2);
    this.scena.add(new AxesHelper(5));

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

      if (this.materialePiano) {
        this.materialePiano.uniforms["uTime"].value = this.clock
          .getElapsedTime();
      }

      //renderizza un frame usando la scena e la camera passata come valori
      this.renderer.render(this.scena, this.cameraDefault);
    }
  }
}

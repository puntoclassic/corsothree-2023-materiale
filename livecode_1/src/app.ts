import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  WebGLRenderer,
} from "three";
import { Scene } from "three/src/scenes/Scene";

//Vogliamo che il codice che venga eseguito una volta che il dom è stato caricato
(function () {
  const canvas = document.querySelector("canvas#miocanvas");

  //Creazione dell'oggetto Scena
  var scena: Scene = new Scene();

  /**
   * Ogni oggetto su Three è una Mesh.
   * Una mesh è formata da una geometria + materiale
   */

  //Una geometria definisce la forma di una mesh
  const cuboGeometry: BoxGeometry = new BoxGeometry(1, 1, 1, 5, 5, 5);

  //Creo un instanza di un materiale
  /**
   * COSA FA: Crea un instanza del materiale
   * Il colore può essere assegnato usando
   * un nome html standard
   * un codice esadecimale che deve iniziare con 0x#######
   * un codice esadecimale dentro stringhe
   * un instanza della classe Color
   * Mesh basic non è l'unico tipo di materiale in questo esempio useremo questo
   */
  const cuboMaterial: MeshBasicMaterial = new MeshBasicMaterial({
    color: "blue",
  });

  //Creazione della mesh
  const cuboMesh = new Mesh(cuboGeometry, cuboMaterial);

  //Aggiunta della mesh alla scena
  scena.add(cuboMesh);

  /**
   * Aggiungiamo una telecamera alla scena
   * Il primo parametro è la profondità di campo di default è 50, metto 75 perché voglio avere un campo leggeremente più largo
   *
   * Il secondo parametro è il rapporto, potremmo mettere un valore fisso ma vogliamo vedere l'immagine in base alle dimensioni del nostro schermo. In applicazioni ThreeJs dove il canvas non è a tutta pagina è più corretto prendere le dimensioni del canvas.
   * Gli altri due parametri definiscono il limite vicino e il limite lontano della nostra inquadratura. Ciò che è dentro questi limiti lo vediamo, il resto viene tagliato dalla scena.
   */
  const camera: PerspectiveCamera = new PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  );
  camera.position.z = 3;
  scena.add(camera);

  /**
   * A questo punto trasformiamo ciò che abbiamo prodotto in Threejs
   * in Webgl. Per farlo usiamo un Renderer adatto
   */
  const renderer: WebGLRenderer = new WebGLRenderer({
    canvas: canvas,
  });

  //impostiamo le dimensioni del renderer
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  //abbiamo il render dandogli input la scena che vogliamo renderizzare e quale camera usare
  renderer.render(scena, camera);
})();

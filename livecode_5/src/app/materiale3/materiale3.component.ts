import { Component } from "@angular/core";
import { CoreComponent } from "src/app/core/core.component";
import {
  AmbientLight,
  AxesHelper,
  CameraHelper,
  Color,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  PointLight,
  PointLightHelper,
  RepeatWrapping,
  Texture,
  TextureLoader,
  Vector2,
} from "three";

@Component({
  selector: "app-materiale3",
  templateUrl: "./materiale3.component.html",
})
export class Materiale3Component extends CoreComponent {
  override executeScena() {
    //Aggiungo un piano
    var piano = new PlaneGeometry(30, 30, 2048, 2048);

    this.cameraDefault?.position.set(0, -15, 5);
    this.cameraDefault?.rotation.set(1, 0, 0);

    var textureLoader = new TextureLoader();

    var textureH = textureLoader.load(
      "/assets/japanese_stone_wall_diff_1k.jpg",
    );
    var aoTexture = textureLoader.load(
      "/assets/japanese_stone_wall_ao_1k.jpg",
    );
    var bumpTexture = textureLoader.load(
      "/assets/japanese_stone_wall_disp_1k.jpg",
    );
    var dispTexture = textureLoader.load(
      "/assets/japanese_stone_wall_disp_1k.jpg",
    );
    var mapTexture = textureLoader.load(
      "/assets/japanese_stone_wall_nor_dx_1k.jpg",
    );

    function applyRepeatParams(texture: Texture) {
      texture.repeat.set(6, 6);
      texture.wrapS = texture.wrapT = RepeatWrapping;
    }

    applyRepeatParams(textureH);
    applyRepeatParams(aoTexture);
    applyRepeatParams(bumpTexture);
    applyRepeatParams(dispTexture);
    applyRepeatParams(mapTexture);

    var materiale3 = new MeshStandardMaterial({
      aoMap: aoTexture,
      map: textureH,
      bumpMap: bumpTexture,
      bumpScale: 0.1,
      normalMap: mapTexture,
      normalScale: new Vector2(0.1, 0.1),
      emissive: new Color("green"),
      emissiveIntensity: 0.05,
    });

    var materiale2 = new MeshStandardMaterial({
      color: "blue",
    });

    /**
     * displacementMap: dispTexture,
      displacementScale: 0.1,
     */

    //Aggiungo una luce alla scena
    var pointLight = new PointLight("white", 1);
    pointLight.position.set(0, 0, 5);
    this.scena.add(new PointLightHelper(pointLight));
    this.scena.add(pointLight);

    //this.scena.add(new AmbientLight("light", 1));

    var mesh = new Mesh(piano, materiale3);

    //aggiungo la mesh alla scena
    this.scena.add(mesh);
    this.scena.add(new AxesHelper(10));
    if (this.cameraDefault) {
      // this.scena.add(new CameraHelper(this.cameraDefault));
    }
  }
}

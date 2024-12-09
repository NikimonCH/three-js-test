import * as THREE from "three";
// import HeroController from "./heroController";
import CubeController from "./cubeController";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import tween from "@tweenjs/tween.js";

export default class TestController {
  scene = new THREE.Scene();
  camera = this.initCamera();
  renderer = new THREE.WebGLRenderer({ alpha: true });
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  orbit = new OrbitControls(this.camera, this.renderer.domElement);
  INTERSECTED: any;
  target!: HTMLElement;
  // hero: HeroController;
  cubeController!: CubeController;

  constructor(target: HTMLElement | string) {
    this.init(target);
  }

  init(target: HTMLElement | string) {
    this.initRenderer(target);
    this.addBackground(
      "https://avatars.mds.yandex.net/i?id=a13298979a99b0d332837c64fde7393c_l-4885380-images-thumbs&n=13"
    );
    this.initLight(-10, 20, 40);
    this.initOrbitController();
    this.cubeController = new CubeController(this, { x: 3, y: 4, z: 3 }, 1);
    // this.scene.add(new THREE.AxesHelper(50));
    this.initEventListeners();
  }
  initCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 13);
    camera.lookAt(0, 0, 0);
    return camera;
  }
  initRenderer(target: HTMLElement | string) {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop((time) => {
      console.log(time);
      this.animate(time);
    });
    if (typeof target === "string") {
      const node = document.getElementById(target);
      if (!node) throw new Error("Target not found");
      target = node;
    }
    this.target = target;
    target.appendChild(this.renderer.domElement);
  }
  initLight(x: number, y: number, z: number) {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    this.scene.add(light);
  }

  initOrbitController() {
    this.orbit.enableDamping = true;
    this.orbit.dampingFactor = 0.25;
    this.orbit.rotateSpeed = 0.35;
    this.orbit.minZoom = 1;
  }
  initEventListeners() {
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("click", this.onMouseClick.bind(this));
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    // window.addEventListener("mouseup", this.onMouseUp.bind(this));
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }
  addBackground(url: string) {
    this.scene.background = new THREE.TextureLoader().load(url);
  }

  calcMouse(event: MouseEvent) {
    this.mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  }
  onMouseMove(event: MouseEvent) {
    event.preventDefault();
    this.calcMouse(event);
    this.cubeController.onMouseMove();
  }

  onMouseClick(event: MouseEvent) {
    event.preventDefault();
    this.calcMouse(event);
    this.cubeController.onMouseClick();
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.calcMouse(event);
    this.cubeController.onMouseDown();
  }

  // onMouseUp(event: MouseEvent) {}

  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate(time: number) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.cubeController.animate();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.target.removeChild(this.renderer.domElement);
    this.renderer.dispose();
    this.cubeController.dispose();
  }
}

// import { strict } from "assert";
// import * as THREE from "three";
// import TestController from "./controller";

// export default class HeroController {
//   mouse: THREE.Vector2;
//   geometry: THREE.BoxGeometry;
//   material: THREE.MeshBasicMaterial | THREE.MeshPhongMaterial;
//   cube: THREE.Mesh;
//   INTERSECTED: any;
//   timer: number = 0;
//   rotationX: number = 0.002;
//   rotationY: number = 0.002;
//   raycaster: THREE.Raycaster;
//   camera: THREE.PerspectiveCamera;

//   constructor(target: TestController, raycaster: THREE.Raycaster) {
//     this.raycaster = raycaster;
//     this.camera = target.getCamera();

//     this.mouse = new THREE.Vector2();
//     this.geometry = new THREE.BoxGeometry(2, 1, 0.1);
//     const texture = new THREE.TextureLoader().load(
//       "https://avatars.mds.yandex.net/i?id=149c150564bc4b774c67e5739fcec93a_sr-8252971-images-thumbs&n=13"
//     );
//     this.material = new THREE.MeshBasicMaterial({
//       map: texture,
//     });
//     this.cube = new THREE.Mesh(this.geometry, this.material);
//     target.scene.add(this.cube);

//     window.addEventListener("mouseover", this.onMouseOver);

//     // window.requestAnimationFrame(this.animate);
//   }

//   onMouseOver(event: any) {
//     event.preventDefault();

//     this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   }

//   animate() {
//     this.cube.rotation.x += this.rotationX;
//     this.cube.rotation.y += this.rotationY;

//     this.raycaster.setFromCamera(this.mouse, this.camera);

//     const intersects = this.raycaster.intersectObjects(this.scene.children);

//     if (intersects.length > 0) {
//       // const targetDistance = intersects[0].distance;
//       intersects[0].object.material.color.set(Math.random() * 0xffffff);
//     }
//   }

//   dispose() {
//     this.cube.geometry.dispose();
//     this.renderer.dispose();
//   }
// }

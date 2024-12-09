import * as THREE from "three";
// import * as Tween from "@tweenjs/tween.js";
import TestController from "./controller";
import { TransformControls } from "three/addons/controls/TransformControls.js";

const notClickedColor = new THREE.Color("black");
const notClickedColor1 = [new THREE.Color("green"), new THREE.Color("#651C32")];
// const notClickedColor2 = new THREE.Color("#651C32");
const hoveredColor = new THREE.Color("white");
const hasHoveredColor = new THREE.Color("blue");
const clickedColor = new THREE.Color("violet");
const unClickedColor = new THREE.Color("yellow");

export default class CubeController {
  parentController: TestController;
  cubes: THREE.Mesh[] = [];
  basicCubeSize: number;
  fakeCube!: THREE.Mesh;
  fakeCubePos = new THREE.Vector3();
  myTransformControls!: TransformControls;
  gizmo: any;
  isDragging: boolean = false;
  selectedCube: THREE.Object3D[] = [];
  INTERSECTED: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[] =
    [];

  constructor(
    target: TestController,
    axes: { x: number; y: number; z: number } = { x: 3, y: 3, z: 3 },
    cubeSize: number = 1
  ) {
    this.parentController = target;
    this.basicCubeSize = cubeSize;
    this.initCubes({ x: axes.x, y: axes.y, z: axes.z });
    this.initFakeCube();
    this.initMyTransformControls();
  }

  initCubes(axes: { x: number; y: number; z: number }) {
    // let counter: number = 1;
    const addCube = (x: number, y: number, z: number) => {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(
          this.basicCubeSize,
          this.basicCubeSize,
          this.basicCubeSize
        ),
        new THREE.MeshBasicMaterial({ color: notClickedColor })
      );
      cube.position.set(x * 2, y * 2, z * 2);
      cube.name = "cube";
      this.cubes.push(cube);
    };
    const offsetX = 0.5 * (1 - axes.x) * this.basicCubeSize;
    const offsetY = 0.5 * (1 - axes.y) * this.basicCubeSize;
    const offsetZ = 0.5 * (1 - axes.z) * this.basicCubeSize;
    for (
      let x = offsetX;
      x < axes.x * this.basicCubeSize + offsetX;
      x += this.basicCubeSize
    )
      for (
        let y = offsetY;
        y < axes.y * this.basicCubeSize + offsetY;
        y += this.basicCubeSize
      )
        for (
          let z = offsetZ;
          z < axes.z * this.basicCubeSize + offsetZ;
          z += this.basicCubeSize
        ) {
          addCube(x, y, z);
        }
    this.parentController.scene.add(...this.cubes);
  }
  initFakeCube() {
    this.fakeCube = new THREE.Mesh(
      new THREE.BoxGeometry(
        this.basicCubeSize * 1.01,
        this.basicCubeSize * 1.01,
        this.basicCubeSize * 1.01
      ),
      new THREE.MeshPhongMaterial({
        color: "black",
        opacity: 0.5,
        transparent: true,
      })
    );
  }
  initMyTransformControls() {
    this.myTransformControls = new TransformControls(
      this.parentController.camera,
      this.parentController.renderer.domElement
    );
    this.gizmo = this.myTransformControls.getHelper();
    this.myTransformControls.enabled = false;
    this.myTransformControls.addEventListener("dragging-changed", (event) => {
      this.parentController.orbit.enabled = !event.value;
    });
  }
  calcIntersections(exception: string[] = ["default"]) {
    const intersects = this.parentController.raycaster.intersectObjects(
      this.parentController.scene.children
    );
    if (exception[0] === "default") return intersects;
    else {
      let newIntersects: THREE.Intersection<
        THREE.Object3D<THREE.Object3DEventMap>
      >[] = [];
      exception.forEach((value) => {
        newIntersects = newIntersects.concat(
          intersects.filter((filt) => {
            return filt.object.name !== value;
          })
        );
      });
      return newIntersects;
    }
  }

  enableFakeCube() {
    this.isDragging = true;
    this.fakeCube.position.copy(this.selectedCube[0].position);
    this.fakeCubePos.copy(this.selectedCube[0].position);
    this.parentController.scene.add(this.fakeCube);
  }
  moveFakeCube() {
    const fx = this.fakeCube.position.x - this.selectedCube[0].position.x;
    const fy = this.fakeCube.position.y - this.selectedCube[0].position.y;
    const fz = this.fakeCube.position.z - this.selectedCube[0].position.z;
    // const fx = this.fakeCubePos.x - this.selectedCube[0].position.x;
    // const fy = this.fakeCubePos.y - this.selectedCube[0].position.y;
    // const fz = this.fakeCubePos.z - this.selectedCube[0].position.z;
    const newpos = [fx, fy, fz].map(
      (value) => Math.round(-value) * this.basicCubeSize
    );
    // console.log("%cPos", "color: #26bfa5;", {
    //   fx,
    //   newpos,
    //   dif: this.fakeCube.position.x - this.selectedCube[0].position.x,
    // });
    this.fakeCube.position.add(new THREE.Vector3(...newpos));
    // const animation = new Tween.Tween(this.fakeCubePos)
    //   .to(this.fakeCube.position.clone().add(new THREE.Vector3(...newpos)), 200)
    //   .easing(Tween.Easing.Quadratic.InOut)
    //   .start();
    // function animate(time: number) {
    //   animation.update(time);
    //   requestAnimationFrame(animate);
    // }
    // requestAnimationFrame(animate);
  }
  moveSelectedCube() {
    this.selectedCube[0].position.copy(this.fakeCube.position);
  }
  disableFakeCube() {
    this.isDragging = false;
    this.parentController.scene.remove(this.fakeCube);
    this.moveSelectedCube();
  }

  enableTransformControls(selectedCube: THREE.Object3D) {
    this.selectedCube = [selectedCube];
    this.myTransformControls.attach(selectedCube);
    this.myTransformControls.enabled = true;
    this.parentController.scene.add(this.gizmo);
  }
  disableTransformControls() {
    this.selectedCube = [];
    this.myTransformControls.detach();
    this.myTransformControls.enabled = false;
    this.parentController.scene.remove(this.gizmo);
  }
  isTransformControls(
    value: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]
  ) {
    return (
      value.length > 0 &&
      (value[0].object.name === "X" ||
        value[0].object.name === "Y" ||
        value[0].object.name === "Z" ||
        value[0].object.name === "XY" ||
        value[0].object.name === "XZ" ||
        value[0].object.name === "YZ" ||
        value[0].object.name === "XYZ" ||
        value[0].object.name === "AXIS" ||
        value[0].object.name === "DELTA")
    );
  }

  isValidCube(
    target: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]
  ) {
    return !(target.length == 0 || target[0].object.name != "cube");
  }
  hasHoveredCube() {
    if (this.INTERSECTED.length != 0) {
      this.INTERSECTED[0].object.material.color.set(hasHoveredColor);
      this.INTERSECTED.pop();
    }
  }
  isHasClickedCube(
    target: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]
  ) {
    return (
      target[0].object.material.color.equals(clickedColor) ||
      target[0].object.material.color.equals(unClickedColor)
    );
  }
  isHasHoveredCube(
    target: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]
  ) {
    if (
      this.INTERSECTED.length != 0 &&
      this.INTERSECTED[0].object != target[0].object
    ) {
      this.INTERSECTED[0].object.material.color.set(hasHoveredColor);
      this.INTERSECTED.pop();
    }
  }
  hoverCube(
    target: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]
  ) {
    if (this.INTERSECTED.length === 0) {
      target[0].object.material.color.set(hoveredColor);
      this.INTERSECTED.push(target[0]);
    }
  }
  clickCube(
    targetedCube: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>
  ) {
    if (targetedCube.object.material.color.equals(clickedColor)) {
      targetedCube.object.material.color.set(unClickedColor);
      this.disableTransformControls();
      this.INTERSECTED.splice(0, this.INTERSECTED.length);
    } else {
      targetedCube.object.material.color.set(clickedColor);
      this.enableTransformControls(targetedCube.object);
      this.INTERSECTED.splice(0, this.INTERSECTED.length);
    }
  }

  onMouseMove() {
    const intersect = this.calcIntersections();
    if (this.isDragging) {
      this.moveFakeCube();
      return false;
    }
    if (this.myTransformControls.enabled === true) return false;
    if (!this.isValidCube(intersect)) {
      this.hasHoveredCube();
      return false;
    }
    if (this.isHasClickedCube(intersect)) return false;
    this.isHasHoveredCube(intersect);
    this.hoverCube(intersect);
    return true;
  }

  onMouseDown() {
    const intersects = this.calcIntersections(["cube"]);
    if (this.isTransformControls(intersects)) {
      this.enableFakeCube();
    }
  }

  onMouseClick() {
    const intersects = this.calcIntersections();
    if (this.isDragging) {
      this.disableFakeCube();
      return false;
    }
    if (!this.isValidCube(intersects)) {
      this.disableTransformControls();
      return false;
    }
    if (this.myTransformControls.enabled === true) return false;
    if (intersects.length != 0) this.clickCube(intersects[0]);
  }

  animate() {}

  dispose() {
    this.cubes.map((e) => {
      e.geometry.dispose();
    });
  }
}

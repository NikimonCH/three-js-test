"use client";
import TestController from "./threejs/controller";
import { useEffect } from "react";

export default function Home() {
  let controller: TestController;
  useEffect(() => {
    controller = new TestController("test");
    return () => {
      controller.dispose();
    };
  });
  return <div id="test"></div>;
}

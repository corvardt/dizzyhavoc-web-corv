// islands/ThreeJsAnimation.tsx
import { useEffect, useRef } from "preact/hooks";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165/build/three.module.js";
import { AsciiEffect } from "https://cdn.jsdelivr.net/npm/three@0.165/examples/jsm/effects/AsciiEffect.js";

export function Animation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let camera, scene, renderer, effect;
      let sphere, plane;
      const start = Date.now();

      init();

      function init() {
        camera = new THREE.PerspectiveCamera(
          70,
          window.innerWidth / window.innerHeight,
          1,
          1000
        );
        camera.position.y = 150;
        camera.position.z = 500;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0, 0, 0);

        const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
        pointLight1.position.set(500, 500, 500);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
        pointLight2.position.set(-500, -500, -500);
        scene.add(pointLight2);

        sphere = new THREE.Mesh(
          new THREE.SphereGeometry(200, 20, 10),
          new THREE.MeshPhongMaterial({ flatShading: true })
        );
        scene.add(sphere);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animate);

        effect = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true });
        effect.setSize(window.innerWidth, window.innerHeight);
        effect.domElement.style.color = "black";
        effect.domElement.style.backgroundColor = "transparent";

        if (mountRef.current) {
          mountRef.current.appendChild(effect.domElement);
        }

        window.addEventListener("resize", onWindowResize);
      }

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        effect.setSize(window.innerWidth, window.innerHeight);
      }

      function animate() {
        const timer = Date.now() - start;

        sphere.position.y = Math.abs(Math.sin(timer * 0.002)) * 150;
        sphere.rotation.x = timer * 0.0003;
        sphere.rotation.z = timer * 0.0002;

        effect.render(scene, camera);
      }

      // Cleanup on component unmount
      return () => {
        window.removeEventListener("resize", onWindowResize);
        if (mountRef.current) {
          mountRef.current.removeChild(effect.domElement);
        }
      };
    }
  }, []);

  return <div ref={mountRef} class={`h-[0] w-[0]`} />;
}

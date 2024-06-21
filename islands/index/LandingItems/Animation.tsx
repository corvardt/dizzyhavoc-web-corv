// islands/ThreeJsAnimation.tsx
import { useEffect, useRef } from "preact/hooks";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165/build/three.module.js";
import { AsciiEffect } from "https://cdn.jsdelivr.net/npm/three@0.165/examples/jsm/effects/AsciiEffect.js";

export function Animation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let camera, scene, renderer, effect;
      let cube;

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

        const geometry = new THREE.BoxGeometry( 200, 200, 200 ); 
        const material =  new THREE.MeshPhongMaterial({ flatShading: true })
        cube = new THREE.Mesh( geometry, material ); 
        scene.add(cube);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth/2, window.innerHeight/2.5 );
        renderer.setAnimationLoop(animate);

        effect = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true });
        effect.setSize( window.innerWidth/2, window.innerHeight/2.5 );
        effect.domElement.style.color = "gray";

        if (mountRef.current) {
          mountRef.current.appendChild(effect.domElement);
        }
        window.addEventListener("resize", onWindowResize);
      }

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth/2, window.innerHeight/2.5 );
        effect.setSize( window.innerWidth/2, window.innerHeight/2.5 );
      }

      function animate() {
        cube.position.x = -20
        cube.position.y = 250;
        cube.rotation.x -= 0.001;
        cube.rotation.z -= 0.003;

        effect.render(scene, camera);
      }

      return () => {
        window.removeEventListener("resize", onWindowResize);
        if (mountRef.current) {
          mountRef.current.removeChild(effect.domElement);
        }
      };
    }
  }, []);

  return <div ref={mountRef} />;
}

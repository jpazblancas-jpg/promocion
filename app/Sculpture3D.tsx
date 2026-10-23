"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { model: number; rotation: number };
type Swap = { outgoing: THREE.Group; incoming: THREE.Group; started: number };

const palette = [0xff6148, 0x2547ff, 0xffcb23, 0x111111, 0xe9e9df];

function material(index: number) {
  return new THREE.MeshPhysicalMaterial({
    color: palette[index % palette.length],
    roughness: 0.28,
    metalness: 0.04,
    clearcoat: 0.7,
    clearcoatRoughness: 0.22,
  });
}

function add(group: THREE.Group, geometry: THREE.BufferGeometry, color: number, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) {
  const mesh = new THREE.Mesh(geometry, material(color));
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
}

function buildModel(model: number) {
  const group = new THREE.Group();
  const sphere = () => new THREE.SphereGeometry(1, 64, 40);
  const torus = (major = 0.9, tube = 0.24) => new THREE.TorusGeometry(major, tube, 24, 80);
  const capsule = () => new THREE.CapsuleGeometry(0.42, 1.25, 12, 28);
  const box = () => new THREE.BoxGeometry(1.35, 1.35, 1.35, 5, 5, 5);

  if (model === 0) {
    add(group, sphere(), 4, [0, 0, 0], [0, 0, 0], [1.18, 1.18, 1.18]);
    add(group, sphere(), 0, [0.5, 0.42, 0.95], [0, 0, 0], [0.29, 0.29, 0.29]);
  } else if (model === 1) {
    add(group, sphere(), 0, [-0.48, 0.1, 0], [0, 0, 0], [0.92, 1.12, 0.78]);
    add(group, sphere(), 1, [0.48, -0.08, 0.25], [0, 0, 0], [0.85, 0.88, 0.95]);
    add(group, sphere(), 2, [0.1, 0.62, 0.6], [0, 0, 0], [0.42, 0.42, 0.42]);
  } else if (model === 2) {
    add(group, capsule(), 0, [-0.28, 0, 0], [0, 0, -0.88], [0.7, 1.05, 0.7]);
    add(group, capsule(), 1, [0.3, 0, 0.38], [0, 0, 0.72], [0.72, 1.02, 0.72]);
    add(group, sphere(), 2, [0, 0, 0.9], [0, 0, 0], [0.52, 0.52, 0.52]);
  } else if (model === 3) {
    add(group, box(), 3, [-0.34, 0, 0], [0.2, 0.58, 0.72], [0.9, 0.9, 0.9]);
    add(group, box(), 0, [0.35, 0.1, 0.48], [0.55, -0.25, 0.2], [0.66, 0.66, 0.66]);
    add(group, box(), 1, [0.05, -0.16, 1], [0.15, 0.6, -0.4], [0.36, 0.36, 0.36]);
  } else if (model === 4) {
    add(group, sphere(), 0, [0, 0, -0.35], [0, 0, 0], [1.15, 1.15, 0.62]);
    add(group, sphere(), 2, [0, 0, 0.3], [0, 0, 0], [0.82, 0.82, 0.55]);
    add(group, sphere(), 1, [0, 0, 0.85], [0, 0, 0], [0.5, 0.5, 0.42]);
  } else if (model === 5) {
    add(group, torus(), 0, [0, 0, 0], [0.55, 0.25, 0], [1.05, 1.05, 1.05]);
    add(group, torus(), 1, [0, 0, 0], [-0.55, 0.35, 0], [0.9, 0.9, 0.9]);
    add(group, sphere(), 2, [0, 0, 0], [0, 0, 0], [0.48, 0.48, 0.48]);
  } else if (model === 6) {
    add(group, capsule(), 0, [-0.35, 0.12, -0.18], [0.55, 0.2, 1.05], [0.92, 1.18, 0.74]);
    add(group, capsule(), 1, [0.37, -0.08, 0.38], [-0.4, 0.55, -0.82], [0.72, 0.94, 0.7]);
    add(group, sphere(), 4, [0.05, 0.12, 0.9], [0, 0, 0], [0.42, 0.42, 0.42]);
  } else if (model === 7) {
    add(group, torus(0.82, 0.32), 3, [0, 0, 0], [0.35, 0.55, 0.25], [1.1, 1.1, 1.1]);
    add(group, torus(0.58, 0.22), 0, [0.05, 0, 0.32], [-0.45, 0.25, 0.75], [1, 1, 1]);
    add(group, sphere(), 2, [0.25, 0.05, 0.6], [0, 0, 0], [0.42, 0.42, 0.42]);
  } else if (model === 8) {
    add(group, capsule(), 3, [0, 0, -0.42], [0.35, 0.7, Math.PI / 2], [0.58, 1.18, 0.58]);
    add(group, capsule(), 0, [0, 0, 0.08], [-0.55, -0.35, Math.PI / 2], [0.52, 1.03, 0.52]);
    add(group, capsule(), 1, [0, 0, 0.55], [0.68, -0.4, Math.PI / 2], [0.46, 0.85, 0.46]);
  } else if (model === 9) {
    add(group, sphere(), 1, [-0.34, 0.05, -0.2], [0, 0.4, 0.2], [1.05, 0.84, 0.78]);
    add(group, sphere(), 0, [0.38, 0.1, 0.25], [0.2, 0, 0.55], [0.84, 1.08, 0.72]);
    add(group, sphere(), 2, [0.06, -0.42, 0.78], [0, 0, 0], [0.48, 0.48, 0.48]);
  } else {
    add(group, box(), 3, [-0.38, 0, -0.18], [0.45, 0.72, 0.78], [0.82, 0.82, 0.82]);
    add(group, box(), 0, [0.34, 0.12, 0.34], [-0.28, 0.42, 0.25], [0.66, 0.66, 0.66]);
    add(group, torus(0.52, 0.2), 1, [0.05, -0.05, 0.95], [0.5, 0.2, 0.1], [1, 1, 1]);
  }

  const bounds = new THREE.Box3().setFromObject(group);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  group.position.sub(center);
  // Leave a generous safety margin so every silhouette stays inside the
  // mobile viewport, including its widest profile while rotating.
  group.scale.multiplyScalar(1.92 / Math.max(size.x, size.y, size.z));
  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
}

export function Sculpture3D({ model, rotation }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const activeRef = useRef<THREE.Group | null>(null);
  const swapRef = useRef<Swap | null>(null);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.1, 5.9);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x2547ff, 2.5));
    const key = new THREE.DirectionalLight(0xffffff, 4.2);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff6148, 3.2);
    rim.position.set(4, -1, -3);
    scene.add(rim);

    const root = new THREE.Group();
    root.rotation.x = -0.14;
    scene.add(root);
    groupRef.current = root;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    let frame = 0;
    const render = (time = performance.now()) => {
      const swap = swapRef.current;
      if (swap) {
        const progress = Math.min(1, (time - swap.started) / 720);
        // A solid two-stage transformation at almost constant size. Only the
        // user's drag controls orientation: the handoff never adds rotation.
        if (progress < 0.5) {
          const fold = progress / 0.5;
          const eased = fold * fold * (3 - 2 * fold);
          swap.outgoing.scale.set(1 + eased * 0.14, 1 - eased * 0.1, 1 + eased * 0.08);
          swap.outgoing.rotation.set(0, 0, 0);
          swap.incoming.visible = false;
        } else {
          const unfold = (progress - 0.5) / 0.5;
          const eased = unfold * unfold * (3 - 2 * unfold);
          swap.outgoing.visible = false;
          swap.incoming.visible = true;
          swap.incoming.scale.set(
            1.14 - eased * 0.14,
            0.9 + eased * 0.1,
            1.08 - eased * 0.08,
          );
          swap.incoming.rotation.set(0, 0, 0);
        }
        if (progress === 1) {
          root.remove(swap.outgoing);
          swap.outgoing.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
              const materials = Array.isArray(object.material) ? object.material : [object.material];
              materials.forEach((item) => item.dispose());
            }
          });
          activeRef.current = swap.incoming;
          swapRef.current = null;
        }
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
      groupRef.current = null;
      activeRef.current = null;
      swapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const root = groupRef.current;
    if (!root) return;
    const next = buildModel(model);
    const current = activeRef.current;
    if (!current) {
      root.add(next);
      activeRef.current = next;
      return;
    }
    // Swap complete objects: the old piece exits and the new one enters.
    // Their vertices never interpolate, avoiding a liquid-like morph.
    if (swapRef.current) root.remove(swapRef.current.outgoing);
    current.rotation.set(0, 0, 0);
    next.scale.set(1.14, 0.9, 1.08);
    next.visible = false;
    root.add(next);
    swapRef.current = { outgoing: current, incoming: next, started: performance.now() };
    activeRef.current = next;
  }, [model]);

  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation.y = THREE.MathUtils.degToRad(rotation);
  }, [rotation]);

  return <div className="sculpture-webgl" aria-hidden="true" ref={host} />;
}

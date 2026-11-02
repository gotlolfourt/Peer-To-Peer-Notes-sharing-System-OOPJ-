import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const KnowledgeHero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x101211, 0.04);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xd5f36a, 2.5); // Acid lime highlight
    keyLight.position.set(5, 8, 8);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xa5b89b, 2, 20); // Muted sage fill
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xd5f36a, 3, 15);
    rimLight.position.set(0, -6, 2);
    scene.add(rimLight);

    // 5. Central glowing knowledge sphere (Icosahedron wireframe + inner glowing sphere)
    const centralGroup = new THREE.Group();
    scene.add(centralGroup);

    // Inner glowing sphere
    const sphereGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x191d19,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x151815,
    });
    const centralSphere = new THREE.Mesh(sphereGeo, sphereMat);
    centralGroup.add(centralSphere);

    // Outer wireframe knowledge mesh
    const wireGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xd5f36a,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    centralGroup.add(wireMesh);

    // Subtle rings orbiting the center
    const ringGeo = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xa5b89b, transparent: true, opacity: 0.25 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    centralGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    centralGroup.add(ring2);

    // 6. Floating 3D Document / Note Cards
    const cardsGroup = new THREE.Group();
    scene.add(cardsGroup);

    interface FloatingCard {
      mesh: THREE.Group;
      rotSpeed: { x: number; y: number; z: number };
      floatSpeed: number;
      offset: number;
      basePos: THREE.Vector3;
    }

    const floatingCards: FloatingCard[] = [];

    // Helper to generate document texture on HTML canvas
    const createDocTexture = (title: string, category: string, code: string, isLime: boolean) => {
      const cvs = document.createElement('canvas');
      cvs.width = 512;
      cvs.height = 700;
      const ctx = cvs.getContext('2d')!;

      // Background
      ctx.fillStyle = isLime ? '#D5F36A' : '#191D19';
      ctx.fillRect(0, 0, 512, 700);

      // Border
      ctx.strokeStyle = isLime ? '#101211' : '#343A32';
      ctx.lineWidth = 14;
      ctx.strokeRect(10, 10, 492, 680);

      // Header Tag
      ctx.fillStyle = isLime ? '#101211' : '#D5F36A';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(`[ ${category.toUpperCase()} ]`, 40, 60);

      // Course code
      ctx.fillStyle = isLime ? '#2A3022' : '#A5B89B';
      ctx.font = '18px monospace';
      ctx.fillText(code, 40, 95);

      // Title
      ctx.fillStyle = isLime ? '#101211' : '#F1EFE5';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(title, 40, 160);

      // Divider line
      ctx.strokeStyle = isLime ? '#A5B89B' : '#343A32';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 190);
      ctx.lineTo(470, 190);
      ctx.stroke();

      // Simulated academic note content lines
      ctx.fillStyle = isLime ? '#333D25' : '#969B91';
      for (let i = 0; i < 9; i++) {
        const lw = 180 + ((i * 47) % 250);
        ctx.fillRect(40, 220 + i * 36, lw, 12);
      }

      // Small formula box
      ctx.fillStyle = isLime ? '#EAF9A5' : '#212621';
      ctx.fillRect(40, 550, 430, 80);
      ctx.fillStyle = isLime ? '#101211' : '#D5F36A';
      ctx.font = '20px monospace';
      ctx.fillText('f(x) = sum(w_i * x_i) + b', 60, 600);

      return new THREE.CanvasTexture(cvs);
    };

    const cardData = [
      { title: 'Java OOP Design', cat: 'CSE / OOPJ', code: 'PCC12CE07', pos: new THREE.Vector3(-4.8, 2.2, 1.5), lime: true },
      { title: 'ML Fast Formulas', cat: 'AIML', code: 'AIML-402', pos: new THREE.Vector3(4.5, 1.8, 0.8), lime: false },
      { title: 'Logic Synthesis', cat: 'ECE', code: 'ECC301', pos: new THREE.Vector3(-3.9, -2.4, 2.2), lime: false },
      { title: 'Data Structures', cat: 'CSE / DSA', code: 'CS204', pos: new THREE.Vector3(4.2, -2.1, 1.2), lime: true },
      { title: 'Thermodynamics', cat: 'MECH', code: 'MEC105', pos: new THREE.Vector3(0.2, 3.8, -1.0), lime: false },
    ];

    cardData.forEach((item, index) => {
      const cardGroup = new THREE.Group();
      const texture = createDocTexture(item.title, item.cat, item.code, item.lime);

      // Card Geometry (slightly curved paper look)
      const planeGeo = new THREE.PlaneGeometry(2.0, 2.7, 8, 8);
      const planeMat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.4,
        metalness: 0.1,
      });

      const cardMesh = new THREE.Mesh(planeGeo, planeMat);
      cardGroup.add(cardMesh);

      // Back sheet shadow layer (layered paper effect)
      const backGeo = new THREE.PlaneGeometry(1.95, 2.65);
      const backMat = new THREE.MeshBasicMaterial({ color: 0x141714 });
      const backMesh = new THREE.Mesh(backGeo, backMat);
      backMesh.position.z = -0.06;
      backMesh.position.x = 0.05;
      cardGroup.add(backMesh);

      cardGroup.position.copy(item.pos);
      cardGroup.rotation.z = (index % 2 === 0 ? 0.08 : -0.08) * (index + 1);
      cardsGroup.add(cardGroup);

      floatingCards.push({
        mesh: cardGroup,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.003,
          y: (Math.random() - 0.5) * 0.003,
          z: (Math.random() - 0.5) * 0.002,
        },
        floatSpeed: 0.8 + Math.random() * 0.6,
        offset: index * 1.5,
        basePos: item.pos.clone(),
      });
    });

    // 7. Ambient Particle Field (Glowing Knowledge Sparks)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const limeColor = new THREE.Color(0xd5f36a);
    const sageColor = new THREE.Color(0xa5b89b);
    const ivoryColor = new THREE.Color(0xf1efe5);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 26;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 18;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const chosenColor = i % 3 === 0 ? limeColor : i % 3 === 1 ? sageColor : ivoryColor;
      colorArray[i * 3] = chosenColor.r;
      colorArray[i * 3 + 1] = chosenColor.g;
      colorArray[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Animated Connection Rays linking cards to the center
    const lineMaterial = new THREE.LineDashedMaterial({
      color: 0xd5f36a,
      dashSize: 0.3,
      gapSize: 0.2,
      opacity: 0.25,
      transparent: true,
    });

    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    cardData.forEach((item) => {
      const points = [new THREE.Vector3(0, 0, 0), item.pos.clone().multiplyScalar(0.7)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMaterial);
      line.computeLineDistances();
      linesGroup.add(line);
    });

    // 9. Mouse event listeners for smooth interactive parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      mouseRef.current.targetX = x * 1.4;
      mouseRef.current.targetY = y * 1.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 10. Responsive resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Mouse inertia damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      // Rotate central sphere & wireframe
      centralSphere.rotation.y = elapsedTime * 0.15;
      wireMesh.rotation.y = -elapsedTime * 0.2;
      wireMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
      ring1.rotation.z = elapsedTime * 0.1;
      ring2.rotation.z = -elapsedTime * 0.08;

      // Float the cards with organic harmonic oscillation
      floatingCards.forEach((item) => {
        const t = elapsedTime * item.floatSpeed + item.offset;
        item.mesh.position.y = item.basePos.y + Math.sin(t) * 0.25;
        item.mesh.position.x = item.basePos.x + Math.cos(t * 0.7) * 0.15;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.x += item.rotSpeed.x;
      });

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      // Parallax camera movement reacting to mouse
      camera.position.x = mouseRef.current.x * 1.5;
      camera.position.y = mouseRef.current.y * 1.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
};

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MOCK_PEERS } from '../../services/mockData';
import { PeerProfile } from '../../types';

export const NetworkMesh3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPeer, setHoveredPeer] = useState<PeerProfile | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x101211, 0.05);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Node coordinates corresponding to our mock peers
    const nodes: { mesh: THREE.Mesh; peer: PeerProfile; basePos: THREE.Vector3 }[] = [];
    const nodePositions = [
      new THREE.Vector3(-3.5, 1.8, 0),
      new THREE.Vector3(3.2, 2.0, -1),
      new THREE.Vector3(0, 0.2, 1.2),
      new THREE.Vector3(-2.8, -2.1, -0.5),
      new THREE.Vector3(3.6, -1.8, 0.5),
    ];

    const nodeGeo = new THREE.SphereGeometry(0.35, 24, 24);

    MOCK_PEERS.forEach((peer, idx) => {
      const pos = nodePositions[idx % nodePositions.length];
      const isFaculty = peer.role === 'FACULTY';

      const mat = new THREE.MeshStandardMaterial({
        color: isFaculty ? 0xd5f36a : 0xa5b89b,
        emissive: isFaculty ? 0x6e8418 : 0x22301c,
        roughness: 0.2,
        metalness: 0.5,
      });

      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);

      // Outer aura ring
      const ringGeo = new THREE.RingGeometry(0.48, 0.54, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isFaculty ? 0xd5f36a : 0xa5b89b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const aura = new THREE.Mesh(ringGeo, ringMat);
      mesh.add(aura);

      nodes.push({ mesh, peer, basePos: pos.clone() });
    });

    // Connecting Network Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x343a32,
      transparent: true,
      opacity: 0.6,
    });

    const connections: [number, number][] = [
      [0, 2],
      [1, 2],
      [2, 3],
      [2, 4],
      [0, 1],
      [3, 4],
    ];

    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    connections.forEach(([i, j]) => {
      const p1 = nodes[i].basePos;
      const p2 = nodes[j].basePos;
      const points = [p1, p2];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMat);
      linesGroup.add(line);
    });

    // Traveling Data Packets (Simulating notes streaming across peers)
    const packetGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xd5f36a });
    const packets = connections.map(([startIdx, endIdx]) => {
      const mesh = new THREE.Mesh(packetGeo, packetMat);
      scene.add(mesh);
      return {
        mesh,
        start: nodes[startIdx].basePos,
        end: nodes[endIdx].basePos,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.008,
      };
    });

    // Ambient light
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const pointLight = new THREE.PointLight(0xd5f36a, 2, 20);
    pointLight.position.set(0, 3, 5);
    scene.add(pointLight);

    // Raycaster for hover detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const y = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);
      mouse.x = x;
      mouse.y = y;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes.map((n) => n.mesh));

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const matched = nodes.find((n) => n.mesh === hitMesh);
        if (matched) {
          setHoveredPeer(matched.peer);
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredPeer(null);
        container.style.cursor = 'default';
      }
    };

    container.addEventListener('mousemove', handlePointerMove);

    // Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight || 550;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let clock = new THREE.Clock();
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slowly oscillate nodes
      nodes.forEach((n, idx) => {
        n.mesh.position.y = n.basePos.y + Math.sin(elapsed * 1.5 + idx) * 0.12;
        n.mesh.position.x = n.basePos.x + Math.cos(elapsed * 1.2 + idx) * 0.08;
      });

      // Update traveling note data packets
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
        p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] rounded-2xl border border-sage-border/50 bg-ink-surface/80 overflow-hidden">
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Info Overlay */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <span className="badge-mono px-3 py-1 bg-ink-charcoal border border-sage-border rounded-full text-lime">
          ● REAL-TIME PEER TOPOLOGY
        </span>
        <h3 className="text-xl font-heading font-semibold mt-2 text-ivory">Active Knowledge Mesh</h3>
        <p className="text-sm text-ivory-muted max-w-sm">
          Hover over nodes to inspect peer statistics, role credentials, and live notes in transit.
        </p>
      </div>

      {/* Interactive Tooltip Card on Node Hover */}
      {hoveredPeer && (
        <div
          className="absolute z-30 pointer-events-none p-4 rounded-xl glass-panel-glow text-ivory w-72 transition-all duration-150 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 12 }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-sage-border/60">
            <div>
              <div className="font-heading font-bold text-base text-ivory flex items-center gap-2">
                {hoveredPeer.fullName}
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              </div>
              <div className="badge-mono text-lime-glow">@{hoveredPeer.username}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-ink-elevated border border-sage-border text-ivory">
              {hoveredPeer.role}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="bg-ink-charcoal p-2 rounded border border-sage-border/40">
              <span className="text-ivory-dim block text-[10px]">DEPARTMENT</span>
              <span className="font-heading font-semibold text-ivory">{hoveredPeer.department}</span>
            </div>
            <div className="bg-ink-charcoal p-2 rounded border border-sage-border/40">
              <span className="text-ivory-dim block text-[10px]">REPUTATION</span>
              <span className="font-mono font-bold text-lime">+{hoveredPeer.reputationScore} pts</span>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-ivory-muted">
            Shared Notes: <span className="text-ivory font-semibold">{hoveredPeer.sharedNotesCount}</span> | Copied: <span className="text-ivory font-semibold">{hoveredPeer.downloadedNotesCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

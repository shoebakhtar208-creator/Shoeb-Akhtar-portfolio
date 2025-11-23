
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { BEE_ASSETS, BEE_CONFIG } from '../constants';

/**
 * BeeController
 * Handles the logic for the 3D Bee: LOD loading, steering behaviors, and animation.
 */
export class BeeController {
  constructor(scene, camera, config = {}) {
    this.scene = scene;
    this.camera = camera;
    this.config = { ...BEE_CONFIG, ...config };

    this.mesh = null;
    this.mixer = null;
    this.actions = {};
    this.clock = new THREE.Clock();

    // Physics State
    this.position = new THREE.Vector3(0, 1.5, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, 0, 0);
    this.target = new THREE.Vector3();
    
    this.maxSpeed = 1.2;
    this.maxForce = 0.05;
    this.currentBank = 0; // For smooth banking interpolation

    // Noise generator for smooth wandering
    this.noise = new SimpleNoise();
    this.noiseOffset = Math.random() * 1000;

    // Repulsion State
    this.repelForce = new THREE.Vector3();
    this.dummyVector = new THREE.Vector3(); // For reuse

    this.isLoaded = false;
    this.useSpriteFallback = false;

    this.init();
  }

  init() {
    this.setNewTarget();
    this.loadModels();
  }

  loadModels() {
    const dracoLoader = new DRACOLoader();
    // Use a reliable CDN for the decoder
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Try Low Poly first
    loader.load(
      BEE_ASSETS.LOW,
      (gltf) => this.onModelLoaded(gltf),
      undefined,
      (err) => {
        console.warn('Bee GLTF failed, switching to sprite', err);
        this.enableSpriteFallback();
      }
    );
  }

  onModelLoaded(gltf) {
    if (this.useSpriteFallback) return;

    this.mesh = gltf.scene;
    this.mesh.scale.setScalar(this.config.SCALE);
    this.mesh.position.copy(this.position);
    
    // Enable Shadows
    this.mesh.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    this.scene.add(this.mesh);

    // Animation Setup
    if (gltf.animations.length) {
      this.mixer = new THREE.AnimationMixer(this.mesh);
      // Try to find a fly/hover animation, default to first
      const clip = gltf.animations.find(a => a.name.toLowerCase().includes('fly')) || gltf.animations[0];
      if (clip) {
        const action = this.mixer.clipAction(clip);
        action.play();
        // Randomize start time so multiple bees don't sync
        action.time = Math.random();
      }
    }

    this.isLoaded = true;
  }

  enableSpriteFallback() {
    this.useSpriteFallback = true;
    const map = new THREE.TextureLoader().load(BEE_ASSETS.FALLBACK_SPRITE);
    const material = new THREE.SpriteMaterial({ map, transparent: true });
    this.mesh = new THREE.Sprite(material);
    this.mesh.scale.set(0.5, 0.5, 1);
    this.scene.add(this.mesh);
    this.isLoaded = true;
  }

  setNewTarget() {
    // Pick random point in bounds for the "Seek" behavior
    const { x, y, z } = this.config.BOUNDS;
    this.target.set(
      THREE.MathUtils.randFloat(x[0], x[1]),
      THREE.MathUtils.randFloat(y[0], y[1]),
      THREE.MathUtils.randFloat(z[0], z[1])
    );

    // Schedule next decision (2s - 6s)
    const interval = THREE.MathUtils.randFloat(this.config.WANDER_INTERVAL[0], this.config.WANDER_INTERVAL[1]);
    setTimeout(() => {
        if (this.mesh) this.setNewTarget();
    }, interval);
  }

  /**
   * Update Loop
   * @param {number} delta - time delta
   * @param {object} mouseInteraction - { x, y, active } (screen coords)
   * @param {number} width - screen width
   * @param {number} height - screen height
   */
  update(delta, mouseInteraction, width, height) {
    if (!this.isLoaded || !this.mesh) return;
    
    this.acceleration.set(0, 0, 0);
    const time = this.clock.getElapsedTime();

    // --- 1. STEERING: Noise-based Wander ---
    // Perlin noise creates smooth, non-jittery random vectors
    const ns = 0.5; // Noise scale (frequency)
    const na = 2.0; // Noise amplitude
    const noiseX = this.noise.noise(time * ns + this.noiseOffset, 0, 0);
    const noiseY = this.noise.noise(0, time * ns + this.noiseOffset, 0);
    const noiseZ = this.noise.noise(0, 0, time * ns + this.noiseOffset);
    
    const wanderForce = new THREE.Vector3(noiseX, noiseY, noiseZ).normalize().multiplyScalar(0.8);

    // --- 2. STEERING: Seek Target (Keep in bounds) ---
    const desiredSeek = this.target.clone().sub(this.position).normalize().multiplyScalar(0.4); // Weight 0.4
    
    // --- 3. STEERING: Mouse Repulsion ---
    const repulsionForce = new THREE.Vector3();
    
    if (mouseInteraction && mouseInteraction.active) {
      // Project Bee position to Screen Space
      const beeScreenPos = this.position.clone().project(this.camera);
      const screenX = (beeScreenPos.x * 0.5 + 0.5) * width;
      const screenY = (-(beeScreenPos.y * 0.5) + 0.5) * height;

      const dx = screenX - mouseInteraction.x;
      const dy = screenY - mouseInteraction.y;
      const pixelDist = Math.sqrt(dx * dx + dy * dy);

      if (pixelDist < this.config.AVOID_RADIUS_PX) {
        // Create a repulsion vector in 3D space roughly away from the camera/cursor ray
        const vec = new THREE.Vector3(
            (mouseInteraction.x / width) * 2 - 1,
            -(mouseInteraction.y / height) * 2 + 1,
            0.5
        ).unproject(this.camera).sub(this.camera.position).normalize();
        
        // Target point on the ray near the bee
        const targetPoint = this.camera.position.clone().add(vec.multiplyScalar(this.position.distanceTo(this.camera.position)));
        
        repulsionForce.copy(this.position).sub(targetPoint).normalize().multiplyScalar(3.0); // Strong repulsion
      }
    }

    // --- 4. Apply Forces ---
    // Sum forces: Wander + Seek + Repulsion
    const steering = wanderForce.add(desiredSeek).add(repulsionForce);
    
    // Apply simple steering (force - velocity) limit
    steering.sub(this.velocity).clampLength(0, this.maxForce);
    this.acceleration.add(steering);

    // Physics Step
    this.velocity.add(this.acceleration);
    this.velocity.clampLength(0, this.maxSpeed);
    this.position.add(this.velocity.clone().multiplyScalar(delta));

    // Hard Bounds Constraint (Keep it visible if it wanders too far)
    const { x, y, z } = this.config.BOUNDS;
    if (this.position.x < x[0] - 1 || this.position.x > x[1] + 1) this.velocity.x *= -1;
    if (this.position.y < y[0] - 0.5 || this.position.y > y[1] + 0.5) this.velocity.y *= -1;
    if (this.position.z < z[0] - 1 || this.position.z > z[1] + 1) this.velocity.z *= -1;

    this.mesh.position.copy(this.position);

    // --- 5. Orientation & Banking ---
    if (!this.useSpriteFallback) {
        // Look at velocity direction
        const lookTarget = this.position.clone().add(this.velocity);
        this.mesh.lookAt(lookTarget);
        
        // Banking (Roll) tied to Angular Velocity / Lateral Acceleration
        // We calculate the component of the steering force that is perpendicular to the velocity
        // This represents the "turning force".
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.mesh.quaternion);
        const lateralForce = right.dot(steering); 
        
        // If lateralForce is positive (right), we bank right (negative Z rot in some frames, positive in others depending on rig)
        // Standard banking: Turn Right -> Bank Right (-Z locally usually works visually)
        const targetBank = -lateralForce * 15.0; 
        
        // Smooth lerp for banking
        this.currentBank = THREE.MathUtils.lerp(this.currentBank, targetBank, 0.1);
        this.mesh.rotateZ(this.currentBank);
    } else {
        this.mesh.material.rotation = this.velocity.x * -0.2;
    }

    // Animation Mixer
    if (this.mixer) this.mixer.update(delta);
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      if (this.mesh.geometry) this.mesh.geometry.dispose();
    }
  }
}

// --- Helper: Simple 3D Simplex-like Noise ---
// A minimal noise implementation for natural wandering
class SimpleNoise {
  constructor() {
    this.perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    // Shuffle
    for (let i = 255; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      [p[i], p[r]] = [p[r], p[i]];
    }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(t, a, b) { return a + t * (b - a); }
  grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);
    const A = this.perm[X] + Y, AA = this.perm[A] + Z, AB = this.perm[A + 1] + Z;
    const B = this.perm[X + 1] + Y, BA = this.perm[B] + Z, BB = this.perm[B + 1] + Z;

    return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.perm[AA], x, y, z),
        this.grad(this.perm[BA], x - 1, y, z)),
        this.lerp(u, this.grad(this.perm[AB], x, y - 1, z),
        this.grad(this.perm[BB], x - 1, y - 1, z))),
        this.lerp(v, this.lerp(u, this.grad(this.perm[AA + 1], x, y, z - 1),
        this.grad(this.perm[BA + 1], x - 1, y, z - 1)),
        this.lerp(u, this.grad(this.perm[AB + 1], x, y - 1, z - 1),
        this.grad(this.perm[BB + 1], x - 1, y - 1, z - 1))));
  }
}

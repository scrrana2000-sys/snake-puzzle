/* Snake Puzzle — 3D animated hero background (Three.js) */
(function () {
  function init() {
    var canvas = document.getElementById('hero3d');
    if (!canvas || typeof THREE === 'undefined') return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.6, 9);

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Lights
    scene.add(new THREE.AmbientLight(0x88ffb0, 0.55));
    var key = new THREE.PointLight(0x8cf377, 1.6, 30);
    key.position.set(4, 5, 6);
    scene.add(key);
    var rim = new THREE.PointLight(0x2bff9c, 1.1, 30);
    rim.position.set(-6, -3, -4);
    scene.add(rim);

    // Build a coiling 3D "snake" out of a tube following a helix curve
    function HelixCurve() {
      THREE.Curve.call(this);
    }
    HelixCurve.prototype = Object.create(THREE.Curve.prototype);
    HelixCurve.prototype.constructor = HelixCurve;
    HelixCurve.prototype.getPoint = function (t) {
      var angle = t * Math.PI * 6.2;
      var radius = 2.15 - t * 1.15;
      var x = Math.cos(angle) * radius;
      var y = (t - 0.5) * 3.4;
      var z = Math.sin(angle) * radius;
      return new THREE.Vector3(x, y, z);
    };

    var helixPath = new HelixCurve();
    var tubeGeo = new THREE.TubeGeometry(helixPath, 220, 0.34, 14, false);
    var tubeMat = new THREE.MeshStandardMaterial({
      color: 0x6bff8f,
      emissive: 0x123a20,
      metalness: 0.25,
      roughness: 0.35,
    });
    var snake = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(snake);

    // Head
    var headGeo = new THREE.SphereGeometry(0.46, 24, 24);
    var headMat = new THREE.MeshStandardMaterial({
      color: 0xeafff0,
      emissive: 0x1a5c26,
      metalness: 0.3,
      roughness: 0.3,
    });
    var head = new THREE.Mesh(headGeo, headMat);
    var headPos = helixPath.getPoint(0);
    head.position.copy(headPos);
    scene.add(head);

    // Floating puzzle-cube accents
    var cubes = new THREE.Group();
    var cubeGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
    for (var i = 0; i < 10; i++) {
      var mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x6bff8f : 0xff7a52,
        transparent: true,
        opacity: 0.5,
        roughness: 0.5,
        metalness: 0.1,
      });
      var cube = new THREE.Mesh(cubeGeo, mat);
      var a = (i / 10) * Math.PI * 2;
      var r = 4.4 + (i % 3) * 0.6;
      cube.position.set(Math.cos(a) * r, Math.sin(a * 1.7) * 2.4, Math.sin(a) * r - 2);
      cube.userData.speed = 0.15 + Math.random() * 0.25;
      cube.userData.offset = Math.random() * Math.PI * 2;
      cubes.add(cube);
    }
    scene.add(cubes);

    var rig = new THREE.Group();
    rig.add(snake);
    rig.add(head);
    scene.add(rig);

    var mouseX = 0,
      mouseY = 0,
      targetRotY = 0,
      targetRotX = 0;

    function onPointerMove(e) {
      var x = ('touches' in e && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      var y = ('touches' in e && e.touches[0]) ? e.touches[0].clientY : e.clientY;
      mouseX = (x / window.innerWidth) * 2 - 1;
      mouseY = (y / window.innerHeight) * 2 - 1;
    }
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    function resize() {
      var hero = canvas.closest('.hero') || document.body;
      var w = hero.clientWidth;
      var h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    var clock = new THREE.Clock();
    var running = true;

    document.addEventListener('visibilitychange', function () {
      running = document.visibilityState === 'visible';
      if (running) animate();
    });

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      var speed = reduceMotion ? 0.08 : 1;

      rig.rotation.y = t * 0.28 * speed;
      rig.rotation.x = Math.sin(t * 0.3) * 0.12 * speed;
      head.position.copy(helixPath.getPoint((Math.sin(t * 0.15 * speed) + 1) / 2 * 0.02));

      cubes.children.forEach(function (c) {
        c.rotation.x += 0.004 * speed;
        c.rotation.y += 0.006 * speed;
        c.position.y += Math.sin(t * c.userData.speed + c.userData.offset) * 0.003;
      });

      targetRotY += (mouseX * 0.35 - targetRotY) * 0.03;
      targetRotX += (mouseY * 0.2 - targetRotX) * 0.03;
      camera.position.x = targetRotY * 2;
      camera.position.y = 0.6 - targetRotX * 1.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 0);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
  window.addEventListener('load', function () {
    // retry in case three.js CDN loaded after DOMContentLoaded
    if (!window.__hero3dStarted) {
      window.__hero3dStarted = true;
      init();
    }
  });
})();

import * as THREE from 'three';

let scene, camera, renderer, instancedChairs;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // สร้างพื้นห้อง EH 103 (สมมติขนาด 100x50 เมตร)
    const floorGeo = THREE.PlaneGeometry(100, 150);
    const floorMat = new THREE.MeshPhongMaterial({ color: 0x999999 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // สร้างเวที (17.08 x 4.88)
    const stageGeo = THREE.BoxGeometry(17.08, 1.2, 4.88);
    const stageMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = 0.6;
    stage.position.z = -60; // วางไว้ด้านหน้าสุด
    scene.add(stage);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 50, 10);
    scene.add(new THREE.AmbientLight(0x404040));
    scene.add(light);

    animate();
}

window.generateLayout = function() {
    const count = parseInt(document.getElementById('chairs').value);
    
    // ลบเก้าอี้เก่าถ้ามี
    if (instancedChairs) scene.remove(instancedChairs);

    // ใช้ InstancedMesh เพื่อประสิทธิภาพ (วาด 5,000 ตัวในรอบเดียว)
    const chairGeo = THREE.BoxGeometry(0.5, 0.8, 0.5); // ขนาดเก้าอี้จำลอง
    const chairMat = new THREE.MeshPhongMaterial({ color: 0xcc0000 });
    instancedChairs = new THREE.InstancedMesh(chairGeo, chairMat, count);

    let dummy = new THREE.Object3D();
    let chairsPerRow = 50; 
    let spacingX = 0.8;
    let spacingZ = 1.2;

    for (let i = 0; i < count; i++) {
        let row = Math.floor(i / chairsPerRow);
        let col = i % chairsPerRow;

        // คำนวณพิกัดการวาง
        let x = (col - chairsPerRow / 2) * spacingX;
        let z = (row * spacingZ) - 40; // เริ่มวางถัดจากเวทีลงมา

        dummy.position.set(x, 0.4, z);
        dummy.updateMatrix();
        instancedChairs.setMatrixAt(i, dummy.matrix);
    }
    scene.add(instancedChairs);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
generateLayout();

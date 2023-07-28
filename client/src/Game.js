import './game.css';
import * as THREE from 'three';
import { useEffect } from 'react';

function Game() {
    const renderer = new THREE.WebGLRenderer();

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width,height);
            camera.aspect = width/height;
            camera.updateProjectionMatrix();
            document.body.appendChild(renderer.domElement);
        }
        window.addEventListener('resize',handleResize);

        var xSpeed = 0.1;
        var ySpeed = 0.1;

        const onDocumentKeyDown=(event)=> {
            var keyCode = event.which;
            if (keyCode === 87) {
                bob.position.z -= ySpeed;
            } else if (keyCode === 83) {
                bob.position.z += ySpeed;
            } else if (keyCode === 65) {
                bob.position.x -= xSpeed;
            } else if (keyCode === 68) {
                bob.position.x += xSpeed;
            } else if (keyCode === 32) {
                bob.position.set(0, 0, 0);
            }
        };

        window.addEventListener("keydown", onDocumentKeyDown, false);

        return () => {
            window.removeEventListener('resize',handleResize);
        }
        // eslint-disable-next-line
    }, []);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

    const bobGeometry = new THREE.BoxGeometry();
    const bobMaterial = new THREE.MeshNormalMaterial({color:0x00ff00});

    const bob = new THREE.Mesh(bobGeometry,bobMaterial);
    scene.add(bob);

    const groundGeometry = new THREE.BoxGeometry(5,0.01,20);
    const groundMaterial = new THREE.MeshNormalMaterial({color:0x0000ff});

    const ground = new THREE.Mesh(groundGeometry,groundMaterial);
    ground.position.z = -5;
    scene.add(ground);

    const wallGeometry = new THREE.BoxGeometry(0,5,4);
    const wallMaterial = new THREE.MeshNormalMaterial({color:0x0000ff});
    scene.add(new THREE.Mesh(wallGeometry,wallMaterial));

    camera.position.z = 7;
    camera.position.y = 3;
    camera.position.x = 3;

    camera.rotation.y = 0.2;

    bob.position.y = 1;

    const animate = function(){
        requestAnimationFrame(animate);

        bob.rotation.x += 0.01;
        bob.rotation.y += 0.01;

        renderer.render(scene,camera);
    }

    animate();

    return (
      <>
      </>
    );
  }
  
  export default Game;
  
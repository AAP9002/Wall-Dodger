import './game.css';
import * as THREE from 'three';
import { useEffect,useState} from 'react';

function Game() {
    // counter for score
    const [score, setScore] = useState(0);


    // create renderer
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

        // event listener to move bob
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

    // create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

    // create bob
    const bobGeometry = new THREE.BoxGeometry();
    const bobMaterial = new THREE.MeshNormalMaterial({color:0xff0000});
    const bob = new THREE.Mesh(bobGeometry,bobMaterial);
    scene.add(bob);
    bob.position.z = 3.5;
    bob.position.y = 1;

    // create ground
    const groundGeometry = new THREE.BoxGeometry(5,0.01,40);
    const groundMaterial = new THREE.MeshLambertMaterial({color:0xff00ff});
    const ground = new THREE.Mesh(groundGeometry,groundMaterial);
    ground.position.z = -2;
    scene.add(ground);

    // create wall

    // Generate Wall Function
    const generateWall = (zPos) => {
        const wallGeometry = new THREE.BoxGeometry(5,4,0.4);
        const wallMaterial = new THREE.MeshNormalMaterial({color:0x0000ff});
        const wall = new THREE.Mesh(wallGeometry,wallMaterial);
        wall.position.z = zPos;
        wall.position.y = 2;
        scene.add(wall);
        wallList.push(wall);
    }

    const wallList = [];
    for (var i = 0; i < 10; i++) {
        generateWall((-20*i)-10);
    }

    // camera position
    camera.position.z = 8;
    camera.position.y = 4;
    camera.position.x = 3;
    camera.rotation.y = 0.2;

    //create light
    const light = new THREE.AmbientLight(0xffffff,1,1000);
    light.position.set(5,6,5);
    scene.add(light);

    // animation loop
    const animate = function(){
        requestAnimationFrame(animate);

        // bob.rotation.x += 0.01;
        // bob.rotation.y += 0.01;

        if (wallList.length > 0) {
            if (wallList[0].position.z>(bob.position.z + 0.5)){
                console.log("Wall Passed");
                setScore(score+1);
                //remove the first wall
                scene.remove(wallList[0]);
                // remove the first wall from the array and add a new wall
                wallList.shift();
                generateWall(-210);
            }
        }

        for (var i = 0; i < wallList.length; i++) {
            wallList[i].position.z += 0.01;
        }

        renderer.render(scene,camera);
    }

    animate();

    return (
      <>
        <p className='overlayText'>Score: {score}</p>
      </>
    );
  }
  
  export default Game;
  
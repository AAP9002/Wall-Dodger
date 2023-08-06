import './game.css';
import * as THREE from 'three';
import { useEffect} from 'react';

function Game() {
    // counter for score
    var gameScore = 0;
    var upVelocity = 0;
    var playing = true;

    const wallTypes = {
        0:{
            name:"Dodge Right",
            width:2,
            height:4.5,
            offGround:0,
            skew:-2,
        },
        1:{
            name:"Dodge Left",
            width:2,
            height:4.5,
            offGround:0,
            skew:2,
        },
        2:{
            name:"Duck",
            width:5,
            height:2,
            offGround:1.5,
            skew:0,
        },
        3:{
            name:"Jump",
            width:5,
            height:2,
            offGround:-1.5,
            skew:0,
        }
    }



    // create renderer
    const renderer = new THREE.WebGLRenderer();

    // create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

    // jump bob
    const jumpBob = () => {
        upVelocity = 5;
    }

    useEffect(() => {

        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild(renderer.domElement);

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
        const onDocumentKeyDown=(event)=> {
            var keyCode = event.which;
            if (keyCode === 87) {
                //bob.position.z -= ySpeed;
            } else if (keyCode === 83) {
                //bob.position.z += ySpeed;
            } else if (keyCode === 65) {
                bob.position.x -= xSpeed;
            } else if (keyCode === 68) {
                bob.position.x += xSpeed;
            } else if (keyCode === 32) {
                if (bob.position.y < 1.1 && upVelocity === 0){
                    jumpBob();
                }
            }
        };

        window.addEventListener("keydown", onDocumentKeyDown, false);

        return () => {
            window.removeEventListener('resize',handleResize);
        }
        // eslint-disable-next-line
    }, []);

    // create bob
    const bobGeometry = new THREE.BoxGeometry();
    const bobMaterial = new THREE.MeshNormalMaterial({color:0xff0000});
    const bob = new THREE.Mesh(bobGeometry,bobMaterial);
    scene.add(bob);
    bob.position.z = 3.5;
    bob.position.y = 1;

    // create ground
    const groundGeometry = new THREE.BoxGeometry(6,0.01,100);
    const groundMaterial = new THREE.MeshLambertMaterial({color:0xff00ff});
    const ground = new THREE.Mesh(groundGeometry,groundMaterial);
    ground.position.z = -20;
    scene.add(ground);

    // Generate Wall Function
    const generateWall = (zPos) => {
        // choose random wall type
        const wallInfo = wallTypes[Math.floor(Math.random() *4) ];

        const wallGeometry = new THREE.BoxGeometry(wallInfo.width,wallInfo.height,0.4);
        const wallMaterial = new THREE.MeshNormalMaterial({color:0x0000ff});
        const wall = new THREE.Mesh(wallGeometry,wallMaterial);
        wall.position.z = zPos;
        wall.position.y = 2+wallInfo.offGround;
        wall.position.x = wallInfo.skew;
        scene.add(wall);
        wallList.push(wall);

        // add action text
        actionTextList.push(wallInfo.name);
    }

    const wallList = [];
    const actionTextList = [];
    for (var i = 0; i < 10; i++) {
        generateWall((-20*i)-10);
    }

    // camera position
    camera.position.z = 9;
    camera.position.y = 4;
    camera.position.x = 3;
    camera.rotation.y = 0.2;

    //create light
    const light = new THREE.AmbientLight(0xffffff,1,1000);
    light.position.set(5,6,5);
    scene.add(light);
 

    // animation loop
    const animate = function(){
        if (playing) { 

            requestAnimationFrame(animate);

            // bob.rotation.x += 0.01;
            // bob.rotation.y += 0.01;

            // check if bob is touching any walls
            for (var x = 0; x < wallList.length; x++) {

                var width = wallList[x].geometry.parameters.width;
                var height = wallList[x].geometry.parameters.height;

                if (bob.position.z < wallList[x].position.z + 0.5 &&
                    bob.position.z > wallList[x].position.z - 0.5 &&
                    bob.position.x < wallList[x].position.x + width/2 +0.5 &&
                    bob.position.x > wallList[x].position.x - width/2 -0.5 &&
                    bob.position.y < wallList[x].position.y + height/2 +0.5 &&
                    bob.position.y > wallList[x].position.y - height/2 -0.5) {
                    console.log("Collision Detected");
                    // reset game
                    document.getElementById("idAction").style.display = "none";
                    document.getElementById("idGameOver").style.display = "block";
                    playing = false;
                }
            }

            // check if wall has passed the wall
            if (wallList.length > 0) {
                if (wallList[0].position.z>(bob.position.z + 0.5)){
                    console.log("Wall Passed");
                    gameScore += 1;
                    document.getElementById("idScore").innerHTML = "Score: " + gameScore;
                    //remove the first wall
                    scene.remove(wallList[0]);
                    // remove the first wall from the array and add a new wall
                    wallList.shift();
                    actionTextList.shift();
                    document.getElementById("idAction").innerHTML = actionTextList[0];
                    generateWall(-210);
                }
            }

            // jump
            if (upVelocity >= 1) {
                bob.position.y += 0.15 * (upVelocity/5);
                upVelocity = upVelocity*0.97;
            } else {
                upVelocity = 0;
            }

            if (upVelocity===0 && bob.position.y > 1)
            {
                bob.position.y -= 0.10;
            }

            // wall speed
            var wallSpeed = 0.05;
            if (gameScore < 5) {
                wallSpeed = 0.05;
            } else if (gameScore < 10) {
                wallSpeed = 0.1;
            } else if (gameScore < 20) {
                wallSpeed = 0.15;
            } else if (gameScore < 30) {
                wallSpeed = 0.2;
            } else if (gameScore < 40) {
                wallSpeed = 0.25;
            } else {
                wallSpeed = 0.3;
            }

            // move walls
            for (var i = 0; i < wallList.length; i++) {
                wallList[i].position.z += wallSpeed;
            }

            renderer.render(scene,camera);
        }
    }

    animate();

    return (
      <>
        <div className='overlayText'>
            <p id='idScore'>Score: {gameScore}</p>
            <p id='idAction'>
                {actionTextList[0]}
            </p>
            <p style={{color:"red", display:"none"}} id='idGameOver'>
                Game Over!
            </p>
        </div>
      </>
    );
  }
  
  export default Game;
  
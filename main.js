import './style.css';
import * as THREE from 'three';


const ASSETS = 'assets/';


const PROJECTS = new Array();

PROJECTS.push( {name:"2020 to 2023 - Roguelite Unity", videoLink: "https://www.youtube.com/embed/qJ683bBr1DA",team: "Solo project", techno: "Unity (C#)",
image: ASSETS+"projects/roguelite_unity.png",
description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
} );
PROJECTS.push( {name:"2019 - Bullet Hell", videoLink: "https://www.youtube.com/embed/tcU2ggFBnP0",team: "Team of 2", techno: "Android Studio (Java)",
image: ASSETS+"projects/bullet_hell.png",
description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
} );
PROJECTS.push( {name:"2018 - Tactic Arena", videoLink: "https://www.youtube.com/embed/f0_FKtGCT9U",team: "Team of 2", techno: "C, SDL2",
image: ASSETS+"projects/tactic.png",
description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
} );
PROJECTS.push( {name:"2017 - Roguelike C", videoLink: "https://www.youtube.com/embed/1JO7lgYu3Yo",type: "Roguelike", team: "Solo project", techno: "C, SDL2",
image: ASSETS+"projects/roguelike_C.png",
description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
} );




/************************************************************************** */
/************************************************************************** */
/************************************************************************** */


function GetRandom(){
  return ((Math.random()-0.5)*2);
}


const PROJECTS_HTML = PROJECTS.map( project => {
  let item = document.querySelector('#project-template').innerHTML;
  item = item.replace('{name}', project.name);
  item = item.replace('{videoLink}', project.videoLink);
  item = item.replace('{description}', project.description);
  item = item.replace('{techno}', project.techno);
  item = item.replace('{team}', project.team);
  return item;
})
document.querySelector('#list').innerHTML = PROJECTS_HTML.join('');


// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(0);
camera.position.setX(0);

renderer.render(scene, camera);

// Lights

const pointLight = new THREE.PointLight(0xFF9CAB);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xFF9CAB);
scene.add(pointLight, ambientLight);

// stars

function addStar() {
  let size = THREE.MathUtils.randFloat(0.2 ,0.6);
  const geometry = new THREE.BoxGeometry(size, size, size);

  let color = Math.random() < 0.5 ? 0xFF9CAB : 0x81322A;
  const material = new THREE.MeshStandardMaterial({ color: color });

  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);

  return {star: star, position: {x: x, y: y, z: z}, direction: {x: GetRandom(), y: GetRandom(), z: GetRandom()}};

}

const STARS = Array();
for(let i=1; i<200; i++){
  STARS.push(addStar());
}

// Background

const backgroundTexture = new THREE.TextureLoader().load(ASSETS+'background.png');
backgroundTexture.magFilter = THREE.NearestFilter;
backgroundTexture.minFilter = THREE.LinearMipMapLinearFilter;
backgroundTexture.center.set(0.8,0.8);
scene.background = backgroundTexture;


// Avatar

const avatarTexture = new THREE.TextureLoader().load(ASSETS+'avatar.png');
avatarTexture.magFilter = THREE.NearestFilter;
avatarTexture.minFilter = THREE.LinearMipMapLinearFilter;
const avatarMaterial = new THREE.MeshBasicMaterial({ map: avatarTexture, transparent: true });

const avatar = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), avatarMaterial);

scene.add(avatar);


const PROJECTS_ICONES = Array();
// ProjectIcones
let count = 0;
PROJECTS.forEach( (project) => {
  let textureIcone = new THREE.TextureLoader().load(project.image);
  textureIcone.magFilter = THREE.NearestFilter;
  textureIcone.minFilter = THREE.LinearMipMapLinearFilter;

  let material = new THREE.MeshBasicMaterial({ map: textureIcone, transparent: true });
  let icone = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), material);
  scene.add(icone);

  icone.position.z = 5 + 8 * count ;
  icone.position.x = 3;

  PROJECTS_ICONES.push({icone: icone, material: material});
  count+=1;
});


PROJECTS.map( project => {
  let item = document.querySelector('#project-template').innerHTML;
  item = item.replace('{name}', project.name);
  item = item.replace('{videoLink}', project.videoLink);
  item = item.replace('{description}', project.description);
  item = item.replace('{techno}', project.techno);
  return item;
})


// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  const b = document.body.getBoundingClientRect().bottom;

  const main = document.getElementById("scrollable");
  let xScrollRatio = Math.abs((-1*b) / (main.getBoundingClientRect().height));


  avatar.rotation.y = 3 * xScrollRatio;
  avatar.rotation.z = 3 * xScrollRatio;

  avatar.position.z = -5 + xScrollRatio * -30;
  avatar.position.x = 2 + xScrollRatio * 30;
  avatar.position.y = 0 + xScrollRatio * 15;

  let startOpcacityProjects = 0.2;

  let avatarOpacityTreshold = xScrollRatio/startOpcacityProjects > 1 ? 1 : xScrollRatio/startOpcacityProjects;
  avatarMaterial.opacity = 1 - avatarOpacityTreshold;


  let count = 0;
  let stepOpacity = (1-startOpcacityProjects) / PROJECTS_ICONES.length;
  PROJECTS_ICONES.forEach((icone) => {
    icone.icone.position.z = (5 + 8 * count) + xScrollRatio * -45;

    let opacityTreshold = (xScrollRatio - (startOpcacityProjects + stepOpacity * (count))) / stepOpacity;
    icone.material.opacity = 1 - opacityTreshold;
    count++;
  });

  STARS.forEach((starObj) => {
    starObj.star.position.z = starObj.position.z + xScrollRatio * -50;
  });


  //camera.position.z = t * -0.01;


  backgroundTexture.repeat.set(1 - 0.3 * xScrollRatio, 1 - 0.3 * xScrollRatio);

}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  STARS.forEach((starObj) => {
    starObj.direction.x += GetRandom() * 0.05;
    starObj.direction.y += GetRandom() * 0.05;

    starObj.star.position.x += starObj.direction.x * 0.01;
    starObj.star.position.y += starObj.direction.y * 0.01;
  });

  // controls.update();

  renderer.render(scene, camera);
}

animate();

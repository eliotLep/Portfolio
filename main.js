import './style.css';
import * as THREE from 'three';

const ASSETS = 'assets/';



const PROJECTS = new Array();

PROJECTS.push( {name:"2020 to today - Roguelite Unity", videoLink: /*"https://www.youtube.com/embed/lTOeXSGKDvo"*/ "https://www.youtube.com/embed/-3pgEYbQ0O8",
image: ASSETS+"projects/rogueliteUnity.mp4",
tags: ["👤 Solo project", "2000h+", "In progress", "Unity", "C#" , "HLSL"],
missions: ["💻 Dev", "🎨 Assets", "🎵 Audio"],
description: 
  "Explore the proceduraly generated map of the story mode to stop the proliferation of monsters or survive through nights with the arena mode."+
  " Featuring hundreds of armors, lots of unique weapons, powefull relics and more to create the ultimate character and beat the game."+
  " Monsters have increasingly stronger attack patterns when the difficulty raise, so be prepared!"
} );

PROJECTS.push( {name:"2019 - Bullet Hell", videoLink: "https://www.youtube.com/embed/tcU2ggFBnP0",
image: ASSETS+"projects/bullethell.mp4",
tags: ["👥 Team of 2", "~50h", "Android Studio", "Java"],
missions: ["💻 Dev", "🎵 Audio"],
description: 
  "Dodge increasingly complexe bullet patterns and defeat the bosses!"+
  " Play through the 12 levels and try to beat your personnal highscores."
} );

PROJECTS.push( {name:"2018 - Tactic Arena Like", videoLink: "https://www.youtube.com/embed/f0_FKtGCT9U",
image: ASSETS+"projects/tacticArena.mp4",
tags: ["👥 Team of 2", "~150h", "C", "SDL2", "No engine"],
missions: ["💻 Dev", "🎨 Assets"],
description: 
  "Play in this turn-based game against the computer or other players to defeat their armies and be the one remaining."+
  " Choose your units and start a war!"+
  " Each unit can move, attack, heal and set their block side each turn."+
  " Killing streaks provides bonuses to your units, dont let them escape!"+
  " Use the landscape and build castles or towers to help your units take the upper hand."
} );

PROJECTS.push( {name:"2017 - Roguelike C", videoLink: "https://www.youtube.com/embed/1JO7lgYu3Yo",
image: ASSETS+"projects/roguelikeC.mp4",
tags: ["👤 Solo project", "~150h", "C", "SDL2", "No engine"],
missions: ["💻 Dev", "🎨 Assets"],
description: 
"Roam through a maze of rooms and corridors and kill as many enemies as possible in the shortest time."
+" The map is huge! Dont get lost!"
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

  //TAGS
  const tags_html = project.tags.map((tag) => {
    let tags_template = document.querySelector('#tags-template').innerHTML;
    tags_template = tags_template.replace('{tag}', tag);
    return tags_template;
  });
  item = item.replace('{tags}', tags_html.join(''));

  //MISSIONS
  const missions_html = project.missions.map((mission) => {
    let missions_template = document.querySelector('#missions-template').innerHTML;
    missions_template = missions_template.replace('{mission}', mission);
    return missions_template;
  });
  item = item.replace('{missions}', missions_html.join(''));


  return item;
})
document.querySelector('#list').innerHTML = PROJECTS_HTML.join('');





// SETUP

const clock = new THREE.Clock(true);

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

  let color = Math.random() < 0.5 ? 0x100000 : 0x200000;
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

const backgroundTexture = new THREE.Color(0x0F0000);
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
  // Create video and play
  let textureVid = document.createElement("video");
  textureVid.muted = true;
  textureVid.crossOrigin = 'anonymous';
  textureVid.src = project.image;
  textureVid.loop = true;
  textureVid.play();

  // Load video texture
  let videoTexture = new THREE.VideoTexture(textureVid);
  videoTexture.format = THREE.RGBAFormat;
  //videoTexture.format = THREE.RGBFormat;
  videoTexture.minFilter = THREE.NearestFilter;
  videoTexture.maxFilter = THREE.NearestFilter;
  videoTexture.generateMipmaps = false;

  let textureSide = new THREE.TextureLoader().load(ASSETS+"side.png");
  textureSide.magFilter = THREE.NearestFilter;
  textureSide.minFilter = THREE.LinearMipMapLinearFilter;

  let material = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true});
  let blackMaterial = new THREE.MeshBasicMaterial({ map: textureSide, transparent: true});
  let icone = new THREE.Mesh(new THREE.BoxGeometry(4, 2.25, 3), [blackMaterial, blackMaterial, blackMaterial, blackMaterial, material, blackMaterial]);
  scene.add(icone);

  icone.position.z = 5 + 8 * count ;
  icone.position.x = 3;


  icone.rotation.y = -0.2;

  

  PROJECTS_ICONES.push({icone: icone, materials: [material, blackMaterial]});
  count+=1;
});


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

    let opacityTreshold = (xScrollRatio - (startOpcacityProjects + stepOpacity * (count+0.2))) / stepOpacity;
    icone.materials.forEach((mat) => {
      mat.opacity = 1 - opacityTreshold;
    });
    
    count++;
  });

  STARS.forEach((starObj) => {
    starObj.star.position.z = starObj.position.z + xScrollRatio * -50;
  });


  //camera.position.z = t * -0.01;


  //backgroundTexture.repeat.set(1 - 0.3 * xScrollRatio, 1 - 0.3 * xScrollRatio);

}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);
  clock.getDelta();
  

  STARS.forEach((starObj) => {
    starObj.direction.x += GetRandom() * 0.05;
    starObj.direction.y += GetRandom() * 0.05;

    starObj.star.rotation.x += starObj.direction.x * 0.02;
    starObj.star.rotation.y += starObj.direction.y * 0.02;

    starObj.star.position.x += starObj.direction.x * 0.01;
    starObj.star.position.y += starObj.direction.y * 0.01;
  });


  PROJECTS_ICONES.forEach((icone) => {
    icone.icone.position.y += Math.sin(clock.elapsedTime * 2) * 0.003;

    //icone.icone.rotation.y +=  0.001;
    icone.icone.rotation.x += Math.sin(clock.elapsedTime * 1) * 0.001;
  });

  // controls.update();

  renderer.render(scene, camera);
}

animate();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let rect = canvas.getBoundingClientRect();
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let camera = { x: 1350, y: 0, zoom: 1.0 };
const keys = {};
const planetTextures = {};

const minZoom = 0.5;
const maxZoom = 3.0;

let velocity = { x: 0, y: 0 };
let rotation = 0;
let targetRotation = 0;
let currentRotation = 0;
const rotationSpeed = 0.1;

function bakeTexture(obj, size) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = obj.textureUrl;
    img.onload = () => {
        const offscreen = document.createElement('canvas');
        const canvasSize = size * 2 + 20;
        offscreen.width = canvasSize;
        offscreen.height = canvasSize;
        const octx = offscreen.getContext('2d');
        octx.drawImage(img, 10, 10, size * 2, size * 2);
        planetTextures[obj.name] = offscreen;
    };
}

GALAXY_DATA.forEach(planet => {
    if (planet.textureUrl) bakeTexture(planet, planet.size);

    if (planet.moons) {
        planet.moons.forEach(moon => {
            if (moon.textureUrl) {
                bakeTexture(moon, 5); 
            }
        });
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") selectedPlanet = null;
});

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === "w" || e.key === "W") keys['ArrowUp'] = true;
    if (e.key === "s" || e.key === "S") keys['ArrowDown'] = true;
    if (e.key === "a" || e.key === "A") keys['ArrowLeft'] = true;
    if (e.key === "d" || e.key === "D") keys['ArrowRight'] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === "w" || e.key === "W") keys['ArrowUp'] = false;
    if (e.key === "s" || e.key === "S") keys['ArrowDown'] = false;
    if (e.key === "a" || e.key === "A") keys['ArrowLeft'] = false;
    if (e.key === "d" || e.key === "D") keys['ArrowRight'] = false;
});

window.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomAmount = 0.1;
    if (e.deltaY > 0) {
        camera.zoom -= zoomAmount;
    } else {
        camera.zoom += zoomAmount;
    }

    camera.zoom = Math.max(0.1, Math.min(camera.zoom, 5.0));
}, {passive: false });

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rect = canvas.getBoundingClientRect();
});

let isMoving = false;
let selectedPlanet = null;
let gameActive = false;

document.getElementById('launch-btn').addEventListener('click', () => {
    gameActive = true;
    SpaceAudio.init();
    document.getElementById('menu').classList.add('hidden');
});

canvas.addEventListener('click', (e) => {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const btnSize = 30;

    const audioX = canvas.width - 130;
    const audioY = canvas.height - 50;
    if (mx >= audioX && my >= audioY) {
        if (mx < audioX + 40) SpaceAudio.prevTrack();
        else if (mx < audioX + 80) SpaceAudio.togglePlay();
        else SpaceAudio.nextTrack();
        return; 
    }

    const worldX = (e.clientX - rect.left - canvas.width / 2) / camera.zoom + camera.x;
    const worldY = (e.clientY - rect.top - canvas.height / 2) / camera.zoom + camera.y;

    let clickedAnything = false;
    GALAXY_DATA.forEach(planet => {
        const dist = Math.hypot(worldX - planet.x, worldY - planet.y);
        if (dist < planet.size + 20) {
            selectedPlanet = planet;
            clickedAnything = true;
        }
    });

    if (!clickedAnything) selectedPlanet = null;
});

let particles = [];
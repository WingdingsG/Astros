let player = { x: 1350, y: 0 };
let particleWait = 0;
const shipColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
const shipAccent = `hsl(${Math.random() * 360}, 100%, 20%)`;

function update() {
    const isBoosting = keys['Shift'];
    const currentSpeed = isBoosting ? 8 : 2;

    velocity.x = 0;
    velocity.y = 0;

    if (keys['ArrowUp']) velocity.y = -currentSpeed;
    if (keys['ArrowDown']) velocity.y = currentSpeed;
    if (keys['ArrowLeft']) velocity.x = -currentSpeed;
    if (keys['ArrowRight']) velocity.x = currentSpeed;

    player.x += velocity.x;
    player.y += velocity.y;
    camera.x = player.x;
    camera.y = player.y;

    if (velocity.x !== 0 || velocity.y !== 0) {
        targetRotation = Math.atan2(velocity.y, velocity.x);
        createThrusterParticle(isBoosting); 
    }

    let diff = targetRotation - currentRotation;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    
    const turnEase = isBoosting ? 0.15 : 0.1; 
    currentRotation += diff * turnEase;

    const time = Date.now() * 0.0001;

    GALAXY_DATA.forEach((p, index) => {
        if (p.name === "Sun") return;

        const distance = Math.hypot(p.x, p.y);
        const orbitSpeed = 1 / Math.sqrt(distance) * 5; 

        p.x = Math.cos(time * index * orbitSpeed) * distance;
        p.y = Math.sin(time * index * orbitSpeed) * distance;
    });
}

function createThrusterParticle(isBoosting) {
    const count = isBoosting ? 4 : 1;
    
    if (particleWait === 3 || isBoosting) {
        const spread = isBoosting ? 1.0 : 0.5; 
        const randomAngle = currentRotation + (Math.random() - 0.5) * spread;

        const offset = (Math.random() - 0.5) * 10;
        const pX = player.x + Math.cos(currentRotation + Math.PI/2) * offset;
        const pY = player.y + Math.sin(currentRotation + Math.PI/2) * offset;

        const speedBase = isBoosting ? 2 : .25;
        const speedRandom = speedBase * (0.5 + Math.random());

        particles.push({
            x: pX, 
            y: pY,
            vx: -Math.cos(randomAngle) * speedRandom,
            vy: -Math.sin(randomAngle) * speedRandom,
            life: 1.0,
            size: (Math.random() * 4 + 2),
            color: isBoosting ? "rgba(0, 255, 255," : "rgba(255, 100, 0,"
        });
        particleWait = 0;
    } else {
        particleWait++;
    }
}

function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx || 0;
        p.y += p.vy || 0;
        p.life -= 0.005;

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        ctx.fillStyle = p.color + p.life + ")"; 
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawRocket() {
    ctx.save();
    ctx.translate(camera.x, camera.y); 
    ctx.rotate(currentRotation);
    
    const isBoosting = keys['Shift'];
    ctx.shadowBlur = isBoosting ? 40 : 20;
    ctx.shadowColor = isBoosting ? "#00f2ff" : "#0066ff";

    ctx.fillStyle = shipAccent;
    ctx.beginPath();
    ctx.moveTo(-5, -12); ctx.lineTo(-15, -15); ctx.lineTo(-8, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-5, 12); ctx.lineTo(-15, 15); ctx.lineTo(-8, 0);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = shipColor; 
    ctx.beginPath();
    ctx.moveTo(22, 0); 
    ctx.lineTo(-12, -11);
    ctx.lineTo(-12, 11);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(5, 0, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawStar (star){
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(star.dist, Math.tan(star.angle) * star.dist, star.size, 0, Math.PI * 2);
    ctx.fill();
}

function drawDust(dust) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    let gradient = ctx.createRadialGradient(
        dust.x, dust.y, 0, 
        dust.x, dust.y, dust.size
    );
    gradient.addColorStop(0, `hsla(${dust.hue}, 100%, 70%, ${dust.opacity})`);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawAsteroid (asteroid){
    asteroid.angle += asteroid.speed;
    let ax = Math.cos(asteroid.angle) * asteroid.dist - camera.x + (canvas.width / 2);
    let ay = Math.sin(asteroid.angle) * asteroid.dist - camera.y + (canvas.height / 2);
    
    ctx.fillStyle = "#888";
    ctx.fillRect(ax, ay, asteroid.size, asteroid.size);
}

function drawCorners (ctx, bX, bY, boxSize, cornerLen){
    ctx.beginPath();
    ctx.moveTo(bX, bY + cornerLen); ctx.lineTo(bX, bY); ctx.lineTo(bX + cornerLen, bY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bX + boxSize - cornerLen, bY); ctx.lineTo(bX + boxSize, bY); ctx.lineTo(bX + boxSize, bY + cornerLen);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bX + boxSize, bY + boxSize - cornerLen); ctx.lineTo(bX + boxSize, bY + boxSize); ctx.lineTo(bX + boxSize - cornerLen, bY + boxSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bX + cornerLen, bY + boxSize); ctx.lineTo(bX, bY + boxSize); ctx.lineTo(bX, bY + boxSize - cornerLen);
    ctx.stroke();
}

function drawInfoIcon (ctx, bX, bY, boxSize, flicker) {
    ctx.fillStyle = `rgba(0, 255, 255, ${flicker})`;
    ctx.beginPath();
    ctx.arc(bX + boxSize/2, bY + 7, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(bX + boxSize/2 - 0.75, bY + 11, 1.5, 7);
}

function getLineCount(ctx, text, maxWidth) {
    let words = text.split(' ');
    let line = '';
    let count = 1;
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            line = words[n] + ' ';
            count++;
        } else {
            line = testLine;
        }
    }
    return count;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
                    } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

function drawDetailedPanel(ctx, planet, bX, bY, boxSize, flicker) {
    const maxWidth = 200;
    const lineHeight = 16;
    const descLines = getLineCount(ctx, planet.description, maxWidth);
    const descriptionHeight = descLines * lineHeight;

    const winH = 165 + (descLines * lineHeight); 
    const winW = 250;
    const winX = bX + 50; 
    const winY = bY - (winH / 2);

    ctx.save();
    
    ctx.fillStyle = "rgba(0, 15, 25, 0.95)";
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "cyan";
    
    ctx.fillRect(winX, winY, winW, winH);
    ctx.strokeRect(winX, winY, winW, winH);
    ctx.shadowBlur = 0;

    let ty = winY + 30;
    ctx.fillStyle = "cyan";
    ctx.font = "bold 16px monospace";
    ctx.fillText(planet.name.toUpperCase(), winX + 20, ty);

    ctx.font = "11px monospace";
    ty += 35;
    ctx.fillText(">> DISTANCE: " + Math.round(Math.hypot(planet.x, planet.y)) + " AU", winX + 20, ty);
    ty += 20;
    ctx.fillText(">> GRAVITY:  " + planet.stats.gravity, winX + 20, ty);
    ty += 20;
    ctx.fillText(">> MOONS:    " + (planet.stats.moons ? planet.stats.moons : 0), winX + 20, ty);

    ty += 15;
    ctx.strokeStyle = "rgba(0, 255, 255, 0.3)";
    ctx.beginPath(); 
    ctx.moveTo(winX + 20, ty); 
    ctx.lineTo(winX + winW - 20, ty); 
    ctx.stroke();

    ctx.fillStyle = "rgba(0, 255, 255, 0.9)";
    const finalY = wrapText(ctx, planet.description, winX + 20, ty + 20, maxWidth, lineHeight);
    
    ctx.font = "8px monospace";
    ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
    ctx.fillText("[PRESS ESC TO CLOSE]", winX + 20, finalY + 28);

    ctx.restore();
}

function drawPlanet(planet){
    ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);

    let rocketX = canvas.width / 2;
    let rocketY = canvas.height / 2;

    const distance = Math.hypot(planet.x - rocketX, planet.y - rocketY);
    const visibilityThreshold = 600 / camera.zoom;
    let effectiveSize = planet.size * camera.zoom;

    let sunX = 0 - camera.x + (canvas.width / 2);
    let sunY = 0 - camera.y + (canvas.height / 2);

    const orbitRadius = Math.hypot(planet.x, planet.y);
    ctx.beginPath();
    ctx.arc(0, 0, orbitRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1 / camera.zoom;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();

    const labelBoxSize = 16;
    const labelX = planet.x + planet.size + 15;
    const labelY = planet.y - 8;
    const dist = Math.hypot(camera.x - planet.x, camera.y - planet.y);
    if (dist < 300) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "cyan";
        ctx.fillStyle = "cyan";
        
        let labelFlicker = Math.random() > (dist / 600 * 0.5) ? 1.0 : 0.2;

        const padding = 10;
        const lineStart = planet.size + padding;
        const lineLength = planet.size * 0.8 + 20;
        const lineStartRadius = planet.size + 15;
        const angle = -Math.PI / 4;

        let startX = planet.x + (lineStart * 0.7);
        let startY = planet.y - (lineStart * 0.7);
        const elbowX = startX + 20;
        const elbowY = startY - 20;
        const shelfWidth = planet.size * 0.5 + 40; 
        const shelfEndX = elbowX + shelfWidth;

        const boxSize = 24;
        const cornerLen = 6;
        const bX = shelfEndX;
        const bY = elbowY - (boxSize / 2);

        ctx.strokeStyle = `rgba(0, 255, 255, ${labelFlicker})`;
        ctx.fillStyle = `rgba(0, 255, 255, ${labelFlicker})`;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(shelfEndX, elbowY);
        ctx.stroke();

        ctx.strokeRect(labelX, labelY, labelBoxSize, labelBoxSize);
        drawCorners(ctx, labelX, labelY, labelBoxSize, 4);

        ctx.beginPath();
        ctx.arc(labelX + labelBoxSize/2, labelY + labelBoxSize/2, 1.5, 0, Math.PI * 2);
        ctx.fill();

        drawCorners(ctx, bX, bY, boxSize, cornerLen);
        drawInfoIcon(ctx, bX, bY, boxSize, labelFlicker)

        if (selectedPlanet === planet) {
            drawDetailedPanel(ctx, planet, bX, bY, boxSize, labelFlicker);
        } else {
        }

        ctx.font = "bold 11px monospace";
        ctx.shadowBlur = labelFlicker > 0.5 ? 8 : 0;
        ctx.shadowColor = "cyan";
        ctx.fillText(planet.name.toUpperCase(), labelX + labelBoxSize + 8, labelY + 12);
        ctx.restore();
    }

    const img = planetTextures[planet.name];

    if (img) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
        ctx.clip();

        
        ctx.drawImage(
            img, 
            planet.x - planet.size - 10,
            planet.y - planet.size - 10, 
            planet.size * 2 + 20, 
            planet.size * 2 + 20
        );
        ctx.restore();
    } else {
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();
    }

    if (planet.name === "Sun") {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        let sunGlow = ctx.createRadialGradient(planet.x, planet.y, planet.size, planet.x, planet.y, planet.size * 2);
        sunGlow.addColorStop(0, "rgba(255, 150, 0, 0.4)");
        sunGlow.addColorStop(1, "rgba(255, 50, 0, 0)");
        
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    ctx.save();
    if (planet.name === "Sun") {
        ctx.shadowBlur = 50;
        ctx.shadowColor = "#ffcc00";
    } else if (planet.name == "Saturn") {
        ctx.strokeStyle = "rgba(197, 171, 110, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(planet.x, planet.y, planet.size * 2.2, planet.size * 0.8, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = "rgba(197, 171, 110, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(planet.x, planet.y, planet.size * 1.8, planet.size * 0.6, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}

function drawAudioHUD(ctx) {
    if (!gameActive) return;

    const x = canvas.width - 120;
    const y = canvas.height - 50;
    const btnSize = 30;
    const spacing = 10;

    ctx.save();
    ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
    ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
    ctx.font = "10px monospace";

    let trackName = SpaceAudio.playlist[SpaceAudio.currentIndex].toUpperCase();
    trackName = trackName.split('/').pop();
    trackName = trackName.split('?')[0];
    trackName = decodeURIComponent(trackName);
    trackName = trackName.replace('.MP3', '');
    ctx.fillText("TRACK: " + trackName, x - 18, y - 10);

    drawButtonBox(ctx, x, y, btnSize);
    drawTriangle(ctx, x + 20, y + 15, -10);

    drawButtonBox(ctx, x + btnSize + spacing, y, btnSize);
    if (SpaceAudio.isPlaying) {
        ctx.fillStyle = "rgba(0, 255, 255, 1.0)";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "cyan"

        ctx.fillRect(x + 49, y + 8, 4, 14); 
        ctx.fillRect(x + 57, y + 8, 4, 14);
    
        ctx.shadowBlur = 0;
    } else {
        drawTriangle(ctx, x + 48, y + 15, 10);
    }

    drawButtonBox(ctx, x + (btnSize + spacing) * 2, y, btnSize);
    drawTriangle(ctx, x + 90, y + 15, 10);

    ctx.restore();
}

function drawButtonBox(ctx, x, y, size) {
    ctx.strokeRect(x, y, size, size);
    ctx.fillStyle = "rgba(0, 255, 255, 0.05)";
    ctx.fillRect(x, y, size, size);
}

function drawTriangle(ctx, x, y, width) {
    ctx.beginPath();
    ctx.moveTo(x, y - 7);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x, y + 7);
    ctx.closePath();
    ctx.fillStyle = "cyan";
    ctx.fill();
}

function drawTargetingHUD(ctx, planet) {
    const margin = 20;
    const size = 60;
    const centerX = margin + size / 2;
    const centerY = margin + size / 2;
    const miniSize = 20;

    ctx.save();
    
    ctx.strokeStyle = "#00f2ff";
    ctx.lineWidth = 2;
    ctx.strokeRect(margin, margin, size, size);

    const img = planetTextures[planet.name];

    if (img && (img.complete || img.tagName === 'CANVAS')) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, miniSize, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(
            img, 
            centerX - miniSize, 
            centerY - miniSize, 
            miniSize * 2, 
            miniSize * 2
        );
        ctx.restore();
    } else {
        ctx.fillStyle = planet.color || "blue";
        ctx.beginPath();
        ctx.arc(centerX, centerY, miniSize, 0, Math.PI * 2);
        ctx.fill();
    }

    if (planet.name === "Saturn") {
        ctx.strokeStyle = "rgba(197, 171, 110, 0.8)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, miniSize * 2.2, miniSize * 0.8, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.fillStyle = "cyan";
    ctx.font = "bold 12px monospace";
    ctx.fillText("TARGET ACQUIRED", margin, margin + size + 15);
    ctx.fillText(planet.name.toUpperCase(), margin, margin + size + 30);
    
    ctx.restore();
}

function gameLoop() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameActive) {
        update(); 

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(camera.zoom, camera.zoom);
        ctx.translate(-camera.x, -camera.y);

        stars.forEach(drawStar);
        spaceDust.forEach(drawDust);
        GALAXY_DATA.forEach(drawPlanet);
        drawParticles();
        drawRocket();
        ctx.restore();

        if (selectedPlanet) {
            drawTargetingHUD(ctx, selectedPlanet);
        }
        drawAudioHUD(ctx);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
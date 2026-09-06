const stars = Array.from({ length: 1200 }, () => ({
    dist: Math.random() * 10000 - 5000,
    angle: Math.random() * 2 * Math.PI,
    size: Math.random()
}));

const spaceDust = Array.from({ length: 750 }, () => ({
    x: Math.random() * 25000 - 12500,
    y: Math.random() * 25000 - 12500,
    size: Math.random() * 2250 + 750,
    hue: [180, 240, 280, 320][Math.floor(Math.random() * 4)],
    opacity: Math.random() * 0.02 + 0.004
}));


const asteroids = Array.from({ length: 200 }, () => {
    const dist = 2000 + Math.random() * 200;
    const angle = Math.random() * Math.PI * 2;
    return {
        dist: dist,
        angle: angle,
        speed: 0.0005 + Math.random() * 0.001,
        size: Math.random() * 2 + 1
    };
});

const GALAXY_DATA = [
    {
        name: "Sun",
        x: 0, y: 0,
        size: 150, color: "#fff3cf",
        textureUrl: "Sources/sun_texture.jpg",
        description: "A G-type main-sequence star. Contains 99.8% of the total mass in the Solar System.",
        stats: { gravity: "274 m/s^2", moons: "All of them" }
    },
    {
        name: "Mercury",
        x: 400, y: -200,
        size: 15, color: "#a5a5a5",
        textureUrl: "Sources/mercury_texture.jpg",
        description: "The smallest and fastest planet. A scorched, cratered world with no atmosphere.",
        stats: { gravity: "3.7 m/s^2", moons: 0 }
    },
    {
        name: "Venus",
        x: 750, y: 400,
        size: 35, color: "#e3bb76",
        textureUrl: "Sources/venus_texture.jpg",
        description: "Earth's 'Evil Twin'. Thick sulfuric acid clouds create a runaway greenhouse effect.",
        stats: { gravity: "8.87 m/s^2", moons: 0 }
    },
    {
        name: "Earth",
        x: 1200, y: 0,
        size: 38, color: "#2271b3",
        textureUrl: "Sources/earth_texture.jpg",
        description: "The only known planet to harbor life. 71% of the surface is liquid water.",
        stats: { gravity: "9.81 m/s^2", moons: 1 }
    },
    {
        name: "Mars",
        x: 1600, y: -600,
        size: 22, color: "#ff4500",
        textureUrl: "Sources/mars_texture.jpg",
        description: "The Red Planet. Home to Olympus Mons, the largest volcano in the solar system.",
        stats: { gravity: "3.71 m/s^2", moons: 2 }
    },
    {
        name: "Jupiter",
        x: 2500, y: 800,
        size: 85, color: "#d39c7e",
        textureUrl: "Sources/jupiter_texture.jpg",
        description: "The King of Planets. A gas giant so large that all other planets could fit inside it.",
        stats: { gravity: "24.79 m/s^2", moons: 115 }
    },
    {
        name: "Saturn",
        x: 3500, y: -300,
        size: 70, color: "#c5ab6e",
        textureUrl: "Sources/saturn_texture.jpg",
        description: "The Ringed Jewel. Famous for its massive ring system made of ice and rock.",
        stats: { gravity: "10.44 m/s^2", moons: 146 }
    },
    {
        name: "Uranus",
        x: 4500, y: 1200,
        size: 50, color: "#b5e1e2",
        textureUrl: "Sources/uranus_texture.jpg",
        description: "An ice giant that rotates on its side. Its atmosphere contains water and ammonia ices.",
        stats: { gravity: "8.69 m/s^2", moons: 28 }
    },
    {
        name: "Neptune",
        x: 5500, y: -400,
        size: 48, color: "#3f54ba",
        textureUrl: "Sources/neptune_texture.jpg",
        description: "The windiest planet. Winds can reach speeds of 2,100 km/h in its dark, cold atmosphere.",
        stats: { gravity: "11.15 m/s^2", moons: 16 }
    },
];
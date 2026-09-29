import { useState, useEffect, useRef, useCallback } from 'react';

interface Planet {
  name: string;
  nameRu: string;
  radius: number; // visual radius in pixels
  orbitRadius: number; // orbit radius in pixels
  color: string;
  realRadius: string; // real radius
  distanceFromSun: string;
  orbitalPeriod: string;
  speed: number; // angular speed
  angle: number;
  description: string;
}

const initialPlanets: Planet[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    radius: 4,
    orbitRadius: 60,
    color: '#b5b5b5',
    realRadius: '2 439 км',
    distanceFromSun: '57,9 млн км',
    orbitalPeriod: '88 дней',
    speed: 0.04,
    angle: Math.random() * Math.PI * 2,
    description: 'Ближайшая к Солнцу планета. Самая маленькая планета Солнечной системы.',
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    radius: 7,
    orbitRadius: 95,
    color: '#e8cda0',
    realRadius: '6 052 км',
    distanceFromSun: '108,2 млн км',
    orbitalPeriod: '225 дней',
    speed: 0.015,
    angle: Math.random() * Math.PI * 2,
    description: 'Вторая планета от Солнца. Самая горячая планета из-за парникового эффекта.',
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    radius: 8,
    orbitRadius: 135,
    color: '#4da6ff',
    realRadius: '6 371 км',
    distanceFromSun: '149,6 млн км',
    orbitalPeriod: '365,25 дней',
    speed: 0.01,
    angle: Math.random() * Math.PI * 2,
    description: 'Третья планета от Солнца. Единственная известная планета с жизнью.',
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    radius: 6,
    orbitRadius: 175,
    color: '#e85d3a',
    realRadius: '3 390 км',
    distanceFromSun: '227,9 млн км',
    orbitalPeriod: '687 дней',
    speed: 0.008,
    angle: Math.random() * Math.PI * 2,
    description: 'Четвёртая планета от Солнца. Красная планета с двумя спутниками.',
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    radius: 18,
    orbitRadius: 240,
    color: '#d4a574',
    realRadius: '69 911 км',
    distanceFromSun: '778,5 млн км',
    orbitalPeriod: '11,86 лет',
    speed: 0.004,
    angle: Math.random() * Math.PI * 2,
    description: 'Пятая и крупнейшая планета. Газовый гигант с Большим красным пятном.',
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    radius: 15,
    orbitRadius: 310,
    color: '#f0d890',
    realRadius: '58 232 км',
    distanceFromSun: '1 434 млн км',
    orbitalPeriod: '29,46 лет',
    speed: 0.003,
    angle: Math.random() * Math.PI * 2,
    description: 'Шестая планета. Известна своими великолепными кольцами из льда и камня.',
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    radius: 11,
    orbitRadius: 370,
    color: '#7de8e8',
    realRadius: '25 362 км',
    distanceFromSun: '2 871 млн км',
    orbitalPeriod: '84,01 лет',
    speed: 0.002,
    angle: Math.random() * Math.PI * 2,
    description: 'Седьмая планета. Ледяной гигант, вращающийся «на боку».',
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    radius: 10,
    orbitRadius: 420,
    color: '#4169e1',
    realRadius: '24 622 км',
    distanceFromSun: '4 495 млн км',
    orbitalPeriod: '164,8 лет',
    speed: 0.001,
    angle: Math.random() * Math.PI * 2,
    description: 'Восьмая и самая далёкая планета. Ледяной гигант с сильнейшими ветрами.',
  },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const planetsRef = useRef<Planet[]>(initialPlanets.map(p => ({ ...p })));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const starsRef = useRef<{ x: number; y: number; size: number; opacity: number }[]>([]);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Generate stars
  useEffect(() => {
    const stars: { x: number; y: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }
    starsRef.current = stars;
  }, []);

  const drawSolarSystem = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    starsRef.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });

    // Draw orbits
    planetsRef.current.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Sun
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
    sunGradient.addColorStop(0, '#fff7a0');
    sunGradient.addColorStop(0.3, '#ffdd00');
    sunGradient.addColorStop(0.7, '#ff8c00');
    sunGradient.addColorStop(1, '#ff4500');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 60);
    glowGradient.addColorStop(0, 'rgba(255, 200, 0, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    planetsRef.current.forEach((planet) => {
      const x = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const y = centerY + Math.sin(planet.angle) * planet.orbitRadius;

      // Planet glow if hovered
      if (hoveredPlanet === planet.name) {
        const hoverGlow = ctx.createRadialGradient(x, y, planet.radius, x, y, planet.radius + 10);
        hoverGlow.addColorStop(0, planet.color + '80');
        hoverGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, planet.radius + 10, 0, Math.PI * 2);
        ctx.fillStyle = hoverGlow;
        ctx.fill();
      }

      // Planet body
      const planetGradient = ctx.createRadialGradient(
        x - planet.radius * 0.3,
        y - planet.radius * 0.3,
        0,
        x,
        y,
        planet.radius
      );
      planetGradient.addColorStop(0, '#ffffff');
      planetGradient.addColorStop(0.3, planet.color);
      planetGradient.addColorStop(1, shadeColor(planet.color, -40));
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planetGradient;
      ctx.fill();

      // Saturn's ring
      if (planet.name === 'Saturn') {
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius + 8, 4, Math.PI * 0.1, 0, Math.PI * 2);
        ctx.strokeStyle = '#f0d890aa';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Planet name label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(planet.nameRu, x, y - planet.radius - 6);
    });
  }, [hoveredPlanet]);

  const animate = useCallback(() => {
    if (isPlayingRef.current) {
      planetsRef.current.forEach((planet) => {
        planet.angle += planet.speed * speedRef.current;
      });
    }
    drawSolarSystem();
    animationRef.current = requestAnimationFrame(animate);
  }, [drawSolarSystem]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  // Handle click on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let clickedPlanet: Planet | null = null;
    planetsRef.current.forEach((planet) => {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.radius + 8) {
        clickedPlanet = { ...planet };
      }
    });

    setSelectedPlanet(clickedPlanet);
  };

  // Handle mouse move for hover effect
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let found = false;
    planetsRef.current.forEach((planet) => {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.radius + 8) {
        setHoveredPlanet(planet.name);
        canvas.style.cursor = 'pointer';
        found = true;
      }
    });
    if (!found) {
      setHoveredPlanet(null);
      canvas.style.cursor = 'default';
    }
  };

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="text-center py-3 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 border-b border-white/10">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          🌌 Интерактивная Солнечная система
        </h1>
        <p className="text-sm text-gray-400 mt-1">Нажмите на планету для получения информации</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="w-full h-full"
          />
        </div>

        {/* Info Panel */}
        {selectedPlanet && (
          <div className="absolute top-4 right-4 w-80 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-2xl z-10 animate-fade-in">
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full shadow-lg"
                style={{
                  background: `radial-gradient(circle at 30% 30%, #fff, ${selectedPlanet.color})`,
                }}
              />
              <div>
                <h2 className="text-xl font-bold text-white">{selectedPlanet.nameRu}</h2>
                <p className="text-sm text-gray-400">{selectedPlanet.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">{selectedPlanet.description}</p>
            <div className="space-y-3">
              <InfoRow icon="📏" label="Радиус" value={selectedPlanet.realRadius} />
              <InfoRow icon="☀️" label="Расстояние от Солнца" value={selectedPlanet.distanceFromSun} />
              <InfoRow icon="🔄" label="Орбитальный период" value={selectedPlanet.orbitalPeriod} />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900/90 border-t border-white/10 px-4 py-3 flex flex-wrap items-center justify-center gap-4 md:gap-8">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-500/25"
        >
          {isPlaying ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Пауза
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Воспроизвести
            </>
          )}
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium">Скорость:</span>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-32 md:w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-white font-mono text-sm min-w-[3rem] text-center bg-gray-800 px-2 py-1 rounded">
            {speed.toFixed(1)}x
          </span>
        </div>

        {/* Speed Presets */}
        <div className="flex gap-2">
          {[0.5, 1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                speed === s
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
    </div>
  );
}

function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

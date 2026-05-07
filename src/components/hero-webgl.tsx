import { Canvas, extend, useFrame } from "@react-three/fiber"
import { useAspect, useTexture } from "@react-three/drei"
import { useMemo, useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

const TEXTUREMAP = { src: "https://i.postimg.cc/XYwvXN8D/img-4.png" }
const DEPTHMAP = { src: "https://i.postimg.cc/2SHKQh2q/raw-4.webp" }

extend(THREE as unknown as Record<string, unknown>)

const WIDTH = 300
const HEIGHT = 300

const CITIES = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург",
  "Казань", "Нижний Новгород", "Челябинск", "Самара",
  "Уфа", "Ростов-на-Дону", "Краснодар", "Пермь",
]

const TRANSPORT_TYPES = [
  { id: "truck",   label: "Фура",    emoji: "🚛", pricePerKm: 45,  weightRate: 12, volumeRate: 8  },
  { id: "barge",   label: "Баржа",   emoji: "🚢", pricePerKm: 18,  weightRate: 5,  volumeRate: 3  },
  { id: "railway", label: "ЖД",      emoji: "🚂", pricePerKm: 28,  weightRate: 8,  volumeRate: 5  },
  { id: "air",     label: "Авиа",    emoji: "✈️", pricePerKm: 180, weightRate: 60, volumeRate: 40 },
]

const EXTRA_SERVICES = [
  { id: "loaders",   label: "Грузчики",             emoji: "💪", price: 3500,  unit: "чел/день" },
  { id: "gazelle",   label: "Газель",                emoji: "🚐", price: 4500,  unit: "смена"    },
  { id: "logist",    label: "Логист по точкам",      emoji: "🗺️", price: 8000,  unit: "день"     },
  { id: "packaging", label: "Упаковка / обрешётка",  emoji: "📦", price: 2500,  unit: "место"    },
]

const CITY_DISTANCES: Record<string, Record<string, number>> = {
  "Москва": { "Санкт-Петербург": 710, "Новосибирск": 3350, "Екатеринбург": 1790, "Казань": 820, "Нижний Новгород": 410, "Челябинск": 1910, "Самара": 1060, "Уфа": 1340, "Ростов-на-Дону": 1080, "Краснодар": 1360, "Пермь": 1480 },
  "Санкт-Петербург": { "Москва": 710, "Новосибирск": 3810, "Екатеринбург": 2390, "Казань": 1530, "Нижний Новгород": 1120, "Челябинск": 2560, "Самара": 1770, "Уфа": 2040, "Ростов-на-Дону": 1790, "Краснодар": 2080, "Пермь": 2060 },
  "Новосибирск": { "Москва": 3350, "Санкт-Петербург": 3810, "Екатеринбург": 1430, "Казань": 2530, "Нижний Новгород": 2930, "Челябинск": 1750, "Самара": 2590, "Уфа": 2100, "Ростов-на-Дону": 3250, "Краснодар": 3540, "Пермь": 2000 },
  "Екатеринбург": { "Москва": 1790, "Санкт-Петербург": 2390, "Новосибирск": 1430, "Казань": 970, "Нижний Новгород": 1380, "Челябинск": 215, "Самара": 1140, "Уфа": 680, "Ростов-на-Дону": 2330, "Краснодар": 2570, "Пермь": 360 },
  "Казань": { "Москва": 820, "Санкт-Петербург": 1530, "Новосибирск": 2530, "Екатеринбург": 970, "Нижний Новгород": 410, "Челябинск": 1160, "Самара": 460, "Уфа": 530, "Ростов-на-Дону": 1330, "Краснодар": 1620, "Пермь": 660 },
  "Нижний Новгород": { "Москва": 410, "Санкт-Петербург": 1120, "Новосибирск": 2930, "Екатеринбург": 1380, "Казань": 410, "Челябинск": 1560, "Самара": 650, "Уфа": 1060, "Ростов-на-Дону": 1210, "Краснодар": 1500, "Пермь": 1090 },
  "Челябинск": { "Москва": 1910, "Санкт-Петербург": 2560, "Новосибирск": 1750, "Екатеринбург": 215, "Казань": 1160, "Нижний Новгород": 1560, "Самара": 1050, "Уфа": 420, "Ростов-на-Дону": 2230, "Краснодар": 2440, "Пермь": 510 },
  "Самара": { "Москва": 1060, "Санкт-Петербург": 1770, "Новосибирск": 2590, "Екатеринбург": 1140, "Казань": 460, "Нижний Новгород": 650, "Челябинск": 1050, "Уфа": 640, "Ростов-на-Дону": 1000, "Краснодар": 1300, "Пермь": 810 },
  "Уфа": { "Москва": 1340, "Санкт-Петербург": 2040, "Новосибирск": 2100, "Екатеринбург": 680, "Казань": 530, "Нижний Новгород": 1060, "Челябинск": 420, "Самара": 640, "Ростов-на-Дону": 1750, "Краснодар": 2020, "Пермь": 480 },
  "Ростов-на-Дону": { "Москва": 1080, "Санкт-Петербург": 1790, "Новосибирск": 3250, "Екатеринбург": 2330, "Казань": 1330, "Нижний Новгород": 1210, "Челябинск": 2230, "Самара": 1000, "Уфа": 1750, "Краснодар": 290, "Пермь": 2000 },
  "Краснодар": { "Москва": 1360, "Санкт-Петербург": 2080, "Новосибирск": 3540, "Екатеринбург": 2570, "Казань": 1620, "Нижний Новгород": 1500, "Челябинск": 2440, "Самара": 1300, "Уфа": 2020, "Ростов-на-Дону": 290, "Пермь": 2240 },
  "Пермь": { "Москва": 1480, "Санкт-Петербург": 2060, "Новосибирск": 2000, "Екатеринбург": 360, "Казань": 660, "Нижний Новгород": 1090, "Челябинск": 510, "Самара": 810, "Уфа": 480, "Ростов-на-Дону": 2000, "Краснодар": 2240 },
}

function getDistance(from: string, to: string): number {
  if (from === to) return 0
  return CITY_DISTANCES[from]?.[to] ?? CITY_DISTANCES[to]?.[from] ?? 500
}

function calcPrice(from: string, to: string, weight: number, volume: number, transportId: string): number {
  const km = getDistance(from, to)
  if (km === 0) return 0
  const t = TRANSPORT_TYPES.find(t => t.id === transportId) ?? TRANSPORT_TYPES[0]
  const base = km * t.pricePerKm
  const weightCost = weight * t.weightRate * Math.ceil(km / 100)
  const volumeCost = volume * t.volumeRate * Math.ceil(km / 100)
  return Math.round(base + weightCost + volumeCost)
}

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src])
  const meshRef = useRef<THREE.Mesh>(null)

  const material = useMemo(() => {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform sampler2D uDepthMap;
      uniform vec2 uPointer;
      uniform float uProgress;
      uniform float uTime;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;
        float depth = texture2D(uDepthMap, uv).r;
        vec2 displacement = depth * uPointer * 0.01;
        vec2 distortedUv = uv + displacement;
        vec4 baseColor = texture2D(uTexture, distortedUv);
        float aspect = ${WIDTH}.0 / ${HEIGHT}.0;
        vec2 tUv = vec2(uv.x * aspect, uv.y);
        vec2 tiling = vec2(120.0);
        vec2 tiledUv = mod(tUv * tiling, 2.0) - 1.0;
        float brightness = noise(tUv * tiling * 0.5);
        float dist = length(tiledUv);
        float dot = smoothstep(0.5, 0.49, dist) * brightness;
        float flow = 1.0 - smoothstep(0.0, 0.02, abs(depth - uProgress));
        vec3 mask = vec3(dot * flow * 10.0, 0.0, 0.0);
        vec3 final = baseColor.rgb + mask;
        gl_FragColor = vec4(final, 1.0);
      }
    `

    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: rawMap },
        uDepthMap: { value: depthMap },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uProgress: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    })
  }, [rawMap, depthMap])

  const [w, h] = useAspect(WIDTH, HEIGHT)

  useFrame(({ clock, pointer }) => {
    if (material.uniforms) {
      material.uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5
      material.uniforms.uPointer.value = pointer
      material.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  const scaleFactor = 0.3
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  )
}

function CheckButton({ selected, onClick, emoji, label, sublabel }: {
  selected: boolean; onClick: () => void; emoji: string; label: string; sublabel?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-space-mono border transition-all cursor-pointer ${
        selected
          ? "bg-red-500 border-red-500 text-white"
          : "bg-black/60 border-red-500/30 text-gray-300 hover:border-red-500/60"
      }`}
    >
      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
        selected ? "border-white bg-white" : "border-gray-500"
      }`}>
        {selected && <span className="text-red-500 text-[10px] font-bold leading-none">✓</span>}
      </span>
      <span>{emoji}</span>
      <span>{label}</span>
      {sublabel && <span className={`text-xs ${selected ? "text-red-100" : "text-gray-500"}`}>{sublabel}</span>}
    </button>
  )
}

function PriceCalculator() {
  const [from, setFrom] = useState("Москва")
  const [to, setTo] = useState("Санкт-Петербург")
  const [weight, setWeight] = useState(500)
  const [volume, setVolume] = useState(5)
  const [transport, setTransport] = useState("truck")
  const [extras, setExtras] = useState<Set<string>>(new Set())
  const [calculated, setCalculated] = useState(false)
  const [price, setPrice] = useState(0)
  const [extrasPrice, setExtrasPrice] = useState(0)

  const toOptions = CITIES.filter(c => c !== from)

  const toggleExtra = (id: string) => {
    setExtras(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
    setCalculated(false)
  }

  const handleCalculate = () => {
    const base = calcPrice(from, to, weight, volume, transport)
    const extraTotal = EXTRA_SERVICES
      .filter(s => extras.has(s.id))
      .reduce((sum, s) => sum + s.price, 0)
    setPrice(base)
    setExtrasPrice(extraTotal)
    setCalculated(true)
  }

  const handleFromChange = (val: string) => {
    setFrom(val)
    if (to === val) setTo(CITIES.find(c => c !== val) || "Санкт-Петербург")
    setCalculated(false)
  }

  const selectedTransport = TRANSPORT_TYPES.find(t => t.id === transport)!
  const totalPrice = price + extrasPrice

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/70 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-red-400 text-xs font-space-mono mb-1 uppercase tracking-wider">Откуда</label>
          <div className="relative">
            <Icon name="MapPin" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 z-10" />
            <select
              value={from}
              onChange={e => handleFromChange(e.target.value)}
              className="w-full bg-black/80 border border-red-500/30 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm font-space-mono appearance-none focus:outline-none focus:border-red-500 cursor-pointer"
            >
              {CITIES.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-red-400 text-xs font-space-mono mb-1 uppercase tracking-wider">Куда</label>
          <div className="relative">
            <Icon name="Navigation" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 z-10" />
            <select
              value={to}
              onChange={e => { setTo(e.target.value); setCalculated(false) }}
              className="w-full bg-black/80 border border-red-500/30 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm font-space-mono appearance-none focus:outline-none focus:border-red-500 cursor-pointer"
            >
              {toOptions.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-red-400 text-xs font-space-mono mb-1 uppercase tracking-wider">
            Вес груза: <span className="text-white">{weight.toLocaleString("ru-RU")} кг</span>
          </label>
          <div className="flex items-center gap-3">
            <Icon name="Weight" size={16} className="text-red-500 shrink-0" />
            <input
              type="range"
              min={50}
              max={100000}
              step={100}
              value={weight}
              onChange={e => { setWeight(Number(e.target.value)); setCalculated(false) }}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-gray-500 text-xs font-space-mono mt-1">
            <span>50 кг</span><span>100 000 кг</span>
          </div>
        </div>

        <div>
          <label className="block text-red-400 text-xs font-space-mono mb-1 uppercase tracking-wider">
            Объём: <span className="text-white">{volume.toLocaleString("ru-RU")} м³</span>
          </label>
          <div className="flex items-center gap-3">
            <Icon name="Package" size={16} className="text-red-500 shrink-0" />
            <input
              type="range"
              min={1}
              max={10000}
              step={10}
              value={volume}
              onChange={e => { setVolume(Number(e.target.value)); setCalculated(false) }}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-gray-500 text-xs font-space-mono mt-1">
            <span>1 м³</span><span>10 000 м³</span>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-red-400 text-xs font-space-mono mb-2 uppercase tracking-wider">
            Тип транспорта
          </label>
          <div className="flex gap-2 flex-wrap">
            {TRANSPORT_TYPES.map(t => (
              <CheckButton
                key={t.id}
                selected={transport === t.id}
                onClick={() => { setTransport(t.id); setCalculated(false) }}
                emoji={t.emoji}
                label={t.label}
              />
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-red-400 text-xs font-space-mono mb-2 uppercase tracking-wider">
            Дополнительные услуги
          </label>
          <div className="flex gap-2 flex-wrap">
            {EXTRA_SERVICES.map(s => (
              <CheckButton
                key={s.id}
                selected={extras.has(s.id)}
                onClick={() => toggleExtra(s.id)}
                emoji={s.emoji}
                label={s.label}
                sublabel={`+${s.price.toLocaleString("ru-RU")} ₽/${s.unit}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button
          onClick={handleCalculate}
          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-orbitron text-sm px-8 py-3 border-0"
        >
          Рассчитать стоимость
        </Button>

        {calculated && (
          <div className="flex flex-col gap-0.5 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="text-gray-400 text-sm font-space-mono">от</div>
              <div className="text-2xl font-bold text-white font-orbitron">
                {totalPrice.toLocaleString("ru-RU")} ₽
              </div>
              <div className="text-gray-400 text-xs font-space-mono">
                ~{getDistance(from, to)} км · {selectedTransport.emoji} {selectedTransport.label}
              </div>
            </div>
            {extrasPrice > 0 && (
              <div className="text-gray-500 text-xs font-space-mono pl-8">
                доставка {price.toLocaleString("ru-RU")} ₽ + услуги {extrasPrice.toLocaleString("ru-RU")} ₽
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const Hero3DWebGL = () => {
  const titleWords = "Ваш Логист".split(" ")
  const subtitle = "Расчёт стоимости и заказ авто с грузчиками — за 5 минут."
  const [visibleWords, setVisibleWords] = useState(0)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [calcVisible, setCalcVisible] = useState(false)
  const [delays, setDelays] = useState<number[]>([])
  const [subtitleDelay, setSubtitleDelay] = useState(0)

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07))
    setSubtitleDelay(Math.random() * 0.1)
  }, [titleWords.length])

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 800)
      return () => clearTimeout(timeout)
    }
  }, [visibleWords, titleWords.length])

  useEffect(() => {
    if (subtitleVisible) {
      const timeout = setTimeout(() => setCalcVisible(true), 600)
      return () => clearTimeout(timeout)
    }
  }, [subtitleVisible])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />
      </div>

      <div className="min-h-screen uppercase items-center w-full absolute z-[60] px-6 flex justify-center flex-col pt-20 pb-16">
        <div className="text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold font-orbitron">
          <div className="flex space-x-2 lg:space-x-6 overflow-hidden text-white">
            {titleWords.map((word, index) => (
              <div
                key={index}
                className={index < visibleWords ? "fade-in" : ""}
                style={{
                  animationDelay: `${index * 0.13 + (delays[index] || 0)}s`,
                  opacity: index < visibleWords ? undefined : 0,
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs md:text-lg xl:text-xl 2xl:text-2xl mt-2 overflow-hidden text-white font-bold max-w-4xl mx-auto text-center px-4 normal-case">
          <div
            className={subtitleVisible ? "fade-in-subtitle" : ""}
            style={{
              animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`,
              opacity: subtitleVisible ? undefined : 0,
            }}
          >
            {subtitle}
          </div>
        </div>

        {calcVisible && (
          <div className="w-full normal-case pointer-events-auto fade-in-subtitle">
            <PriceCalculator />
          </div>
        )}
      </div>

      <div className="h-screen">
        <Canvas
          flat
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 1] }}
          style={{ background: "#000000", height: "100vh" }}
        >
          <Scene />
        </Canvas>
      </div>
    </div>
  )
}

export default Hero3DWebGL
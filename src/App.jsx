import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

// Paste the iframe `src` value from Yandex Music: Share -> HTML code.
const YANDEX_MUSIC_EMBED_URL = "";
const VIDEO_LINKS = {
  welcome: "https://www.dropbox.com/scl/fi/7pj31uvzpliv55uwezvj5/01-welcome.mp4?rlkey=r32vazgq3aumy0om7g42zql6x&st=ed7as0m9&raw=1",
  childhood: "https://www.dropbox.com/scl/fi/txxm759tukn9vjv4bnz6o/02-childhood.mp4?rlkey=xieanyf2wy07pmj8xlq1bjzf6&st=imcu2v50&raw=1",
  strength: "https://www.dropbox.com/scl/fi/qs4ctfquh81pnf2wlw07b/03-strength.mp4?rlkey=dk3uq3mim60m6otfirkugifdm&st=5pll8uk7&raw=1",
  final: "https://www.dropbox.com/scl/fi/4anra6kkghlakk7jdg2b7/04-final-main.mp4?rlkey=r2w3pmchm1dv4rz2mk5bktxyh&st=vbwsyh81&raw=1",
};

const slides = [
  {
    id: "welcome",
    videoKey: "welcome",
    eyebrow: "Шаг 01",
    heading: (
      <>
        С днем рождения, <span className="handwritten">Масечка</span>.
      </>
    ),
    lines: [
      "Мы тебя очень любим. Ты наше все.",
      "Спасибо тебе за жизнь, за любовь, за тепло, которым ты наполнила наш мир.",
      "Сегодня все это только для тебя.",
    ],
    videoUrl: VIDEO_LINKS.welcome,
    buttonLabel: "Начать",
    accentA: "#f2f2f2",
    accentB: "#d8d8d8",
    videoFilter: "grayscale(100%) contrast(1.08)",
    meshScale: 0.9,
    meshColors: ["#f8f8f8", "#ececec", "#e3e3e3", "#d9d9d9"],
  },
  {
    id: "childhood",
    videoKey: "childhood",
    eyebrow: "Шаг 02",
    heading: (
      <>
        Ты самая <span className="handwritten">невероятная</span>.
      </>
    ),
    lines: [
      "Самая храбрая. Самая сильная. Самая нежная.",
      "Ты всегда шла вперед ради нас и никогда не переставала любить.",
      "Именно благодаря тебе и твоим стараниям мы стали теми, кем являемся.",
    ],
    videoUrl: VIDEO_LINKS.childhood,
    buttonLabel: "Дальше",
    accentA: "#28b8ff",
    accentB: "#16e085",
    videoFilter: "saturate(1.08)",
    meshScale: 1,
    meshColors: ["#88e0ff", "#53f0c4", "#41a4ff", "#f5ffe9"],
  },
  {
    id: "strength",
    videoKey: "strength",
    eyebrow: "Шаг 03",
    heading: (
      <>
        Ты наш дом и наша <span className="handwritten">сила</span>.
      </>
    ),
    lines: [
      "Все самое важное в нас началось с тебя.",
      "Твоя забота, твое терпение и твое большое сердце всегда будут внутри нас.",
      "Спасибо тебе за каждую жертву, за каждое усилие и за каждую тихую победу.",
    ],
    videoUrl: VIDEO_LINKS.strength,
    buttonLabel: "Еще",
    accentA: "#3f7bff",
    accentB: "#ffb703",
    videoFilter: "saturate(1.1)",
    meshScale: 1.08,
    meshColors: ["#6f9dff", "#ffd56a", "#5bc5ff", "#ff9f68"],
  },
  {
    id: "final",
    videoKey: "final",
    eyebrow: "Шаг 04",
    heading: (
      <>
        С днем рождения, наша <span className="handwritten">любимая</span>.
      </>
    ),
    lines: [
      "Масечка, мы тебя бесконечно любим.",
      "Спасибо, что ты у нас есть. Спасибо, что ты именно такая.",
      "Ты наше все. Всегда.",
    ],
    videoUrl: VIDEO_LINKS.final,
    buttonLabel: "Начать заново",
    accentA: "#27d3ff",
    accentB: "#ff5d8f",
    videoFilter: "saturate(1.18)",
    meshScale: 1.16,
    meshColors: ["#5be6ff", "#ff83aa", "#90fff3", "#e8f0ff"],
  },
];

const meshOrbs = [
  { id: "orb-1", x: "6%", y: "8%", size: 370, driftX: 34, driftY: 28, duration: 18 },
  { id: "orb-2", x: "38%", y: "64%", size: 300, driftX: -26, driftY: 24, duration: 21 },
  { id: "orb-3", x: "64%", y: "20%", size: 360, driftX: 30, driftY: -20, duration: 24 },
  { id: "orb-4", x: "82%", y: "70%", size: 340, driftX: -32, driftY: -28, duration: 20 },
  { id: "orb-5", x: "24%", y: "38%", size: 260, driftX: 20, driftY: -18, duration: 16 },
];

function PlyrVideo({ src, filter, onError }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) {
      return undefined;
    }

    const player = new Plyr(videoRef.current, {
      autoplay: true,
      clickToPlay: false,
      controls: [],
      fullscreen: { enabled: false, iosNative: false },
      hideControls: true,
      keyboard: { focused: false, global: false },
      loop: { active: true },
      muted: true,
      tooltips: { controls: false, seek: false },
    });

    player.muted = true;
    player.loop = true;
    player.play().catch(() => {});

    return () => {
      player.destroy();
    };
  }, []);

  return (
    <div className="memory-player">
      <video
        ref={videoRef}
        className="memory-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ filter }}
        onError={onError}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

function YandexMusicPlayer() {
  const embedUrl = YANDEX_MUSIC_EMBED_URL.trim();

  if (!embedUrl) {
    return (
      <div className="playlist-placeholder">
        <p>Вставь ссылку на embed-плеер Яндекс Музыки сюда:</p>
        <code>YANDEX_MUSIC_EMBED_URL</code>
        <p className="playlist-help">
          В `src/App.jsx` вставь значение `src` из Share → HTML code.
        </p>
      </div>
    );
  }

  return (
    <div className="yandex-embed-shell">
      <iframe
        className="yandex-embed-frame"
        src={embedUrl}
        title="Yandex Music playlist"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen"
        loading="eager"
      />
    </div>
  );
}

function App() {
  const [step, setStep] = useState(0);
  const [videoFailed, setVideoFailed] = useState({});
  const [bootReady, setBootReady] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const preloaderVideosRef = useRef([]);
  const currentSlide = slides[step];
  const currentVideoUrl = currentSlide.videoUrl.trim();

  const isLastStep = step === slides.length - 1;
  const stepText = useMemo(
    () => `${String(step + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`,
    [step],
  );
  const preloadableVideoUrls = useMemo(
    () => [...new Set(slides.map((slide) => slide.videoUrl.trim()).filter(Boolean))],
    [],
  );
  const preloadPercent = preloadableVideoUrls.length
    ? Math.round((preloadProgress / preloadableVideoUrls.length) * 100)
    : 100;

  useEffect(() => {
    const cleanupVideos = [];
    const loadedUrls = new Set();
    const initialUrl = slides[0].videoUrl.trim() || preloadableVideoUrls[0];

    if (!initialUrl) {
      setBootReady(true);
      return undefined;
    }

    const markLoaded = (url) => {
      if (loadedUrls.has(url)) {
        return;
      }

      loadedUrls.add(url);
      setPreloadProgress(loadedUrls.size);
    };

    const markBootReady = (url) => {
      if (url === initialUrl) {
        setBootReady(true);
      }
    };

    const fallbackTimer = window.setTimeout(() => {
      setBootReady(true);
    }, 9000);

    preloadableVideoUrls.forEach((url) => {
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = url;

      const onLoaded = () => {
        markLoaded(url);
        markBootReady(url);
      };

      const onError = () => {
        markLoaded(url);
        markBootReady(url);
      };

      video.addEventListener("loadeddata", onLoaded, { once: true });
      video.addEventListener("canplaythrough", onLoaded, { once: true });
      video.addEventListener("error", onError, { once: true });
      video.load();

      preloaderVideosRef.current.push(video);
      cleanupVideos.push(() => {
        video.removeEventListener("loadeddata", onLoaded);
        video.removeEventListener("canplaythrough", onLoaded);
        video.removeEventListener("error", onError);
        video.src = "";
        video.load();
      });
    });

    return () => {
      window.clearTimeout(fallbackTimer);
      cleanupVideos.forEach((cleanup) => cleanup());
      preloaderVideosRef.current = [];
    };
  }, [preloadableVideoUrls]);

  const onAdvance = () => {
    setStep((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="page"
      style={{
        "--accent-a": currentSlide.accentA,
        "--accent-b": currentSlide.accentB,
      }}
    >
      {!bootReady ? (
        <div className="boot-loader">
          <div className="boot-loader__inner">
            <p className="boot-loader__eyebrow">Подготавливаем воспоминания</p>
            <h1 className="boot-loader__title">Загружаем видео для плавного просмотра</h1>
            <div className="boot-loader__bar">
              <motion.span
                className="boot-loader__bar-fill"
                animate={{ width: `${preloadPercent}%` }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>
            <p className="boot-loader__meta">{preloadPercent}%</p>
          </div>
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          className="color-burst"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.45, scale: 1.1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>

      <div className="mesh-layer" aria-hidden="true">
        {meshOrbs.map((orb, index) => {
          const color = currentSlide.meshColors[index % currentSlide.meshColors.length];
          const nextScale = currentSlide.meshScale * (index % 2 === 0 ? 1 : 0.88);

          return (
            <motion.span
              key={orb.id}
              className="mesh-orb"
              style={{ left: orb.x, top: orb.y }}
              animate={{
                x: [-orb.driftX, orb.driftX, -orb.driftX * 0.45, -orb.driftX],
                y: [-orb.driftY, orb.driftY * 0.7, orb.driftY, -orb.driftY],
                scale: [0.92, 1.03, 0.97, 1.01],
                opacity: [0.18, 0.38, 0.24, 0.33],
                width: orb.size * nextScale,
                height: orb.size * nextScale,
                backgroundColor: color,
              }}
              transition={{
                x: { duration: orb.duration, repeat: Infinity, ease: "easeInOut" },
                y: { duration: orb.duration * 1.15, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: orb.duration * 0.7, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: orb.duration * 0.6, repeat: Infinity, ease: "easeInOut" },
                width: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                height: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                backgroundColor: { duration: 1.2, ease: "easeInOut" },
              }}
            />
          );
        })}
      </div>

      <section className={`text-pane${isLastStep ? " has-playlist" : ""}`}>
        <motion.p
          key={`eyebrow-${currentSlide.id}`}
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          {currentSlide.eyebrow}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${currentSlide.id}`}
            className="title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {currentSlide.heading}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`body-${currentSlide.id}`}
            className="copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            {currentSlide.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className={`playlist-panel${isLastStep ? " is-visible" : ""}`}>
          <p className="playlist-heading">
            Можешь остаться послушать музыку,
            <span className="handwritten"> любим тебя</span>.
          </p>
          <YandexMusicPlayer />
        </div>

        <div className={`controls${isLastStep ? " final-controls" : ""}`}>
          <button className="advance" onClick={onAdvance} type="button">
            {currentSlide.buttonLabel}
          </button>

          <p className="step-indicator">{stepText}</p>
        </div>

      </section>

      <section className="video-pane">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSlide.id}-${currentVideoUrl || "empty"}`}
            className="memory-video-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {currentVideoUrl ? (
              <PlyrVideo
                src={currentVideoUrl}
                filter={currentSlide.videoFilter}
                onError={() =>
                  setVideoFailed((prev) => ({ ...prev, [currentSlide.id]: true }))
                }
              />
            ) : (
              <div className="video-fallback video-link-placeholder">
                <p>Вставь ссылку на видео сюда:</p>
                <code>{`VIDEO_LINKS.${currentSlide.videoKey}`}</code>
                <p className="video-help">
                  Файл для редактирования: `src/App.jsx`
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {currentVideoUrl && videoFailed[currentSlide.id] ? (
          <div className="video-fallback">
            <p>Проверь ссылку на видео:</p>
            <code>{currentVideoUrl}</code>
            <p className="video-help">
              Она должна вести прямо на видеофайл и открываться без блокировки.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default App;

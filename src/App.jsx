import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

const YANDEX_MUSIC_EMBED_URL = "https://music.yandex.com/iframe/playlist/zoomzoober/1033";

// Gate embed: no autoplay — user taps play on the real player widget.
// iOS Safari allows audio because the gesture is INSIDE the iframe itself.
const GATE_MUSIC_URL = YANDEX_MUSIC_EMBED_URL.trim();

// Final embed: autoplay=1 — injected synchronously inside the "Войти" gesture handler.
// iOS Safari propagates user-activation to iframes created synchronously in a gesture.
const AUTOPLAY_MUSIC_URL = (() => {
  const url = YANDEX_MUSIC_EMBED_URL.trim();
  if (!url) return "";
  try {
    const u = new URL(url);
    u.searchParams.set("autoplay", "1");
    return u.toString();
  } catch {
    return url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;
  }
})();

const VIDEO_LINKS = {
  welcome: "https://www.dropbox.com/scl/fi/ddf5llr1dknxlpocdsk4d/01-welcome_compressed.mp4?rlkey=048j762bdvgnrxxftj0ynhnwm&st=ix8twyap&raw=1",
  childhood: "https://www.dropbox.com/scl/fi/mfiutgiuic1tw8c6rxx8p/02-childhood_compressed.mp4?rlkey=huliarufpqy2z8h3tslwg8xme&st=clt9t2z2&raw=1",
  strength: "https://www.dropbox.com/scl/fi/s6sm7h84t5n888bltwq0d/03-strength_compressed.mp4?rlkey=rs77y7z44irbh3zlryo9krby3&st=wghicn5x&raw=1",
  final: "https://www.dropbox.com/scl/fi/rgu4wzhkgxaszbnmh7mer/04-final-main_compressed.mp4?rlkey=rms66btrpmt2zykdeb9casi0x&st=oieq36ye&raw=1",
};

const slides = [
  {
    id: "welcome",
    videoKey: "welcome",
    eyebrow: "01",
    heading: (
      <>
        С днем рождения, <span className="handwritten">Масечка</span>.
      </>
    ),
    lines: [
      "Мы тебя очень любим. Ты наше все.",
      "Спасибо тебе за жизнь, за любовь, за тепло, которым ты наполнила наш мир.",
    ],
    videoUrl: VIDEO_LINKS.welcome,
    buttonLabel: "Начать",
    accentA: "#f2f2f2",
    accentB: "#d8d8d8",
    videoFilter: "grayscale(100%) contrast(1.08)",
    meshColors: ["#f8f8f8", "#ececec", "#e3e3e3", "#d9d9d9"],
  },
  {
    id: "childhood",
    videoKey: "childhood",
    eyebrow: "02",
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
    meshColors: ["#88e0ff", "#53f0c4", "#41a4ff", "#f5ffe9"],
  },
  {
    id: "strength",
    videoKey: "strength",
    eyebrow: "03",
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
    meshColors: ["#6f9dff", "#ffd56a", "#5bc5ff", "#ff9f68"],
  },
  {
    id: "final",
    videoKey: "final",
    eyebrow: "04",
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

function App() {
  const [step, setStep] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [videoFailed, setVideoFailed] = useState({});
  const [bootReady, setBootReady] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  // Shown after a short delay — nudges user to tap play on the embed first
  const [showEnterButton, setShowEnterButton] = useState(false);

  const preloaderVideosRef = useRef([]);
  // Container for the final-slide iframe. Injected synchronously in onEnterSite
  // so iOS Safari's user-activation token (from the "Войти" tap) propagates to it.
  const musicFinalRef = useRef(null);
  const musicFinalInjectedRef = useRef(false);

  const currentSlide = slides[step];
  const currentVideoUrl = currentSlide.videoUrl.trim();

  const isLastStep = step === slides.length - 1;
  const preloadableVideoUrls = useMemo(
    () => [...new Set(slides.map((slide) => slide.videoUrl.trim()).filter(Boolean))],
    [],
  );
  const preloadPercent = preloadableVideoUrls.length
    ? Math.round((preloadProgress / preloadableVideoUrls.length) * 100)
    : 100;

  // Video preloading
  useEffect(() => {
    let isCancelled = false;
    const cleanupVideos = [];
    const loadedUrls = new Set();
    const initialUrl = slides[0].videoUrl.trim() || preloadableVideoUrls[0];

    if (!initialUrl) {
      setBootReady(true);
      return undefined;
    }

    const markLoaded = (url) => {
      if (loadedUrls.has(url)) return;
      loadedUrls.add(url);
      setPreloadProgress(loadedUrls.size);
    };

    const markBootReady = (url) => {
      if (url === initialUrl) setBootReady(true);
    };

    const fallbackTimer = window.setTimeout(() => {
      setBootReady(true);
    }, 9000);

    const preloadVideo = (url) =>
      new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        video.src = url;

        const finish = () => {
          markLoaded(url);
          markBootReady(url);
          resolve();
        };

        const onLoaded = () => finish();
        const onError = () => finish();

        const timeoutId = window.setTimeout(() => finish(), 12000);

        video.addEventListener("loadeddata", onLoaded, { once: true });
        video.addEventListener("canplay", onLoaded, { once: true });
        video.addEventListener("error", onError, { once: true });
        video.load();

        preloaderVideosRef.current.push(video);
        cleanupVideos.push(() => {
          window.clearTimeout(timeoutId);
          video.removeEventListener("loadeddata", onLoaded);
          video.removeEventListener("canplay", onLoaded);
          video.removeEventListener("error", onError);
          video.src = "";
          video.load();
        });
      });

    const runPreloadQueue = async () => {
      const firstIndex = preloadableVideoUrls.findIndex((url) => url === initialUrl);
      const orderedUrls =
        firstIndex === -1
          ? preloadableVideoUrls
          : [
              preloadableVideoUrls[firstIndex],
              ...preloadableVideoUrls.filter((url) => url !== initialUrl),
            ];

      for (const url of orderedUrls) {
        if (isCancelled) break;
        await preloadVideo(url);
      }
    };

    runPreloadQueue();

    return () => {
      isCancelled = true;
      window.clearTimeout(fallbackTimer);
      cleanupVideos.forEach((cleanup) => cleanup());
      preloaderVideosRef.current = [];
    };
  }, [preloadableVideoUrls]);

  // Delay showing the "Войти" button so user sees and interacts with the player first
  useEffect(() => {
    if (!bootReady) return undefined;
    const timer = window.setTimeout(() => setShowEnterButton(true), 2200);
    return () => window.clearTimeout(timer);
  }, [bootReady]);

  const onEnterSite = () => {
    // Inject the final-slide iframe synchronously within this user-gesture handler.
    // iOS Safari propagates user-activation to cross-origin iframes created
    // synchronously inside a touch/click handler — so ?autoplay=1 will work.
    if (AUTOPLAY_MUSIC_URL && musicFinalRef.current && !musicFinalInjectedRef.current) {
      musicFinalInjectedRef.current = true;
      const iframe = document.createElement("iframe");
      iframe.src = AUTOPLAY_MUSIC_URL;
      iframe.className = "yandex-embed-frame";
      iframe.title = "Yandex Music playlist";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; fullscreen");
      musicFinalRef.current.appendChild(iframe);
    }
    setHasEntered(true);
  };

  const onAdvance = () => {
    setStep((prev) => (prev + 1) % slides.length);
  };

  const stepDots = slides.map((s, i) => (
    <span
      key={s.id}
      className={`step-dot${i === step ? " active" : ""}${i < step ? " done" : ""}`}
    />
  ));

  return (
    <div
      className="page"
      style={{
        "--accent-a": currentSlide.accentA,
        "--accent-b": currentSlide.accentB,
      }}
    >
      {/* Loading screen */}
      <AnimatePresence>
        {!bootReady && (
          <motion.div
            className="boot-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="boot-loader__inner">
              <div className="boot-loader__icon">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <motion.p
                className="boot-loader__meta"
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {preloadPercent}%
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro gate — shows the Yandex Music embed so user taps play directly */}
      <AnimatePresence>
        {bootReady && !hasEntered && (
          <motion.div
            className="intro-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="intro-gate__inner">
              <motion.p
                className="intro-gate__eyebrow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                Для тебя
              </motion.p>

              {/* Music player + handwritten annotation */}
              <motion.div
                className="gate-player-wrap"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                {/*
                  Handwritten annotation — pointer-events: none so taps pass through
                  to the iframe. The SVG arrow curves from the label toward the
                  left side of the embed where the track play buttons live.
                */}
                <div className="gate-annotation" aria-hidden="true">
                  <span className="gate-annotation__text">Мася, жмякни сюда</span>
                  <svg
                    className="gate-annotation__arrow"
                    viewBox="0 0 100 65"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 88,8 C 68,4 28,18 12,50"
                      stroke="rgba(255,255,255,0.68)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 4,44 L 12,50 L 19,43"
                      stroke="rgba(255,255,255,0.68)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="yandex-embed-shell">
                  <iframe
                    className="yandex-embed-frame"
                    src={GATE_MUSIC_URL}
                    title="Yandex Music playlist"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen"
                    loading="eager"
                  />
                </div>
              </motion.div>

              {/* Enter button — delayed so user sees and interacts with the player first */}
              <AnimatePresence>
                {showEnterButton && (
                  <motion.button
                    className="gate-enter-btn"
                    onClick={onEnterSite}
                    type="button"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Войти
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mesh background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          className="color-burst"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.35, scale: 1.1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>

      <div className="mesh-layer" aria-hidden="true">
        {meshOrbs.map((orb, index) => {
          const color = currentSlide.meshColors[index % currentSlide.meshColors.length];
          return (
            <motion.span
              key={orb.id}
              className="mesh-orb"
              style={{ left: orb.x, top: orb.y }}
              animate={{
                x: [-orb.driftX, orb.driftX, -orb.driftX * 0.45, -orb.driftX],
                y: [-orb.driftY, orb.driftY * 0.7, orb.driftY, -orb.driftY],
                scale: [0.92, 1.03, 0.97, 1.01],
                opacity: [0.12, 0.28, 0.18, 0.24],
                width: orb.size,
                height: orb.size,
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

      {/* Text panel */}
      <section className={`text-pane${isLastStep ? " has-playlist" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide.id}`}
            className="text-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">{currentSlide.eyebrow}</p>
            <h1 className="title">{currentSlide.heading}</h1>
            <div className="copy">
              {currentSlide.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className={`playlist-panel${isLastStep ? " is-visible" : ""}`}>
          <p className="playlist-heading">
            Можешь остаться послушать музыку,
            <span className="handwritten"> любим тебя</span>.
          </p>
          {/*
            musicFinalRef container — always in the DOM (playlist-panel is always rendered,
            just CSS-hidden). The iframe is injected synchronously in onEnterSite so it
            carries iOS Safari's user-activation from the "Войти" tap.
          */}
          <div ref={musicFinalRef} className="yandex-embed-shell" />
        </div>

        <div className={`controls${isLastStep ? " final-controls" : ""}`}>
          <button className="advance" onClick={onAdvance} type="button">
            {currentSlide.buttonLabel}
          </button>
          <div className="step-dots">{stepDots}</div>
        </div>
      </section>

      {/* Video panel — only rendered after user enters so autoplay policy is satisfied */}
      <section className="video-pane">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSlide.id}-${currentVideoUrl || "empty"}`}
            className="memory-video-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
          >
            {hasEntered && currentVideoUrl ? (
              <PlyrVideo
                src={currentVideoUrl}
                filter={currentSlide.videoFilter}
                onError={() =>
                  setVideoFailed((prev) => ({ ...prev, [currentSlide.id]: true }))
                }
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {currentVideoUrl && videoFailed[currentSlide.id] && (
          <div className="video-fallback">
            <p>Проверь ссылку на видео:</p>
            <code>{currentVideoUrl}</code>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;

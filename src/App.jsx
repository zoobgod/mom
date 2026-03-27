import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

// No ?autoplay=1 on the gate — user taps play themselves inside the iframe,
// which is a direct gesture in the iframe's own browsing context (iOS allows it).
const GATE_MUSIC_URL = "https://music.yandex.com/iframe/playlist/zoomzoober/1033";

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

function PlyrVideo({ src, filter, muted, onError }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return undefined;

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
    playerRef.current = player;

    return () => { player.destroy(); playerRef.current = null; };
  }, []);

  // Sync muted state directly on the native video element.
  // Bypassing Plyr is intentional: player.muted triggers Plyr internals
  // (setVolume, updateVolume, storage writes) and player.volume = 1 causes
  // iOS Safari to reconfigure its audio session, which steals focus from the
  // Yandex Music iframe and kills the music. Native .muted toggle is silent
  // to the OS audio session and doesn't interrupt other audio sources.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

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
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);

  const preloaderVideosRef = useRef([]);

  // ── Music float refs ───────────────────────────────────
  // The iframe lives in musicFloatRef — a persistent fixed div that NEVER
  // unmounts. We reposition it over different placeholder divs as the user
  // moves through the experience:
  //   'gate'   → over gatePlaceholderRef (inside the intro gate)
  //   'hidden' → off-screen (audio keeps playing, iframe stays alive)
  //   'final'  → over finalPlaceholderRef (inside the playlist panel)
  const musicFloatRef = useRef(null);
  const gatePlaceholderRef = useRef(null);
  const finalPlaceholderRef = useRef(null);
  // Tracks current music float state without stale-closure issues
  const musicStateRef = useRef("gate");
  // Once the float is sized from the gate placeholder, we never change
  // width/height again — iOS Safari may restart media on container resize.
  const floatSizedRef = useRef(false);

  const currentSlide = slides[step];
  const currentVideoUrl = currentSlide.videoUrl.trim();
  const isLastStep = step === slides.length - 1;

  const preloadableVideoUrls = useMemo(
    () => [...new Set(slides.map((s) => s.videoUrl.trim()).filter(Boolean))],
    [],
  );
  const preloadPercent = preloadableVideoUrls.length
    ? Math.round((preloadProgress / preloadableVideoUrls.length) * 100)
    : 100;

  // ── Video preloading ───────────────────────────────────
  useEffect(() => {
    let isCancelled = false;
    const cleanupVideos = [];
    const loadedUrls = new Set();
    const initialUrl = slides[0].videoUrl.trim() || preloadableVideoUrls[0];

    if (!initialUrl) { setBootReady(true); return undefined; }

    const markLoaded = (url) => {
      if (loadedUrls.has(url)) return;
      loadedUrls.add(url);
      setPreloadProgress(loadedUrls.size);
    };
    const markBootReady = (url) => { if (url === initialUrl) setBootReady(true); };

    const fallbackTimer = window.setTimeout(() => setBootReady(true), 9000);

    const preloadVideo = (url) =>
      new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        video.src = url;
        // iOS Safari will not fetch video data for off-DOM elements even with
        // preload="auto". Appending with zero visual footprint forces it to load.
        Object.assign(video.style, {
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: "0",
          pointerEvents: "none",
        });
        document.body.appendChild(video);

        const finish = () => { markLoaded(url); markBootReady(url); resolve(); };
        const timeoutId = window.setTimeout(() => finish(), 12000);

        video.addEventListener("loadeddata", finish, { once: true });
        video.addEventListener("canplay", finish, { once: true });
        video.addEventListener("error", finish, { once: true });
        video.load();

        preloaderVideosRef.current.push(video);
        cleanupVideos.push(() => {
          window.clearTimeout(timeoutId);
          video.removeEventListener("loadeddata", finish);
          video.removeEventListener("canplay", finish);
          video.removeEventListener("error", finish);
          video.src = "";
          video.load();
          video.parentNode?.removeChild(video);
        });
      });

    // Start all video preloads in parallel — the old sequential await loop
    // meant video 2 wouldn't start loading until video 1 finished (could be
    // 10+ seconds on mobile). bootReady fires as soon as the first video is
    // ready via markBootReady; the rest continue loading in the background.
    const firstIndex = preloadableVideoUrls.findIndex((u) => u === initialUrl);
    const ordered =
      firstIndex === -1
        ? preloadableVideoUrls
        : [initialUrl, ...preloadableVideoUrls.filter((u) => u !== initialUrl)];
    ordered.forEach((url) => { if (!isCancelled) preloadVideo(url); });

    return () => {
      isCancelled = true;
      window.clearTimeout(fallbackTimer);
      cleanupVideos.forEach((c) => c());
      preloaderVideosRef.current = [];
    };
  }, [preloadableVideoUrls]);

  // Delay the "Войти" button so user sees and taps the player first
  useEffect(() => {
    if (!bootReady) return undefined;
    const t = window.setTimeout(() => setShowEnterButton(true), 2200);
    return () => window.clearTimeout(t);
  }, [bootReady]);

  // ── Music float positioning ────────────────────────────
  //
  // RULE: the iframe container must be COMPLETELY STATIC once audio is playing.
  // iOS Safari monitors active style mutations on iframe containers and will
  // suspend media if it detects continuous layout changes (rAF loops, scroll
  // listeners, etc.). Each state transition is allowed ONE positioning write;
  // after that the element is never touched until the next state change.
  //
  // Hidden state uses NO inline style writes at all — the CSS class itself
  // declares top:-9999px !important which overrides any previously-set inline
  // top/left. This keeps the DOM completely frozen during hidden playback.

  // Place the float over a placeholder element — called at most once per state.
  // Pass resizeFloat=true when moving to a new state that may have different
  // dimensions (e.g. the final playlist panel vs. the gate placeholder).
  const placeOverElement = useCallback((el, resizeFloat = false) => {
    const float = musicFloatRef.current;
    if (!float || !el) return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (!floatSizedRef.current || resizeFloat) {
      float.style.width = `${r.width}px`;
      float.style.height = `${r.height}px`;
      floatSizedRef.current = true;
    }
    float.style.top = `${r.top}px`;
    float.style.left = `${r.left}px`;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Gate phase: position ONCE immediately, then ONCE more after the entrance
  // animation settles (~960ms). No rAF loop — two discrete writes, then stop.
  useEffect(() => {
    if (!bootReady || hasEntered) return undefined;
    musicStateRef.current = "gate";
    const float = musicFloatRef.current;
    if (float) float.className = "music-float music-float--gate";
    placeOverElement(gatePlaceholderRef.current);
    const t = window.setTimeout(
      () => placeOverElement(gatePlaceholderRef.current),
      960,
    );
    return () => window.clearTimeout(t);
  }, [bootReady, hasEntered, placeOverElement]);

  // Hidden phase: CSS class change ONLY — zero inline style writes.
  // .music-float--hidden declares top:-9999px !important in CSS, which
  // overrides the inline top/left that were set during the gate phase.
  // After this class flip the element is completely untouched until slide 4.
  useEffect(() => {
    if (!hasEntered || isLastStep) return;
    musicStateRef.current = "hidden";
    const float = musicFloatRef.current;
    if (float) float.className = "music-float music-float--hidden";
  }, [hasEntered, isLastStep]);

  // Final slide: expand the mini-player into the playlist panel.
  // 1. Immediately switch class and write top:-9999px to avoid a brief flash
  //    at the stale gate position (the --hidden !important rules are now gone).
  // 2. After the playlist panel CSS transition (~550ms), measure the final
  //    placeholder and snap into place — one write, then stop.
  useEffect(() => {
    if (!hasEntered || !isLastStep) return undefined;
    musicStateRef.current = "final";
    const float = musicFloatRef.current;
    if (float) {
      float.className = "music-float music-float--final";
      float.style.top = "-9999px"; // hold off-screen during CSS transition
    }
    const t = window.setTimeout(
      () => placeOverElement(finalPlaceholderRef.current, true),
      600,
    );
    return () => window.clearTimeout(t);
  }, [hasEntered, isLastStep, placeOverElement]);

  const onEnterSite = () => {
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
      style={{ "--accent-a": currentSlide.accentA, "--accent-b": currentSlide.accentB }}
    >
      {/*
        ── Persistent music float ──────────────────────────
        NEVER inside AnimatePresence. The iframe lives here from bootReady
        onward and is repositioned by JS — it is never unmounted, so audio
        survives the gate exit and every slide transition.
      */}
      <div ref={musicFloatRef} className="music-float music-float--gate">
        {bootReady && (
          <>
            {/* Handwritten annotation — only visible in gate state (CSS) */}
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
            <iframe
              className="yandex-embed-frame"
              src={GATE_MUSIC_URL}
              title="Yandex Music playlist"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen"
              loading="eager"
            />
          </>
        )}
      </div>

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

      {/* Intro gate */}
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

              {/*
                Layout placeholder — reserves exactly the same space as the
                music float so the gate inner layout is stable. The float
                (position: fixed, z-index: 20) is positioned on top of this
                by the rAF tracking loop.
              */}
              <motion.div
                ref={gatePlaceholderRef}
                className="gate-player-placeholder"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              />

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
            Placeholder for the music float on the final slide.
            The float is positioned by JS to exactly cover this div.
          */}
          <div ref={finalPlaceholderRef} className="yandex-embed-shell" />
        </div>

        <div className={`controls${isLastStep ? " final-controls" : ""}`}>
          <button className="advance" onClick={onAdvance} type="button">
            {currentSlide.buttonLabel}
          </button>
          <div className="step-dots">{stepDots}</div>
        </div>
      </section>

      {/* Video panel */}
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
                muted={videoMuted}
                onError={() =>
                  setVideoFailed((prev) => ({ ...prev, [currentSlide.id]: true }))
                }
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {hasEntered && (
          <button
            className="video-mute-btn"
            onClick={() => setVideoMuted((v) => !v)}
            type="button"
            aria-label={videoMuted ? "Включить звук" : "Выключить звук"}
          >
            {videoMuted ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}

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

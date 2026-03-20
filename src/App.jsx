import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

const SPOTIFY_PLAYLIST_URI = "spotify:playlist:4UAjOazfnYv008ejMGDVSD";

const slides = [
  {
    id: "welcome",
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
    video: "/media/videos/01-welcome.mp4",
    buttonLabel: "Начать",
    accentA: "#f2f2f2",
    accentB: "#d8d8d8",
    videoFilter: "grayscale(100%) contrast(1.08)",
    meshScale: 0.9,
    meshColors: ["#f8f8f8", "#ececec", "#e3e3e3", "#d9d9d9"],
  },
  {
    id: "childhood",
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
    video: "/media/videos/02-childhood.mp4",
    buttonLabel: "Дальше",
    accentA: "#28b8ff",
    accentB: "#16e085",
    videoFilter: "saturate(1.08)",
    meshScale: 1,
    meshColors: ["#88e0ff", "#53f0c4", "#41a4ff", "#f5ffe9"],
  },
  {
    id: "strength",
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
    video: "/media/videos/03-strength.mp4",
    buttonLabel: "Еще",
    accentA: "#3f7bff",
    accentB: "#ffb703",
    videoFilter: "saturate(1.1)",
    meshScale: 1.08,
    meshColors: ["#6f9dff", "#ffd56a", "#5bc5ff", "#ff9f68"],
  },
  {
    id: "final",
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
    video: "/media/videos/04-final-main.mp4",
    buttonLabel: "Сначала",
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

let spotifyIframeApiPromise;

function loadSpotifyIframeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Spotify iframe API requires a browser"));
  }

  if (window.SpotifyIframeApi) {
    return Promise.resolve(window.SpotifyIframeApi);
  }

  if (spotifyIframeApiPromise) {
    return spotifyIframeApiPromise;
  }

  spotifyIframeApiPromise = new Promise((resolve) => {
    const previousReadyHandler = window.onSpotifyIframeApiReady;

    window.onSpotifyIframeApiReady = (api) => {
      window.SpotifyIframeApi = api;
      if (typeof previousReadyHandler === "function") {
        previousReadyHandler(api);
      }
      resolve(api);
    };

    const existingScript = document.querySelector(
      'script[src="https://open.spotify.com/embed/iframe-api/v1"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return spotifyIframeApiPromise;
}

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

function SpotifyPlaylist({ onControllerReady, onPlaybackStarted }) {
  const embedRef = useRef(null);
  const readyHandlerRef = useRef(onControllerReady);
  const playbackHandlerRef = useRef(onPlaybackStarted);

  useEffect(() => {
    readyHandlerRef.current = onControllerReady;
    playbackHandlerRef.current = onPlaybackStarted;
  }, [onControllerReady, onPlaybackStarted]);

  useEffect(() => {
    let isActive = true;
    let controller;

    loadSpotifyIframeApi()
      .then((api) => {
        if (!isActive || !embedRef.current) {
          return;
        }

        api.createController(
          embedRef.current,
          {
            width: "100%",
            height: "352",
            uri: SPOTIFY_PLAYLIST_URI,
          },
          (embedController) => {
            controller = embedController;

            controller.addListener("ready", () => {
              if (!isActive) {
                return;
              }
              readyHandlerRef.current?.(controller);
            });

            controller.addListener("playback_started", () => {
              if (!isActive) {
                return;
              }
              playbackHandlerRef.current?.();
            });
          },
        );
      })
      .catch(() => {});

    return () => {
      isActive = false;
      if (controller) {
        controller.destroy();
      }
    };
  }, []);

  return <div ref={embedRef} className="spotify-embed" />;
}

function App() {
  const [step, setStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [videoFailed, setVideoFailed] = useState({});
  const spotifyControllerRef = useRef(null);
  const playlistStartRequestedRef = useRef(false);
  const playbackTimeoutRef = useRef(null);
  const currentSlide = slides[step];

  const isLastStep = step === slides.length - 1;
  const stepText = useMemo(
    () => `${String(step + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`,
    [step],
  );

  useEffect(() => {
    return () => {
      if (playbackTimeoutRef.current) {
        window.clearTimeout(playbackTimeoutRef.current);
      }
    };
  }, []);

  const startPlaylist = () => {
    playlistStartRequestedRef.current = true;

    if (!spotifyControllerRef.current) {
      return;
    }

    if (playbackTimeoutRef.current) {
      window.clearTimeout(playbackTimeoutRef.current);
    }

    try {
      spotifyControllerRef.current.play();
      setMusicBlocked(false);
      playbackTimeoutRef.current = window.setTimeout(() => {
        setMusicBlocked(true);
      }, 1600);
    } catch {
      setMusicBlocked(true);
    }
  };

  const onAdvance = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      startPlaylist();
    }
    setStep((prev) => (prev + 1) % slides.length);
  };

  const onRetryMusic = () => {
    startPlaylist();
  };

  const onSpotifyControllerReady = (controller) => {
    spotifyControllerRef.current = controller;

    if (playlistStartRequestedRef.current) {
      startPlaylist();
    }
  };

  const onSpotifyPlaybackStarted = () => {
    if (playbackTimeoutRef.current) {
      window.clearTimeout(playbackTimeoutRef.current);
    }
    setMusicBlocked(false);
  };

  return (
    <div
      className="page"
      style={{
        "--accent-a": currentSlide.accentA,
        "--accent-b": currentSlide.accentB,
      }}
    >
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

        <div className="controls">
          <button className="advance" onClick={onAdvance} type="button">
            {isLastStep ? "Start Again" : currentSlide.buttonLabel}
          </button>

          <p className="step-indicator">{stepText}</p>
        </div>

        {musicBlocked ? (
          <button className="music-fix" onClick={onRetryMusic} type="button">
            Нажми, чтобы включить плейлист
          </button>
        ) : null}

        <div className={`playlist-panel${isLastStep ? " is-visible" : ""}`}>
          <p className="playlist-heading">
            Можешь остаться послушать музыку,
            <span className="handwritten"> любим тебя</span>.
          </p>
          <SpotifyPlaylist
            onControllerReady={onSpotifyControllerReady}
            onPlaybackStarted={onSpotifyPlaybackStarted}
          />
        </div>
      </section>

      <section className="video-pane">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.video}
            className="memory-video-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PlyrVideo
              src={currentSlide.video}
              filter={currentSlide.videoFilter}
              onError={() =>
                setVideoFailed((prev) => ({ ...prev, [currentSlide.video]: true }))
              }
            />
          </motion.div>
        </AnimatePresence>

        {videoFailed[currentSlide.video] ? (
          <div className="video-fallback">
            <p>Добавь видео по этому пути:</p>
            <code>{currentSlide.video}</code>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default App;

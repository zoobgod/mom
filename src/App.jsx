import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    id: "welcome",
    eyebrow: "Step 01",
    heading: (
      <>
        Hi, <span className="handwritten">Mom</span>.
      </>
    ),
    lines: [
      "Today is yours.",
      "A quiet page, a few memories, and all the love we carry every day.",
      "Click whenever you are ready.",
    ],
    video: "/media/videos/01-welcome.mp4",
    buttonLabel: "Begin",
    accentA: "#f2f2f2",
    accentB: "#d8d8d8",
    videoFilter: "grayscale(100%) contrast(1.08)",
    meshScale: 0.9,
    meshColors: ["#f8f8f8", "#ececec", "#e3e3e3", "#d9d9d9"],
  },
  {
    id: "childhood",
    eyebrow: "Step 02",
    heading: (
      <>
        You gave us a <span className="handwritten">beautiful</span> childhood.
      </>
    ),
    lines: [
      "In every small moment, you made home feel safe.",
      "The way you cared for us became our first idea of kindness.",
      "We still carry that warmth everywhere.",
    ],
    video: "/media/videos/02-childhood.mp4",
    buttonLabel: "Next Memory",
    accentA: "#28b8ff",
    accentB: "#16e085",
    videoFilter: "saturate(1.08)",
    meshScale: 1,
    meshColors: ["#88e0ff", "#53f0c4", "#41a4ff", "#f5ffe9"],
  },
  {
    id: "strength",
    eyebrow: "Step 03",
    heading: (
      <>
        You taught us what <span className="handwritten">strength</span> looks
        like.
      </>
    ),
    lines: [
      "Not loud, not dramatic, just steady and true.",
      "You kept going, and because of that, we learned to keep going too.",
      "Thank you for every silent sacrifice.",
    ],
    video: "/media/videos/03-strength.mp4",
    buttonLabel: "One More",
    accentA: "#3f7bff",
    accentB: "#ffb703",
    videoFilter: "saturate(1.1)",
    meshScale: 1.08,
    meshColors: ["#6f9dff", "#ffd56a", "#5bc5ff", "#ff9f68"],
  },
  {
    id: "final",
    eyebrow: "Step 04",
    heading: (
      <>
        Happy Birthday, <span className="handwritten">our hero</span>.
      </>
    ),
    lines: [
      "This final video says what words can only start to say.",
      "We love you deeply, completely, and forever.",
      "Thank you for being our Mom.",
    ],
    video: "/media/videos/04-final-main.mp4",
    buttonLabel: "Start Again",
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

function App() {
  const [step, setStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [videoFailed, setVideoFailed] = useState({});
  const audioRef = useRef(null);
  const currentSlide = slides[step];

  const isLastStep = step === slides.length - 1;
  const stepText = useMemo(
    () => `${String(step + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`,
    [step],
  );

  const startMusic = async () => {
    if (!audioRef.current || hasInteracted) {
      return;
    }

    audioRef.current.volume = 0.35;
    try {
      await audioRef.current.play();
      setMusicBlocked(false);
    } catch {
      setMusicBlocked(true);
    }
  };

  const onAdvance = async () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      await startMusic();
    }
    setStep((prev) => (prev + 1) % slides.length);
  };

  const onRetryMusic = async () => {
    if (!audioRef.current) {
      return;
    }
    try {
      await audioRef.current.play();
      setMusicBlocked(false);
    } catch {
      setMusicBlocked(true);
    }
  };

  return (
    <div
      className="page"
      style={{
        "--accent-a": currentSlide.accentA,
        "--accent-b": currentSlide.accentB,
      }}
    >
      <audio ref={audioRef} loop preload="auto">
        <source src="/media/music/main-track.mp3" type="audio/mpeg" />
      </audio>

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

      <section className="text-pane">
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
            Tap to start music
          </button>
        ) : null}
      </section>

      <section className="video-pane">
        <AnimatePresence mode="wait">
          <motion.video
            key={currentSlide.video}
            className="memory-video"
            autoPlay
            loop
            playsInline
            muted
            preload="auto"
            style={{ filter: currentSlide.videoFilter }}
            onError={() =>
              setVideoFailed((prev) => ({ ...prev, [currentSlide.video]: true }))
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <source src={currentSlide.video} type="video/mp4" />
          </motion.video>
        </AnimatePresence>

        {videoFailed[currentSlide.video] ? (
          <div className="video-fallback">
            <p>Drop this video file into:</p>
            <code>{currentSlide.video}</code>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default App;

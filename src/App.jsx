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
  },
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

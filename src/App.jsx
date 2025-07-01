import React, { useState, useEffect } from 'react';
import clap from "./assets/sound.mp3"

function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(1); // 1 = 30 min, 2 = 10 min
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const sound = new Audio(clap);

  useEffect(() => {
    if (!running || isPlayingSound) return;

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);

            if (phase === 1) {
              // 🔊 Play sound for 5 seconds
              setIsPlayingSound(true);
              sound.play();

              // Wait 5 seconds before starting 10-minute phase
              setTimeout(() => {
                setMinutes(10);
                setSeconds(0);
                setPhase(2);
                setIsPlayingSound(false);
                setRunning(true);
              }, 5000);
            } else {
              setRunning(false);
              setFinished(true);
            }

            return 0;
          } else {
            setMinutes((prevMinutes) => prevMinutes - 1);
            return 59;
          }
        } else {
          return prevSeconds - 1;
        }
      });

      setTotalSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running, minutes, seconds, phase, isPlayingSound]);

  const reset = () => {
    setMinutes(30);
    setSeconds(0);
    setPhase(1);
    setTotalSecondsElapsed(0);
    setFinished(false);
    setIsPlayingSound(false);
    setRunning(true);
  };

  const formatTime = (min, sec) =>
    `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

  const formatHours = (totalSec) => (totalSec / 3600).toFixed(2); // up to 2 decimal places

  return (
    <div style={{ fontSize: '2rem', textAlign: 'center', paddingTop: '30px' }}>
      {!running && !finished && (
        <button onClick={() => setRunning(true)}>▶️ Start</button>
      )}

      {running && !isPlayingSound && (
        <p>⏱ Phase {phase}: {formatTime(minutes, seconds)}</p>
      )}

      {isPlayingSound && <p>🔔 Ringing for 5 seconds...</p>}

      {finished && (
        <>
          <p>✅ All timers completed!</p>
          <p>🕒 Total time elapsed: {formatHours(totalSecondsElapsed)} hours</p>
          <button onClick={reset}>🔁 Start Again</button>
        </>
      )}
    </div>
  );
}

export default App;

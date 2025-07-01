import React, { useState, useEffect } from 'react';
import clap from "./assets/sound.mp3"
function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(1); // 1 = 30 min, 2 = 10 min
  const [isPlayingSound, setIsPlayingSound] = useState(false);

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
                setRunning(true); // continue timer
              }, 10000);
            } else {
              setRunning(false); // phase 2 ends
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
    }, 1000);

    return () => clearInterval(timer);
  }, [running, minutes, seconds, phase, isPlayingSound]);

  return (
    <div style={{ fontSize: '2rem', textAlign: 'center' }}>
      <button onClick={() => setRunning(true)}>Start</button>

      {running && !isPlayingSound && (
        <p>
          ⏱ Phase {phase}: {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </p>
      )}

      {isPlayingSound && <p>🔔 Ringing for 10 seconds...</p>}

      {!running && phase === 2 && minutes === 0 && seconds === 0 && (
        <p>✅ All timers completed!</p>
      )}
    </div>
  );
}

export default App;

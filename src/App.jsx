import React, { useState, useEffect } from 'react';
import clap from "./assets/sound.mp3";

function App() {
  const [minutes, setMinutes] = useState(30);
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
              setIsPlayingSound(true);
              sound.play();

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

  const formatHours = (totalSec) => (totalSec / 3600).toFixed(2);

  // Styles
  const containerStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#f0f4f8",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    padding: "40px 60px",
    maxWidth: "350px",
    width: "100%",
    textAlign: "center",
  };

  const timeStyle = {
    fontSize: "4rem",
    fontWeight: "700",
    color: phase === 1 ? "#4a90e2" : "#e94e77",
    margin: "20px 0 30px",
    letterSpacing: "3px",
    fontFamily: "'Courier New', Courier, monospace",
  };

  const phaseTextStyle = {
    fontSize: "1.2rem",
    color: "#333",
    marginBottom: "10px",
    fontWeight: "600",
  };

  const messageStyle = {
    fontSize: "1.1rem",
    color: "#666",
    marginBottom: "30px",
  };

  const buttonStyle = {
    background: "#4a90e2",
    border: "none",
    color: "white",
    padding: "12px 30px",
    borderRadius: "30px",
    fontSize: "1.2rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(74, 144, 226, 0.4)",
    transition: "background 0.3s ease",
  };

  const buttonHoverStyle = {
    background: "#357ABD",
  };

  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {!running && !finished && (
          <button
            style={{ ...buttonStyle, ...(btnHover ? buttonHoverStyle : {}) }}
            onClick={() => setRunning(true)}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Start
          </button>
        )}

        {running && !isPlayingSound && (
          <>
            <div style={phaseTextStyle}>Phase {phase} Timer</div>
            <div style={timeStyle}>{formatTime(minutes, seconds)}</div>
          </>
        )}

        {isPlayingSound && (
          <p style={messageStyle}>Ringing for 5 seconds...</p>
        )}

        {finished && (
          <>
            <p style={{ ...phaseTextStyle, color: "#28a745" }}>All timers completed</p>
            <p style={{ fontSize: "1.1rem", marginBottom: "30px" }}>
              Total time elapsed: <strong>{formatHours(totalSecondsElapsed)} hours</strong>
            </p>
            <button
              style={{ ...buttonStyle, background: "#28a745" }}
              onClick={reset}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              Start Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

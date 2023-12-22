import React, { useState, useRef, useEffect } from "react";
import styles from "./timeField.module.css";

interface TimeFieldProps {
  time: number;
  onChange: (time: number) => void;
}

export default function TimeField(props: TimeFieldProps) {
  const { time, onChange } = props;

  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [milliseconds, setMilliseconds] = useState("");

  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);
  const millisecondsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const totalMilliseconds = time * 1000;
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = totalMilliseconds % 1000;

    setHours(String(hours).padStart(2, "0"));
    setMinutes(String(minutes).padStart(2, "0"));
    setSeconds(String(seconds).padStart(2, "0"));
    setMilliseconds(String(milliseconds).padStart(3, "0"));
  }, [time]);

  const updateTime = (
    newHours: number,
    newMinutes: number,
    newSeconds: number,
    newMilliseconds: number
  ) => {
    const totalTimeInMilliseconds =
      newHours * 3600000 +
      newMinutes * 60000 +
      newSeconds * 1000 +
      newMilliseconds;

    if (!Number.isNaN(totalTimeInMilliseconds)) {
      onChange(totalTimeInMilliseconds / 1000);
    }
  };

  const handleHoursChange = (e: any) => {
    const newString = e.target.value;
    setHours(newString);
    updateTime(
      parseInt(newString),
      parseInt(minutes),
      parseInt(seconds),
      parseInt(milliseconds)
    );
    if (newString.length >= 2 && minutesRef.current) {
      minutesRef.current.focus();
    }
  };

  const handleMinutesChange = (e: any) => {
    const newString = e.target.value;
    const newMinutes = Math.min(newString, 59);

    if (newMinutes === 0) {
      setMinutes(newString.slice(0, 1));
    } else {
      setMinutes(newMinutes.toString());
    }

    updateTime(
      parseInt(hours),
      newMinutes,
      parseInt(seconds),
      parseInt(milliseconds)
    );
    if (newString.length >= 2 && secondsRef.current) {
      secondsRef.current.focus();
    }
  };

  const handleSecondsChange = (e: any) => {
    const newString = e.target.value;
    const newSeconds = Math.min(newString, 59);

    if (newSeconds === 0) {
      setSeconds(newString);
    } else {
      setSeconds(newSeconds.toString());
    }

    updateTime(
      parseInt(hours),
      parseInt(minutes),
      newSeconds,
      parseInt(milliseconds)
    );

    if (newString.length >= 2 && millisecondsRef.current) {
      millisecondsRef.current.focus();
    }
  };

  const handleMillisecondsChange = (e: any) => {
    const newString = e.target.value;
    const newMilliseconds = Math.min(parseInt(newString), 999);

    if (newMilliseconds === 0) {
      if (newString.length < 3) {
        setMilliseconds(newString);
      }
    } else {
      setMilliseconds(newMilliseconds.toString());
    }

    updateTime(
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds),
      newMilliseconds
    );

    if (newString.length === 3 && millisecondsRef.current) {
      millisecondsRef.current.blur();
    }
  };

  return (
    <>
      <div className="flex">
        <input
          className="no-spinners w-8 border rounded text-lg text-center"
          type="number"
          value={hours}
          onChange={handleHoursChange}
          placeholder="HH"
          maxLength={2}
          onFocus={() => setHours("")}
          onBlur={() => {
            const totalMilliseconds = time * 1000;
            const hours = Math.floor(totalMilliseconds / 3600000);

            setHours(String(hours).padStart(2, "0"));
          }}
        />
        <div className="mx-1 text-3xl font-bold flex items-center flex flex-col justify-center cursor-default">
          <span>:</span>
        </div>
        <input
          className="no-spinners w-8 border rounded text-lg text-center"
          ref={minutesRef}
          type="number"
          value={minutes}
          onChange={handleMinutesChange}
          placeholder="MM"
          maxLength={2}
          onFocus={() => setMinutes("")}
          onBlur={() => {
            const totalMilliseconds = time * 1000;
            const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);

            setMinutes(String(minutes).padStart(2, "0"));
          }}
        />
        <div className="mx-1 text-3xl font-bold flex items-center cursor-default">
          <span>:</span>
        </div>
        <input
          className="no-spinners w-8 border rounded text-lg text-center"
          ref={secondsRef}
          type="number"
          value={seconds}
          onChange={handleSecondsChange}
          placeholder="SS"
          maxLength={2}
          onFocus={() => setSeconds("")}
          onBlur={() => {
            const totalMilliseconds = time * 1000;
            const seconds = Math.floor((totalMilliseconds % 60000) / 1000);

            setSeconds(String(seconds).padStart(2, "0"));
          }}
        />
        <div className="mx-1 text-3xl font-bold flex items-center cursor-default">
          <span>.</span>
        </div>
        <input
          className="no-spinners w-10 border rounded text-lg text-center"
          ref={millisecondsRef}
          type="number"
          value={milliseconds}
          onChange={handleMillisecondsChange}
          placeholder="MS"
          maxLength={3}
          onFocus={() => setMilliseconds("")}
          onBlur={() => {
            const totalMilliseconds = time * 1000;
            const milliseconds = totalMilliseconds % 1000;

            setMilliseconds(String(milliseconds).padStart(3, "0"));
          }}
        />
      </div>
    </>
  );
}

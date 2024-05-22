"use client"

import Image from "next/image";
import styles from "./page.module.css";
import CarDistance from "@/app/componets/carDistance";
import {useEffect, useState} from "react";

export default function Home() {
  const [distance, setNumber] = useState(0);
  const [sensorData, setSensorData] = useState({ distance: 0, infrared1: 0, infrared2: 0 });
  const [port, setPort] = useState(null);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      setNumber((prevNumber) => (prevNumber < 10 ? prevNumber + 1 : 10));
    } else if (event.key === 'ArrowDown') {
      setNumber((prevNumber) => (prevNumber > 0 ? prevNumber - 1 : 0));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const connectToSerial = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setPort(port);

      const reader = port.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        const textDecoder = new TextDecoder();
        const jsonString = textDecoder.decode(value);
        try {
          const data = JSON.parse(jsonString);
          setSensorData(data);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    } catch (error) {
      console.error('Error connecting to serial port:', error);
    }
  };

  if (sensorData.distance > 0){
    setNumber(sensorData.distance);
  }else if(sensorData.distance < 0){
    setNumber(0)
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.js</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <CarDistance distance={distance}/>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}

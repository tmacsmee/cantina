import { useEffect, useState } from "react";
import Game from "./game";

export default function App() {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPaused((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="h-screen">
      <Game isPaused={isPaused} />
      <div className="fixed inset-0 flex items-center justify-center">
        <ul>
          <li className="z-10 text-2xl font-bold">asdasd</li>
        </ul>
      </div>
    </div>
  );
}

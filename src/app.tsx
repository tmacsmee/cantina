import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
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
      <Menu open={isPaused} setIsOpen={setIsPaused} />
    </div>
  );
}

import { Dialog } from "@base-ui/react/dialog";

function Menu({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={setIsOpen}>
      {/* <Dialog.Trigger className="flex h-8 items-center justify-center gap-2 border border-neutral-950 bg-white px-3 text-sm leading-none font-normal whitespace-nowrap text-neutral-950 select-none hover:not-data-disabled:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 active:not-data-disabled:bg-neutral-200 disabled:border-neutral-500 disabled:text-neutral-500 data-disabled:border-neutral-500 data-disabled:text-neutral-500 dark:border-white dark:bg-neutral-950 dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:focus-visible:outline-white dark:active:not-data-disabled:bg-neutral-700 dark:data-disabled:border-neutral-400 dark:data-disabled:text-neutral-400">
        View notifications
      </Dialog.Trigger> */}
      <Dialog.Portal>
        <Dialog.Popup className="fixed inset-0 flex items-center justify-center">
          <Dialog.Title className="sr-only">Pause menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Options to resume the game, change settings, view extras, or quit
            the game.
          </Dialog.Description>
          <ul className="font-menu flex flex-col gap-y-2 text-center text-4xl font-bold tracking-wide text-[#1a72c8] [-webkit-text-stroke:5px_rgba(0,0,0,0.75)] [paint-order:stroke_fill]">
            <li className="">
              <Dialog.Close className="focus:animate-menu focus:outline-none">
                Resume
              </Dialog.Close>
            </li>
            <li>
              <button className="focus:animate-menu focus:outline-none">
                Options
              </button>
            </li>
            <li>
              <button className="focus:animate-menu focus:outline-none">
                Extras
              </button>
            </li>
            <li>
              <button className="focus:animate-menu focus:outline-none">
                Quit
              </button>
            </li>
          </ul>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

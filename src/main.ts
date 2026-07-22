import "./style.css";
import { CaveGame } from "./game/game";
const canvas=document.querySelector<HTMLCanvasElement>("#game-canvas"); const overlay=document.querySelector<HTMLButtonElement>("#entry-overlay"); if(!canvas||!overlay)throw new Error("Game UI missing"); new CaveGame(canvas,overlay).start().catch((error)=>{ console.error(error); overlay.textContent="FAILED TO START"; });

import { REVEAL_CLASS } from "./types";

export const getAllElementsToReveal = () => {
  // Convert NodeList to HTMLElement array
  return Array.from(document.querySelectorAll<HTMLElement>(`.${REVEAL_CLASS}`));
};

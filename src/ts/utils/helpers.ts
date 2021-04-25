import { REVEAL_CLASS } from "./types";

export const getAllElementsToReveal = () => {
  return Array.from(document.getElementsByClassName(REVEAL_CLASS));
};

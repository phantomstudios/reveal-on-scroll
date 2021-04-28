export interface RevealConfig {
  delayBetweenQueuedElements: number;
  thresholdToRevealElements: number;
  revealSelector: string;
  visibleClass: string;
  hiddenClass: string;
}

export const DEFAULT_REVEAL_CONFIG: RevealConfig = {
  delayBetweenQueuedElements: 150,
  thresholdToRevealElements: 0.2,
  revealSelector: ".reveal-on-scroll",
  visibleClass: "reveal-scrolled",
  hiddenClass: "reveal-hidden",
};

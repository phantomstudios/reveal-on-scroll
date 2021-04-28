export const REVEAL_CLASS = "reveal-on-scroll";
export const VISIBLE_CLASS = "reveal-scrolled";
export const HIDDEN_CLASS = "reveal-hidden";

export interface Config {
  delayBetweenQueuedElements: number;
  thresholdToRevealElements: number;
}

export const DEFAULT_CONFIG: Config = {
  delayBetweenQueuedElements: 150,
  thresholdToRevealElements: 0.2,
};

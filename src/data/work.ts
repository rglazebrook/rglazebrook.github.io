import type { ImageMetadata } from "astro";
import tpw from "../assets/work/portfolio-tpw.jpg";
import rockettes from "../assets/work/portfolio-rockettes.jpg";
import watchme from "../assets/work/portfolio-watchme.jpg";
import williams from "../assets/work/portfolio-williams.jpg";
import fluAd from "../assets/work/portfolio-flu-ad.jpg";
import oneship from "../assets/work/portfolio-oneship.jpg";
import sushi from "../assets/work/million-sushi.png";
import nesc64 from "../assets/work/nes-c64.png";

export interface WorkItem {
  title: string;
  description: string;
  image: ImageMetadata;
  url?: string;
}

/** Client work from before the design-system years (carried over from the old site). */
export const earlierWork: WorkItem[] = [
  {
    title: "The Pioneer Woman",
    description: "All front-end development on a custom WordPress theme for Food Network's Ree Drummond.",
    image: tpw,
  },
  {
    title: "Rockettes",
    description: "Responsive front end for this iconic Madison Square Garden property.",
    image: rockettes,
  },
  {
    title: "CDC “Watch Me!” training module",
    description: "Front-end development for an animated, interactive learning module.",
    image: watchme,
  },
  {
    title: "Williams Energy",
    description: "Front end of a WordPress.com VIP site for Williams Companies.",
    image: williams,
  },
  {
    title: "CDC “Fight Flu” campaign ad",
    description: "HTML5 ad for a CDC campaign encouraging flu vaccination.",
    image: fluAd,
  },
];

/** Personal / side projects. TODO: add Pixi experiments, js1k, C64, sushi-calc. */
export const playground: WorkItem[] = [
  {
    title: "One Ship",
    description: "A small HTML5 Canvas game I built way back in 2014 to learn canvas animation.",
    image: oneship,
    url: "https://rglazebrook.github.io/games/oneship/",
  },
  {
    title: "NES-C64",
    description: "I taught myself KiCad by designing a PCB that converts an NES controller to a Commodore 64 controller.",
    image: nesc64,
    url: "https://github.com/rglazebrook/NES-C64",
  },
  {
    title: "Sushi Calculator",
    description: "A calculator for the Roblox game Sell a Million Sushi. A vibecoding experiment.",
    image: sushi,
    url: "https://rglazebrook.github.io/sushi-calc/",
  }
];

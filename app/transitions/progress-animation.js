import { animate } from "liquid-fire";

const PARSING_WAIT_TIME = 250;

export default function () {
  // Should only be a one way animation on parsing
  if (this.newValue) {

    return animate(this.oldElement, {
      translateY: '-100px',
      opacity: 0,
    })
    .then(() =>{

      // We wait the parsing animation doesn't flash when done quickly
      return this.lookup('wait', PARSING_WAIT_TIME).apply(this).then(() =>{
        animate(this.newElement, {
          translateX: ['0.5em', '-1em'],
          opacity: [1, 0.3]
        });
      });
    });
  }
}

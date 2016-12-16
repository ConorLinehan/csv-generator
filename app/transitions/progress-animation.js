import { animate } from "liquid-fire";

const PARSING_WAIT_TIME = 250;

export default function () {
  // Should only be a one way animation
  if (this.oldValue === 'generating') {

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
  } else {
    return this.lookup('wait').apply(this, 200 , { then: 'fade' });
  }
}

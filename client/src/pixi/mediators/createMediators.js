import createCircleMediatorWithReduxWatch from './createCircleMediatorWithReduxWatch';
import createCircleMediatorWithRxJS from './createCircleMediatorWithRxJS';

import createPianoMediator from './createPianoMediator';

export default function createMediators({ store, pianoRoll }) {
  // const { circle1, circle2 } = stage; 
  // const clearMediator1 = createCircleMediatorWithReduxWatch({ store, view: circle1 });
  // const clearMediator2 = createCircleMediatorWithRxJS({ store, view: circle2 });


  const clearMediator3 = createPianoMediator({ store, view: pianoRoll });
  return () => {
    // clearMediator1();
    // clearMediator2();

    clearMediator3();
  };
}

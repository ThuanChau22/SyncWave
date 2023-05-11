import { add } from 'actions';
import watch from 'redux-watch';

export default function createCircleMediatorWithReduxWatch({ store, view }) {
  const { dispatch, subscribe } = store;
  // set default value
  //view.count = store.getState().clickedCount;
  // redux watch and update view after redux store state update.
  const w = watch(store.getState, 'clickedCount');
  let unsubscribe = store.subscribe(w((newVal, oldVal, objectPath) => {
    // console.log('%s changed from %s to %s', objectPath, oldVal, newVal);
    //view.count = newVal;
  }))
  // dispatch action 
  const onClick = () => { dispatch(add()); }
  //view.on('click', onClick);
  //view.on('tap', onClick);

  // clear listeners
  return () => {
    //view.off('click', onClick);
    unsubscribe();
  }
}
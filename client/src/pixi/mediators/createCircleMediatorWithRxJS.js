import { add } from 'actions';
import { from } from 'rxjs';
import { pluck, distinctUntilChanged, tap } from 'rxjs/operators';

export default function createCircleMediatorWithRxJS({ store, view }) {
  const { dispatch } = store;
  // set default value
  //view.count = store.getState().clickedCount;
  // update view after redux store state update by rxjs
  const clickedCountSub = from(store).pipe(
    pluck('clickedCount'),
    distinctUntilChanged(),
    //tap(clickedCount => { view.count = clickedCount; }),
  ).subscribe();

  // dispatch action 
  const onClick = () => { dispatch(add()); }
  //view.on('click', onClick);
  //view.on('tap', onClick);

  // clear listeners
  return () => {
    //view.off('click', onClick);
    clickedCountSub.unsubscribe();
  }
}
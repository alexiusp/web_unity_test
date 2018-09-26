import { reduce } from 'lodash';
import { ActionType, IAction, IBaseAction } from '../models/actions';

/**
 * factory function to create actions in consistent way
 * @param type type of the action to create
 * @param argNames list of arguments names to be provided to the action (can be undefined)
 */
export default function actionBuilder<P>(type: ActionType, ...argNames: Array<keyof P>) {
  if (argNames && argNames.length > 0) {
    return (...args: any[]) => {
      const payload: P = reduce(argNames, (p, arg: keyof P, index: number) => {
        p[arg] = args[index];
        return p;
      }, {} as P);
      argNames.forEach((arg, index) => {
        payload[argNames[index]] = args[index];
      });
      const action: IAction<P> = {
        payload,
        type,
      }
      return action;
    }
  } else {
    return () => {
      const action: IBaseAction = { type };
      return action;
    }
  }
}

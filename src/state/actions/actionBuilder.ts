import { reduce } from 'lodash';
import { ActionType, IAction, IBaseAction } from '../models/actions';

export type ActionResult<P> = P extends void ? IBaseAction : IAction<P>;
export type ActionBuilder<P = void> = P extends void ? () => ActionResult<P> : (...args: any[]) => ActionResult<P>;

export function actionBuilder(type: ActionType) : ActionBuilder;
export function actionBuilder<P>(type: ActionType, ...argNames: Array<keyof P>): ActionBuilder<P>;
export default function actionBuilder<P = void>(type: ActionType, ...argNames: Array<keyof P>): ActionBuilder<P> {
  if (argNames.length > 0) {
    const builder = (...args: any[]) => {
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
    return builder as ActionBuilder<P>;
  } else {
    const builder = () => {
      const action: IBaseAction = { type };
      return action;
    }
    return builder as ActionBuilder<P>;
  }
}

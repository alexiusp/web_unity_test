import { Action } from 'redux';

// import { ApiResponse } from '../../services/apiResponse';

export type ActionType = string;

export interface IBaseAction extends Action<ActionType> { }

export interface IAction<T = any> extends IBaseAction {
  payload: T;
}

/*
export interface ApiResponsePayload {
  response: ApiResponse;
}

export interface ApiResponseAction extends IAction<ApiResponsePayload> { }

export interface UserDependentActionPayload {
  id: number;
}

export interface UserDependentAction extends IAction<UserDependentActionPayload> { }
*/

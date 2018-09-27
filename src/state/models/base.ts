export type Callback = () => void;

export type DataCallback<T=any> = (data: T) => void;

export interface IUnityInstance {
  SendMessage: (objectName: string, methodName: string, value: string) => void,
};

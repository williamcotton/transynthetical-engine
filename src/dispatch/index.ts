export type Action = {
  type: string;
  [key: string]: any;
};

export type Dispatch = (action: Action) => void;

export const dispatch: Dispatch = (action: Action) => {
  // console.log(action);
};

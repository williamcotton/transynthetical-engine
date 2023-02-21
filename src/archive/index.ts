export type ArgType = "string" | "number" | "boolean" | "object" | "array";

export type ArgTypes = {
  [key: string]: ArgType;
}[];

export const archive: Archive = {
  add: (name, func, argTypes) => {
    console.log("ARCHIVE", name, func.toString(), argTypes);
  },
};

export type Archive = {
  add: ArchiveAdd;
};

export type ArchiveAdd = (
  name: string,
  func: (...args: any[]) => any,
  argTypes: ArgTypes
) => void;

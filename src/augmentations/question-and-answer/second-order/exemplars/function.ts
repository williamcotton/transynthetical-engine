import { ThunkSolution } from "../../../../ask";

export const targetType = `thunk`;

export const prompt = `What's the rot13 of "Hello World"?`;

export const en = `The rot13 of 'Hello World' is {answer}.`;

export const context = ``;

// %EXEMPLAR_START%
async function solution(): Promise<ThunkSolution> {
  const sentence = "Hello World";
  function compute_rot13(str: string) {
    return str
      .split("")
      .map((char) => {
        const charCode = char.charCodeAt(0);
        if (charCode >= 65 && charCode <= 90) {
          return String.fromCharCode(((charCode - 65 + 13) % 26) + 65);
        } else if (charCode >= 97 && charCode <= 122) {
          return String.fromCharCode(((charCode - 97 + 13) % 26) + 97);
        } else {
          return char;
        }
      })
      .join("");
  }
  const rot13 = compute_rot13(sentence);
  return { answer: rot13, solutions: [], computed: true };
}
// %EXEMPLAR_END%

export default solution;

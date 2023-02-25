import { Archiver } from "../../archive";
import { Query } from "../../query";
import { ThunkSolution } from "../../ask";

export const targetType = `pthunk`;

export const prompt = `What's the rot13 of "Hello World"?`;

export const en = `The rot13 of 'Hello World' is {answer}.`;

export const context = ``;

// %TRANSLATION_TARGET_RESPONSE_START%
async function solution(
  query: Query,
  archiver: Archiver
): Promise<ThunkSolution> {
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
  const compute_rot13_description = `The function compute_rot13 takes a string as an input and applies the ROT13 encryption algorithm to it. This algorithm shifts each letter in the input string by 13 positions in the alphabet while preserving the case and ignoring non-letter characters. For example, the letter "a" would be transformed into "n", "b" into "o", and so on. The function accomplishes this by splitting the input string into an array of individual characters, mapping each character to its ROT13 equivalent using a combination of character codes and modulo arithmetic, and then rejoining the resulting array of transformed characters into a single string.`;
  await archiver.add(
    "compute_rot13",
    compute_rot13,
    [{ str: "string" }],
    compute_rot13_description
  );
  return { answer: rot13, solutions: [], computed: true, query: false };
}
// %TRANSLATION_TARGET_RESPONSE_END%

export default solution;

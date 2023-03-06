import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `write rot13 and pig latin functions`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const sentence = "Hello World";
  function rot13(str: string) {
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
  await archiver.add(
    "rot13",
    rot13,
    [{ str: "string" }],
    `The function rot13 takes a string as an input and applies the ROT13 encryption algorithm to it. This algorithm shifts each letter in the input string by 13 positions in the alphabet while preserving the case and ignoring non-letter characters. For example, the letter "a" would be transformed into "n", "b" into "o", and so on. The function accomplishes this by splitting the input string into an array of individual characters, mapping each character to its ROT13 equivalent using a combination of character codes and modulo arithmetic, and then rejoining the resulting array of transformed characters into a single string.`,
    `// Example string to encrypt
const message = "Hello, World!";

// Encrypt the message using ROT13
const encrypted = rot13(message);

// Output the encrypted message
console.log(encrypted);`
  );
  function pigLatin(word: string) {
    const vowels = ["a", "e", "i", "o", "u"];
    if (vowels.includes(word[0])) {
      return word + "way";
    }
    for (let i = 1; i < word.length; i++) {
      if (vowels.includes(word[i])) {
        return word.slice(i) + word.slice(0, i) + "ay";
      }
    }
    return word + "ay";
  }
  await archiver.add(
    "pigLatin",
    pigLatin,
    [{ word: "string" }],
    `The function pigLatin takes a string as an input and applies the Pig Latin algorithm to it. This algorithm takes the first consonant (or consonant cluster) of an English word, moves it to the end of the word and suffixes an "ay". If a word begins with a vowel you just add "way" to the end. For example, the word "computer" becomes "omputercay" and "algorithm" becomes "algorithmway". The function accomplishes this by checking if the first letter of the input string is a vowel, and if not, it iterates through the remaining letters of the string until it finds a vowel. It then returns the substring of the input string starting at the first vowel, followed by the substring of the input string starting at the first letter and ending at the first vowel, followed by the string "ay". If the first letter of the input string is a vowel, it simply returns the input string followed by the string "way".`,
    `// Example word to convert
const word = "banana";

// Convert the word to Pig Latin
const pigLatinWord = pigLatin(word);

// Output the Pig Latin version of the word
console.log(pigLatinWord);`
  );
  return {
    answer: ["rot13", "pigLatin"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;

import { Archiver } from "../../../archive";
import { ThunkSolution } from "../../../ask";

export const targetType = `pthunk`;

export const prompt = `write a function that computes standard deviation and finish and archive the app, write a standard deviation app and archive the app. call it standardDeviationApp`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver,
  document: Document
): Promise<ThunkSolution> {
  const contextElement = document.getElementById("context");
  contextElement.innerHTML = "";
  function standardDeviation(numbers: number[]) {
    const mean = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
    const variance =
      numbers.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) /
      numbers.length;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
  }
  await archiver.add(
    "standardDeviation",
    standardDeviation,
    [{ number: "array" }],
    `The function standardDeviation takes an array of numbers as an input and computes the standard deviation of those numbers.`
  );
  async function standardDeviationApp(document: Document) {
    const numberInput = document.getElementById(
      "numberInput"
    ) as HTMLInputElement;
    const numbers = numberInput.value.split(",").map((n) => parseInt(n));
    const standardDeviationInstance = await archiver.get("standardDeviation");
    const result = standardDeviationInstance(numbers);
    contextElement.innerHTML = `<p>standard deviation of ${numbers} is ${result}</p>`;
  }
  await archiver.add(
    "standardDeviationApp",
    standardDeviationApp,
    [{ document: "Document" }],
    `The function standardDeviationApp takes a comma separated array of numbers as input and computes the standard deviation of that array of numbers.`
  );

  return {
    answer: ["standardDeviation", "standardDeviationApp"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;

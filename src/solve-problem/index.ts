import { ask } from "../ask";
import { Dispatch } from "../dispatch";
import { Problem } from "../training-data";

function arrayEquals(a: any[], b: any[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

export async function solve(problem: Problem, dispatch: Dispatch) {
  const solvedProblem = await ask({ prompt: problem.question, dispatch });
  let correct: boolean;
  if (Array.isArray(solvedProblem.answer) && Array.isArray(problem.answer)) {
    correct = arrayEquals(solvedProblem.answer, problem.answer);
  } else {
    correct = solvedProblem.answer === problem.answer;
  }
  return {
    question: problem.question,
    expectedAnswer: problem.answer,
    answer: solvedProblem.answer,
    en_answer: solvedProblem.en_answer,
    correct,
  };
}
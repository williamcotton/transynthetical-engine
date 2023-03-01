import { AnalyticAugmentation } from "../analytic-augmentations";
import { ArchiverFactory } from "../archive";
import { ask } from "../ask";
import { Dispatch } from "../dispatch";
import { LLM } from "../large-language-models";
import { Problem } from "../training-data";

function arrayEquals(a: any[], b: any[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

export async function solve({
  problem,
  dispatch,
  llm,
  analyticAugmentation,
  insertSolution,
  archiverFactory,
}: {
  problem: Problem;
  dispatch: Dispatch;
  llm: LLM;
  analyticAugmentation: AnalyticAugmentation;
  archiverFactory: ArchiverFactory;
  insertSolution: any;
}) {
  const solvedProblem = await ask({
    prompt: problem.question,
    dispatch,
    insertSolution,
    llm,
    analyticAugmentation,
    archiverFactory,
  });
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

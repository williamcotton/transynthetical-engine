import { Augmentation } from "../augmentations";
import { ask } from "../ask";
import { Datastore } from "../datastore";
import { Dispatch } from "../dispatch";
import { LLM } from "../large-language-models";
import { QueryEngine } from "../query";

export type QAProblem = {
  Answer: {
    Aliases: string[];
  };
  Question: string;
  QuestionId: string;
};

export async function solve({
  problem,
  dispatch,
  llm,
  augmentation,
  order = 3,
  datastore,
  queryEngines,
}: {
  problem: QAProblem;
  dispatch: Dispatch;
  llm: LLM;
  augmentation: Augmentation;
  order?: number;
  datastore: Datastore;
  queryEngines: QueryEngine[];
}) {
  const solvedProblem = await ask({
    prompt: problem.Question,
    dispatch: () => {},
    llm,
    augmentation,
    order,
    datastore,
    queryEngines,
  });
  let correct: boolean = false;

  if (solvedProblem.answer && solvedProblem.answer.toLowerCase) {
    problem.Answer.Aliases.forEach((a) => {
      const lowerAlias = a.toLowerCase();
      const lowerSolvedProblem = solvedProblem.answer.toLowerCase();
      if (lowerAlias === lowerSolvedProblem) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(" ", "")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(" ", "-")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(" ", "_")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(" ", ".")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(" ", ",")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(" ", ";")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(" ", ":")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace("-", " ")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace("_", " ")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(".", " ")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(",", " ")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(";", " ")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(":", " ")) {
        correct = true;
      }
      if (lowerAlias === lowerSolvedProblem.replace(" ", "")) {
        correct = true;
      }
      if (lowerSolvedProblem.includes(lowerAlias)) {
        correct = true;
      }
      if (lowerAlias.includes(lowerSolvedProblem)) {
        correct = true;
      }
    });
  }

  return {
    question: problem.Question,
    expectedAnswer: problem.Answer,
    answer: solvedProblem.answer,
    en_answer: solvedProblem.en_answer,
    correct,
  };
}

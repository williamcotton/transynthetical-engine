import React from "react";

import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `thunk`;

export const prompt = `make a simple app called AlertApp and archive it and then execute it\n\nthe app should have a form input element with a button that says "alert me" and a text input element with a placeholder that says "enter your name"\n\nwhen the button is clicked it should alert the user with the text "hello" and the value of the text input element`;

export const context = `(application) async function AlertApp(query: any, archiver: Archiver, document: Document): undefined`;

// %EXEMPLAR_START%
async function solution(): Promise<ThunkSolution> {
  function AlertApp() {
    return (
      <div>
        <input type="text" placeholder="enter your name" />
        <button onClick={() => alert("hello")}>alert me</button>
      </div>
    );
  }

  return {
    answer: AlertApp,
    en_answer: "AlertApp",
    solutions: [],
    computed: true,
  };
}
// %EXEMPLAR_END%

export default solution;

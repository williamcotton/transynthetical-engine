# transynthetical-engine

Applied methods of [analytical augmentation](https://github.com/williamcotton/empirical-philosophy/blob/main/articles/from-prompt-alchemy-to-prompt-engineering-an-introduction-to-analytic-agumentation.md) to build tools using large-language models.

## Install

```
$ npm install
$ make .env
```

Edit `OPENAI_API_KEY` and `WOLFRAM_ALPHA_API_KEY`.

## Question-And-Answer

To run the question-and-answer augmentation with a sample question:

```
$ make
```

The default question is the rather nonsensical `What is the population of Geneseo, NY combined with the population of Rochester, NY, divided by string length of the answer to the question 'What is the capital of France?'?`

The question-and-answer augmentation includes a number of exemplars expecting a user message:

```
Question: Context() ExistingArchivedFunctions() What is the population of Geneseo, NY combined with the population of Rochester, NY, divided by string length of the answer to the question 'What is the capital of France?'?
```

Which the assistant would respond with:

```js
(async function solution(query, archiver) {
  const [populationOfGeneseo, populationOfRochester, lengthOfCapital] =
    await Promise.all([
      query({
        prompt: "What is the population of Geneseo, NY?",
        topic: "Geneseo, NY",
        target: "population",
        type: "number",
      }),
      query({
        prompt: "What is the population of Rochester, NY?",
        topic: "Rochester, NY",
        target: "population",
        type: "number",
      }),
      query({
        prompt: "What is the capital of France?",
        topic: "France",
        target: "capital",
        type: "string",
      }),
    ]);
  const populationOfGeneseoPlusPopulationOfRochester =
    populationOfGeneseo.answer + populationOfRochester.answer;
  const answer =
    populationOfGeneseoPlusPopulationOfRochester /
    lengthOfCapital.answer.length;
  return {
    answer: answer,
    solutions: [],
    computed: true,
    query: true,
  };
});
```

The `query()` function will use a number of external sources including Wikipedia, Wolfram Alpha, and Duck Duck Go combined with a nested call to the LLM to properly parse the query for further computation.

This means that this particular question made four total calls to the LLM. The first was to build the nested queries and the other three to parse the response from the search engines.

In essence the question-and-answer exemplars used in the few-shot instructions have tought the engine to use a JavaScript interpreter that has access to a specialized `query` function.

## Browser Builder

Another included augmentation assists with constructing web applications.

Given the following request:

```
make a new application called Draw50RandomCirclesWebApplication_v0_0_0

it should have a canvas element that is 320x480
the canvas element should have a black border and a drop shadow
the buttons should be the same size and have meaningful tasteful, pale colors, succinct and friendly text and emoji icons
it should have a button that draws 50 random circles when clicked
it should have a button that clears the canvas when clicked

use an instance of the Draw50RandomCirclesWebApplication to demonstrate to the user that it works
```

Becomes the augmented user prompt:

```
Context(<div id="context"></div>)
ExistingArchivedFunctions()
Instructions: make a new application called Draw50RandomCirclesWebApplication_v0_0_0

it should have a canvas element that is 320x480
the canvas element should have a black border and a drop shadow
the buttons should be the same size and have meaningful tasteful, pale colors, succinct and friendly text and emoji icons
it should have a button that draws 50 random circles when clicked
it should have a button that clears the canvas when clicked

use an instance of the Draw50RandomCirclesWebApplication to demonstrate to the user that it works -
```

You'll notice that there is HTML context provided. The browser-builder augmentation assumes that there is a browser `document` in scope during evaluation of the code returned by the LLM.

```js
(async function solution(query, archiver, document) {
  const Draw50RandomCirclesWebApplication_v0_0_0 = await archiver.build({
    name: "Draw50RandomCirclesWebApplication_v0_0_0",
    prompt:
      "make a new application called Draw50RandomCirclesWebApplication_v0_0_0\n\nit should have a canvas element that is 320x480\nthe canvas element should have a black border and a drop shadow\nthe buttons should be the same size and have meaningful tasteful, pale colors, succinct and friendly text and emoji icons\nit should have a button that draws 50 random circles when clicked\nit should have a button that clears the canvas when clicked\n\nuse an instance of the Draw50RandomCirclesWebApplication to demonstrate to the user that it works",
    argTypes: [
      { query: "any" },
      { archiver: "Archiver" },
      { document: "Document" },
    ],
    returnType: "undefined",
    description:
      "A web application that draws 50 random circles on a canvas when the user clicks a button, and clears the canvas when another button is clicked.",
    isApplication: true,
  });
  await Draw50RandomCirclesWebApplication_v0_0_0(query, archiver, document);
  return {
    answer: ["Draw50RandomCirclesWebApplication_v0_0_0"],
    solutions: [],
    computed: true,
    query: false,
  };
});
```

However, instead of writing the JavaScript for our Draw50RandomCircles application directly this augmentation instead calls the `archiver.build()` function. Similar to the `query` function this will also make an additional call to an LLM. This `build` function stores the result in a database.

The prompt used by the `build` function:

```
Context((application) async function Draw50RandomCirclesWebApplication_v0_0_0(query: any, archiver: Archiver, document: Document): undefined [A web application that draws 50 random circles on a canvas when the user clicks a button, and clears the canvas when another button is clicked.])
ExistingArchivedFunctions()
Instructions: make a new application called Draw50RandomCirclesWebApplication_v0_0_0

it should have a canvas element that is 320x480
the canvas element should have a black border and a drop shadow
the buttons should be the same size and have meaningful tasteful, pale colors, succinct and friendly text and emoji icons
it should have a button that draws 50 random circles when clicked
it should have a button that clears the canvas when clicked

use an instance of the Draw50RandomCirclesWebApplication to demonstrate to the user that it works -
```

Results in:

```js
(async function solution() {
  async function Draw50RandomCirclesWebApplication_v0_0_0(
    query,
    archiver,
    document
  ) {
    const body = document.body;
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 480;
    canvas.style.border = "1px solid black";
    canvas.style.boxShadow = "2px 2px 4px rgba(0, 0, 0, 0.4)";
    const context = canvas.getContext("2d");
    const buttonContainer = document.createElement("div");
    const drawButton = document.createElement("button");
    drawButton.innerText = "Draw 50 Random Circles 🟠";
    drawButton.style.backgroundColor = "#F7D488";
    drawButton.style.margin = "10px";
    const clearButton = document.createElement("button");
    clearButton.innerText = "Clear Canvas 🟥";
    clearButton.style.backgroundColor = "#E37373";
    clearButton.style.margin = "10px";
    buttonContainer.appendChild(drawButton);
    buttonContainer.appendChild(clearButton);
    body.appendChild(canvas);
    body.appendChild(buttonContainer);
    drawButton.onclick = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 50; ++i) {
        const radius = Math.floor(Math.random() * 20) + 10;
        const x =
          Math.floor(Math.random() * (canvas.width - 2 * radius)) + radius;
        const y =
          Math.floor(Math.random() * (canvas.height - 2 * radius)) + radius;
        const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
        context.closePath();
      }
    };
    clearButton.onclick = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }
  return {
    answer: Draw50RandomCirclesWebApplication_v0_0_0,
    en_answer: "Draw50RandomCirclesWebApplication_v0_0_0",
    solutions: [],
    computed: true,
  };
});
```

![Screenshot 2023-04-20 at 10 10 58 AM](https://user-images.githubusercontent.com/13163/233414396-81ab36da-dcb2-4b2f-91eb-715fe01a4f9f.png)
![Screenshot 2023-04-20 at 10 11 06 AM](https://user-images.githubusercontent.com/13163/233414392-2ce1710f-6262-446f-a0f2-52ce57469c97.png)

Which is the function returned by `archiver.build` in the primary query.

The reason for the additional query is so that the dialog of messages isn't cluttered with JavaScript.

It turns out that we don't like the icons used, so we make an additional request:

```
Build a new version but choose different icons that are more visual and less abstract.
```

But we explictily reference the existing application:

```
Context(<div id="context"></div>)
ExistingArchivedFunctions()
Instructions: Reference: Draw50RandomCirclesWebApplication_v0_0_0 - Build a new version but choose different icons that are more visual and less abstract. -
```

Which results in:

```js
(async function solution(query, archiver, document) {
  const Draw50RandomCirclesWebApplication = await archiver.rebuild({
    prompt:
      "Reference: Draw50RandomCirclesWebApplication_v0_0_0 - Build a new version but choose different icons that are more visual and less abstract.",
    name: "Draw50RandomCirclesWebApplication_v0_0_0",
  });
  return {
    answer: ["Draw50RandomCirclesWebApplication_v0_0_0"],
    solutions: [],
    computed: true,
    query: false,
  };
});
```

Here the `archiver.rebuild` function is used. This will make a nested call to the LLM but with the first version of the code:

```
Context(Rebuild: %%%async function Draw50RandomCirclesWebApplication_v0_0_0(query, archiver, document) {
        const body = document.body;
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 480;
        canvas.style.border = "1px solid black";
        canvas.style.boxShadow = "2px 2px 4px rgba(0, 0, 0, 0.4)";
        const context = canvas.getContext("2d");
        const buttonContainer = document.createElement("div");
        const drawButton = document.createElement("button");
        drawButton.innerText = "Draw 50 Random Circles 🟠";
        drawButton.style.backgroundColor = "#F7D488";
        drawButton.style.margin = "10px";
        const clearButton = document.createElement("button");
        clearButton.innerText = "Clear Canvas 🟥";
        clearButton.style.backgroundColor = "#E37373";
        clearButton.style.margin = "10px";
        buttonContainer.appendChild(drawButton);
        buttonContainer.appendChild(clearButton);
        body.appendChild(canvas);
        body.appendChild(buttonContainer);
        drawButton.onclick = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < 50; ++i) {
                const radius = Math.floor(Math.random() * 20) + 10;
                const x = Math.floor(Math.random() * (canvas.width - 2 * radius)) + radius;
                const y = Math.floor(Math.random() * (canvas.height - 2 * radius)) + radius;
                const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
                context.beginPath();
                context.arc(x, y, radius, 0, 2 * Math.PI);
                context.fillStyle = color;
                context.fill();
                context.closePath();
            }
        };
        clearButton.onclick = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        };
    }%%%)
ExistingArchivedFunctions()
Instructions: Reference: Draw50RandomCirclesWebApplication_v0_0_0 - Build a new version but choose different icons that are more visual and less abstract. -
```

Which results in:

```js
(async function solution() {
  async function Draw50RandomCirclesWebApplication_v0_0_1(
    query,
    archiver,
    document
  ) {
    const body = document.body;
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 480;
    canvas.style.border = "1px solid black";
    canvas.style.boxShadow = "2px 2px 4px rgba(0, 0, 0, 0.4)";
    const context = canvas.getContext("2d");
    const buttonContainer = document.createElement("div");
    const drawButton = document.createElement("button");
    drawButton.innerText = "🎨 Draw 50 Random Circles";
    drawButton.style.backgroundColor = "#F7D488";
    drawButton.style.margin = "10px";
    const clearButton = document.createElement("button");
    clearButton.innerText = "🧹 Clear Canvas";
    clearButton.style.backgroundColor = "#E37373";
    clearButton.style.margin = "10px";
    buttonContainer.appendChild(drawButton);
    buttonContainer.appendChild(clearButton);
    body.appendChild(canvas);
    body.appendChild(buttonContainer);
    drawButton.onclick = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 50; ++i) {
        const radius = Math.floor(Math.random() * 20) + 10;
        const x =
          Math.floor(Math.random() * (canvas.width - 2 * radius)) + radius;
        const y =
          Math.floor(Math.random() * (canvas.height - 2 * radius)) + radius;
        const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
        context.closePath();
      }
    };
    clearButton.onclick = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }
  return {
    answer: Draw50RandomCirclesWebApplication_v0_0_1,
    en_answer: "Draw50RandomCirclesWebApplication_v0_0_1",
    solutions: [],
    computed: true,
  };
});
```

![Screenshot 2023-04-20 at 10 19 48 AM](https://user-images.githubusercontent.com/13163/233414521-2e983084-d477-4490-ad12-fe6b8da42254.png)
![Screenshot 2023-04-20 at 10 19 59 AM](https://user-images.githubusercontent.com/13163/233414517-4e1a88f1-0749-4483-9201-3d93ef776ab4.png)

The dialog of messages, including the initial exemplars used for system, user and assistant messages, consists of higher-level JavaScript that orchestrates additional LLM tools to write or rewrite the actual code. LLM tokens are a limited resource when it comes to interactivity and interactions can quickly reach the token limit. Another benefit of separating the `build` and `rebuild` functionality from a specific dialog is that an entirely new dialog can be started with the same code.

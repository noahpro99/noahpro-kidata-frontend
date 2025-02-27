"use client"

import { useRef, useState } from "react";

import { Workspace } from "blockly";
import { javascriptGenerator } from "blockly/javascript";

import useWorkspace from "@/components/Blockly/useWorkspace";
import toolbox from "./_toolbox";
import Link from "next/link";

// testing build:
class AssertError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// assertion
const referenceConvert = (a: number) => {
  return (a - 32)  * 5 / 9;
}

const test = (actual: any, expected: any) => {
  if (Math.abs(actual - expected) > 0.25) {
    throw new AssertError(`Expected ${expected}, got ${actual}`);
  }
}
test(1, 1);

const setupTestCode = (code: string) => {
  const testSamples = Array.from(
    { length: 100 }, 
    () => Math.floor(Math.random() * 500 + 1)
  );
  
  const testCode = testSamples
    .map((a, _) => `${test.name}(convert(${a}), ${referenceConvert(a)});`)
    .join('\n');
  
  return `${code}\n${testCode}`;
}

const interpretError = (e: any) => {
  if (e instanceof AssertError) {
    return "Looks like a test case failed! Look for the matching case below, and see if your solution works for the two input values.";
  }
  if (e instanceof ReferenceError) {
    return "Looks like we couldn't find your function. Did you name your function \"convert\"?";
  }
  else if (e instanceof TypeError) {
  }
  // else if (e instanceof ...) {
  // }

  return "";
}

export default function BlocklyDemo() {
  const workspaceRef = useRef(null);

  const [codeOutput, setCodeOutput] = useState<string>();
  // if undefined, we had a successful test!:
  const [codeResult, setCodeResult] = useState<Error | boolean>();

  useWorkspace({
    ref: workspaceRef,
    toolboxDefinition: toolbox,
    onWorkspaceChange: (workspace: Workspace) => {
      setCodeOutput(javascriptGenerator.workspaceToCode(workspace));

      if (!codeOutput) {
        // reset result state:
        setCodeResult(undefined);
      }
    }
  });

  const runTests = () => {
    if (!codeOutput) {
      return;
    }

    const testingCode = setupTestCode(codeOutput);

    try {
      eval(testingCode);
      setCodeResult(true);
    }
    catch (e: any) {
      setCodeResult(e);
      return;
    }
  }

  let codeResultElement;

  if (!codeResult) {
    codeResultElement = <p>Run your code to get insight about bugs!</p>;
  }
  // if we reach an error, display it and give an explanation (if possible):
  else if (codeResult instanceof Error) {
    codeResultElement = (
      <>
        <pre className="font-mono text-red-500">
          {`Error: ${codeResult.message}`}
        </pre>
        <p>{interpretError(codeResult)}</p>
      </>
    );
  }
  else if (codeResult === true) {
    codeResultElement = (
      <p className="text-green-500">
        Your solution worked! Nice job!
      </p>
    );
  }
  
  return (
    <div className="mx-auto my-4 max-w-6xl">
      <section className="mb-2">
        <h1 className="font-bold text-xl">Blockly Demo</h1>
        <p>
          Create a function called &quot;convert&quot; that takes an input: <code>x</code> in Fahrenheit and converts it to Celsius. Don&apos;t be afraid to look things up!
        </p>
        <p className="text-sm text-black/50">
          Hint: You can get Celsius by subtracting 32 from Fahrenheit, and then multiplying it by the fraction 5 / 9! Like the &quot;add&quot; problem, use the blocks in &quot;Math&quot;!
        </p>
      </section>

      <div className="flex flex-row justify-between">
        <button 
          onClick={runTests}
          className="my-1 px-2 py-1 bg-white rounded-sm hover:bg-blue-100 transition-colors outline outline-1 outline-black/20 hover:shadow-md shadow-black"
        >
          Test my code!
        </button>

        <div className="flex flex-row gap-1 my-auto">
          <Link 
            href="/blockly/add"
            className="my-1 px-2 py-1 bg-white rounded-sm hover:bg-blue-100 transition-colors outline outline-1 outline-black/20 hover:shadow-md shadow-black"
          >
            Back to previous lesson
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 h-[600px] mb-2">
        <div 
          ref={workspaceRef}
          className="mx-auto mb-2 flex-grow h-full"
        />

        <div className="card p-4 max-w-xs">
          <section className="mb-2 text-sm">
            <h1 className="font-bold text-xl">Testing</h1>
            { codeResultElement }
          </section>

          <section className="text-sm">
            <h1 className="font-bold text-xl">Your Code</h1>
            {
              codeOutput
                ? <p className="font-mono break-words">{codeOutput}</p>
                : <p>Write some code and it&apos;ll pop up here!</p>
            }
          </section>
        </div>
      </div>
    </div>
  );
}

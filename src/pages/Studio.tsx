import { Prompt } from "../components/prompt";

export function Studio() {
  return (
    <div className="p-6 max-w-4xl h-screen mx-auto space-y-10 justify-center items-center content-center text-center">
      <img className="h-5 w-5" src="/microfone.svg" alt="Studio" />
      <h1 className="text-5xl font-bold text-white">Audio Studio</h1>
      <Prompt />
    </div>
  );
}

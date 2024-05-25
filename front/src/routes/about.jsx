import { OutsideLink } from "../components/more";

export default function About() {
  return (
    <section className="mx-auto p-4 max-w-[65ch] w-full text-slate-700">
      <header className="">
        <h2 className="text-4xl font-bold">About</h2>
      </header>
      <article className="flex flex-col gap-3 py-4">
        <p className="">
          This project is made to showcase the{" "}
          <OutsideLink to="https://github.com/minhhoccode111/messaging-app-back">
            {" "}
            Messaging App Back{" "}
          </OutsideLink>{" "}
          developed for{" "}
          <OutsideLink to="https://www.theodinproject.com/lessons/nodejs-messaging-app">
            {" "}
            The Odin Project&apos;s NodeJS course{" "}
          </OutsideLink>
          .
        </p>

        <p className="">
          This project&apos;s backend uses free tier hosting on{" "}
          <OutsideLink to={"https://glitch.com"}>Glitch</OutsideLink>, which can
          cause significant delays in the server&apos;s response time for API
          requests or data fetching.
        </p>

        <p className="">
          However, I still really appreciate the fact that Glitch offers a free
          tier for hosting Backend projects.
        </p>
      </article>
    </section>
  );
}

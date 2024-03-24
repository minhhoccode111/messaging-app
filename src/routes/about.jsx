export default function About() {
  return (
    <section className="mx-auto my-12 p-4 max-w-[65ch] w-full text-slate-700">
      <header className="">
        <h2 className="text-4xl font-bold">About</h2>
      </header>
      <article className="flex flex-col gap-3 py-4">
        <p className="">To win this game you have to find 3 hidden characters.</p>
        <p className="">
          <a href="https://github.com/minhhoccode111/personal-portfolio" target="_blank" rel="noopener" className="text-link underline decoration-dotted hover:decoration-solid">
            Project
          </a>{' '}
          is made by{' '}
          <a href="https://github.com/minhhoccode111" target="_blank" rel="noopener" className="text-sky-500 underline decoration-dotted hover:decoration-solid">
            minhhoccode111
          </a>
          .
        </p>

        <p className="">
          To showcase the{' '}
          <a href="https://github.com/minhhoccode111/wheres-waldo-back" target="_blank" rel="noopener" className="text-link underline decoration-dotted hover:decoration-solid">
            Where&apos;s Waldo (A photo tagging app)
          </a>{' '}
          developed for{' '}
          <a
            href="https://www.theodinproject.com/lessons/nodejs-where-s-waldo-a-photo-tagging-app"
            target="_blank"
            rel="noopener"
            className="text-link underline decoration-dotted hover:decoration-solid"
          >
            The Odin Project&apos;s NodeJS course
          </a>
          .
        </p>

        <p className="">This project&apos;s backend uses free tier hosting on Glitch, which can cause significant delays in the server&apos;s response time for API requests or data fetching.</p>
      </article>
    </section>
  );
}

import { OutsideLink, FakeLink } from '../components/more';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="mx-auto p-4 max-w-[65ch] w-full text-slate-700">
      <header className="">
        <h2 className="text-4xl font-bold">About</h2>
      </header>
      <article className="flex flex-col gap-3 py-4">
        <p className="">
          Simple message app <span className="text-danger font-bold"> without </span>real time update
        </p>
        <p className="">
          <OutsideLink to={'https://github.com/minhhoccode111/messaging-app-front'}>Project</OutsideLink> is made by{' '}
          <OutsideLink to={'https://github.com/minhhoccode111'}> minhhoccode111 </OutsideLink>.
        </p>

        <p className="">
          To showcase the <OutsideLink to="https://github.com/minhhoccode111/messaging-app-back"> Messaging App Back </OutsideLink> developed for{' '}
          <OutsideLink to="https://www.theodinproject.com/lessons/nodejs-messaging-app"> The Odin Project&apos;s NodeJS course </OutsideLink>.
        </p>

        <p className="">
          This project&apos;s backend uses free tier hosting on <OutsideLink to={'https://glitch.com'}>Glitch</OutsideLink>, which can cause significant delays in the server&apos;s response time for
          API requests or data fetching. (However, I still really appreciate the fact that Glitch offers a free tier for hosting Backend projects.)
        </p>

        <p className="font-bold">No responsive design supported, consider using large screen size for better experience.</p>

        <p className="font-bold text-2xl">
          Since this is a chat app, you will need to{' '}
          <Link to="/login">
            <FakeLink>login</FakeLink>
          </Link>{' '}
          before doing anything.
        </p>
      </article>
    </section>
  );
}

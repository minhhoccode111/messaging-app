import { Link } from 'react-router-dom';
import WallyIntro from '../assets/wally-intro.png';

export default function Index() {
  return (
    <section className="flex-1 flex flex-col">
      {/* background image */}
      <div className="fixed -z-10 top-10 left-1/2 -translate-x-wally w-full max-w-sm bg-white overflow-hidden">
        <img src={WallyIntro} alt="Background image" className="object-cover object-center h-full w-full brightness-90" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-16 sm:gap-32">
        <div className="text-link ripper underline hover:decoration-2 underline-offset-4 tracking-widest p-4">
          <h1 className="font-bold text-xl whitespace-nowrap">I am Waldo!</h1>
        </div>

        <div className="border-2 h-0 border-sky-500 relative self-stretch">
          <Link className="ripper p-4 underline hover:decoration-2 underline-offset-4 flex items-center tracking-widest absolute right-3/4 translate-x-1/2 bottom-0 translate-y-1/2 z-10" to={'game'}>
            <span className="text-xl font-bold whitespace-nowrap">Find me</span>
          </Link>

          <Link className="ripper p-4 underline hover:decoration-2 underline-offset-4 flex items-center tracking-widest absolute right-1/4 translate-x-1/2 bottom-0 translate-y-1/2 z-10" to={'score'}>
            <span className="text-xl font-bold whitespace-nowrap">Score</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

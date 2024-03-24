import { AiOutlineLoading } from 'react-icons/ai';
import { IoIosCloseCircleOutline, IoIosMenu } from 'react-icons/io';
import { RiSignalWifiErrorFill } from 'react-icons/ri';
import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export function Loading({ className = 'text-2xl' }) {
  return (
    <span className={'animate-spin block ' + className}>
      <AiOutlineLoading className={''} />
    </span>
  );
}

export function Error({ className = 'text-2xl' }) {
  return (
    <span className={className}>
      <RiSignalWifiErrorFill className="" />
    </span>
  );
}

export function NavigateButton() {
  return <></>;
}

export function CustomButton() {
  return <></>;
}

export function Character({ char }) {
  return (
    <div className={'flex gap-2 flex-col items-center mx-4 p-1' + ' ' + (char?.found && 'opacity-25')}>
      <div className="h-20">
        <img src={char.link} alt={char.name + ' picture.'} className="block h-full" />
      </div>
      <div className="capitalize font-bold">{char.name}</div>
    </div>
  );
}

export function GameResult({ score }) {
  const firstFound = (new Date(score.firstFound).getTime() - score?.startTimeUnix) / 1000;
  const secondFound = (new Date(score.secondFound).getTime() - score?.startTimeUnix) / 1000;
  const endTime = (new Date(score.endTime).getTime() - score?.startTimeUnix) / 1000;
  return (
    <li className="grid grid-cols-5 gap-2 items-center">
      <p className="">{score.name}</p>
      <div className="text-xs text-center place-self-center">
        <p className="">{score?.startTimeFormatted?.split('-')[1]}</p>
        <p className="">{score?.startTimeFormatted?.split('-')[0]}</p>
      </div>
      <p className="place-self-center">{isNaN(firstFound) ? '_' : firstFound}</p>
      <p className="place-self-center">{isNaN(secondFound) ? '_' : secondFound}</p>
      <p className="self-center justify-self-end">{isNaN(endTime) ? '_' : endTime}</p>
    </li>
  );
}

export function Timer({ startTime, timePlayed }) {
  // current unix time
  const [now, setNow] = useState(0);

  // reference of setInterval
  const intervalRef = useRef(null);

  // millisec / frame = milliseconds that need when a frame re-new
  const frame = 1000 / 60;

  // call this when Timer start rendering
  const start = useCallback(
    function start() {
      intervalRef.current = setInterval(() => {
        // set current unix time after each frame time
        setNow(Date.now());
      }, frame);
    },
    [frame]
  );

  // call start when render
  useEffect(() => {
    if (timePlayed === 0) start();
    else clearInterval(intervalRef.current);
  }, [timePlayed, start]);

  // if endTime exists stop watch
  if (timePlayed) return <div className="font-bold text-xl p-4">Timer: {timePlayed}ms</div>;

  // calculate to seconds
  return <div className="font-bold text-xl p-4">Timer: {(now - startTime) / 1000}</div>;
}

export function Footer() {
  return (
    <footer className="p-8 grid place-items-center">
      <p className="">
        <a href="https://github.com/minhhoccode111/wheres-waldo-front" target="_blank" rel="noopener" className="text-link underline decoration-dotted hover:decoration-solid">
          This
        </a>{' '}
        is made by{' '}
        <a href="https://github.com/minhhoccode111" target="_blank" rel="noopener" className="text-sky-500 underline decoration-dotted hover:decoration-solid">
          minhhoccode111
        </a>
        .
      </p>
    </footer>
  );
}

export function RipperLink({ children, to }) {
  return (
    <div className="border-2 h-0 border-sky-500 relative self-stretch">
      <Link className="ripper px-8 py-8 underline hover:decoration-2 underline-offset-4 flex items-center tracking-widest absolute right-1/2 translate-x-1/2 bottom-0 translate-y-1/2 z-10" to={to}>
        <span className="text-xl font-bold whitespace-nowrap">{children}</span>
      </Link>
    </div>
  );
}

export function RipperButton({ children, onClick }) {
  return (
    <div className="border-2 h-0 border-sky-500 relative self-stretch">
      <button
        className="ripper px-8 py-8 underline hover:decoration-2 underline-offset-4 flex items-center tracking-widest absolute right-1/2 translate-x-1/2 bottom-0 translate-y-1/2 z-10"
        onClick={onClick}
      >
        <span className="text-xl font-bold whitespace-nowrap">{children}</span>
      </button>
    </div>
  );
}

export function Header() {
  // hamburger menu state
  const [isShowMenu, setIsShowMenu] = useState(false);

  return (
    <header
      id="header"
      className={
        'flex gap-3 sm:gap-5 md:gap-7 lg:gap-9 items-center p-4 sm:p-5 md:p-6 lg:p-7 shadow-lg shadow-gray-300 text-slate-700 bg-white'
        // + ' ' +  (pathname !== '/' && 'bg-slate-50')
      }
      // color base on url path
    >
      {/* hamburger button */}
      <nav className={'sm:hidden'}>
        {/* click to toggle menu */}
        <button className="hover:bg-gray-300 hover:text-black p-2 max-sm:rounded-xl rounded-md transition-all text-4xl" onClick={() => setIsShowMenu(!isShowMenu)}>
          <IoIosMenu />
        </button>
      </nav>

      {/* all nav links */}
      <nav
        className={
          'flex max-sm:flex-col max-sm:gap-8 max-sm:text-4xl max-sm:fixed max-sm:top-0 max-sm:bottom-0 max-sm:right-0 max-sm:z-30 max-sm:bg-[#ffffff99] max-sm:px-8 max-sm:py-20 max-sm:shadow-2xl max-sm:text-right max-sm:w-3/4 max-sm:backdrop-blur-sm max-sm:items-stretch transition-all origin-top items-center gap-1 md:gap-3 lg:gap-5 text-lg md:text-xl' +
          ' ' +
          (isShowMenu ? 'max-sm:scale-y-100' : 'max-sm:scale-y-0')
          // show or hide base on isShowMenu
        }
      >
        {/* close button */}
        <button className="sm:hidden mt-1 text-4xl absolute top-0 right-0 p-4" onClick={() => setIsShowMenu(!isShowMenu)}>
          <IoIosCloseCircleOutline className="text-red-500 rounded-full hover:text-white hover:bg-red-500 transition-all" />
        </button>

        {/* link to index route */}
        <NavLink
          className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
          to={'/'}
        >
          Home
        </NavLink>

        {/* link to about section */}
        <NavLink
          className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
          to={'game'}
        >
          Game
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
          to={'score'}
        >
          Score
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
          to={'about'}
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}

Error.propTypes = {
  className: PropTypes.string,
};

Loading.propTypes = Error.propTypes;

RipperLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  to: PropTypes.string.isRequired,
};

RipperButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClick: PropTypes.func.isRequired,
};

Character.propTypes = {
  char: PropTypes.object.isRequired,
};

GameResult.propTypes = {
  score: PropTypes.object.isRequired,
};

Timer.propTypes = {
  startTime: PropTypes.number.isRequired,
  timePlayed: PropTypes.number.isRequired,
};

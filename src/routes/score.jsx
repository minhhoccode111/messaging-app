import { useEffect, useState } from 'react';
import { RiArrowUpDoubleLine } from 'react-icons/ri';
// import { matchSorter } from 'match-sorter';
import axios from 'axios';
import { Loading, Error, GameResult } from './../components';

// custom hook to fetch score data
function useScoreData() {
  const [scoreData, setScoreData] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function tmp() {
      try {
        setIsLoading(true);

        const res = await axios({
          method: 'get',
          url: import.meta.env.VITE_API_ORIGIN + '/game',
        });

        console.log(res.data.games);
        setScoreData(res.data.games);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    tmp();
  }, []);

  return { scoreData, setScoreData, isError, setIsError, isLoading, setIsLoading };
}

export default function Blog() {
  // sticky search header
  const [isSticky, setIsSticky] = useState(false);

  const { scoreData, setScoreData, isError, setIsError, isLoading, setIsLoading } = useScoreData();

  // make search bar stick to the top when start scrolling
  useEffect(() => {
    const stickSearch = document.getElementById('stick-search');
    const sticky = stickSearch?.offsetTop;
    const handleScroll = () => {
      if (!sticky) return;
      if (window.scrollY > sticky) setIsSticky(true);
      else setIsSticky(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [isCleared, setIsCleared] = useState(false);

  // clear bloated plays
  async function handleClear() {
    try {
      setIsLoading(true);

      const res = await axios({
        method: 'delete',
        url: import.meta.env.VITE_API_ORIGIN + '/game',
      });

      // console.log(res.data);

      // delete method will send back new games array after it clear bloated ones
      setScoreData(res.data.games);

      // stop user from spamming
      setIsCleared(true);
    } catch (error) {
      setIsError(true);
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  let jsx;

  // there server error or connection error when fetching scores
  if (isError) {
    jsx = (
      <div className="mx-auto grid place-items-center text-warn">
        <Error className="text-8xl" />
      </div>
    );
  }
  // is fetching
  else if (isLoading) {
    jsx = (
      <div className="mx-auto grid place-items-center text-warn">
        <Loading className="text-8xl" />
      </div>
    );
  }
  // data available
  else {
    jsx = (
      <>
        <div className="flex items-center justify-evenly gap-4 text-slate-900 font-bold p-8">
          <p className="">Plays: {scoreData?.length}</p>
          <div className="">
            {isCleared ? (
              <p className="text-success">Cleared!</p>
            ) : (
              <button onClick={handleClear} className="text-link underline decoration-dotted underline-offset-4 hover:decoration-solid">
                Clear NaN
              </button>
            )}
          </div>
        </div>
        <ul className="flex flex-col gap-8 p-6 rounded-lg shadow-2xl text-slate-900">
          <li className="grid grid-cols-5 gap-2 font-bold text-warn">
            <p className="place-self-start self-center">Player</p>
            <p className="place-self-center">Played at</p>
            <p className="place-self-center">1st found (s)</p>
            <p className="place-self-center">2nd found (s)</p>
            <p className="place-self-end text-danger">Total (s)</p>
          </li>
          {/* {reduceState.scores.map((score) => ( */}
          {scoreData?.map((score) => (
            <GameResult score={score} key={score.id} />
          ))}
        </ul>
      </>
    );
  }

  return (
    <section className="">
      {/* padding element so that the header don't seem like teleport when it sticky to top */}
      <div className={'text-transparent px-8 py-4 border' + ' ' + (isSticky ? '' : 'hidden')}>Made with by minhhoccode111</div>
      <div
        id="stick-search"
        className={
          'flex gap-2 sm:gap-3 md:gap-4 items-end justify-center md:justify-end transition-all px-4 py-2 sm:px-8 sm:py-4 bg-white' + ' ' + (isSticky ? 'fixed top-0 left-0 right-0 z-20 shadow-xl' : '')
        }
      >
        {/* divider */}
        <div className="hidden md:block border-b-8 border-sky-500 flex-1 scale-x-150 origin-right"></div>

        {/* search field */}
        <div className="max-sm:w-1/3">
          <label htmlFor="search-input" className="relative block rounded-md sm:rounded-lg border border-gray-200 shadow-sm focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500">
            <input
              id="search-input"
              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 sm:text-lg"
              placeholder="Search for..."
              type="search"
              name="q"
              // onChange={handleSearchChange}
            />

            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:-top-1 peer-focus:text-xs peer-focus:sm:text-sm">
              Search
            </span>
          </label>
        </div>

        {/* filter category */}
        <div className="">
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            <div className="">
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-900">
                {' '}
                Sort{' '}
              </label>
              <select
                // onChange={handleSortChange}
                name="sort"
                id="sort-by"
                defaultValue="fastest"
                className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 bg-white border shadow-sm focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 "
              >
                <option value="fastest">Fastest</option>
                <option value="slowest">Slowest</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* display each score in scores and its link to navigate to view */}
      <div className="max-w-[70ch] mx-auto my-8">{jsx}</div>

      {/* a scroll to top button */}
      <div
        className={
          'fixed right-2 bottom-2 z-10 block'
          // + ' ' + (isSticky ? 'block' : 'hidden')
        }
      >
        <button
          onClick={() => {
            // scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          }}
          className="grid place-items-center w-12 h-12 bg-white border-2 border-sky-500 rounded-full hover:bg-sky-500 text-sky-500 hover:text-white transition-all"
        >
          <RiArrowUpDoubleLine className="text-4xl" />
        </button>
      </div>
    </section>
  );
}

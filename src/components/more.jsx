import { AiOutlineLoading } from 'react-icons/ai';
import { IoIosCloseCircleOutline, IoIosPersonAdd, IoIosMenu, IoIosLogIn, IoIosLogOut } from 'react-icons/io';
import { RiSignalWifiErrorFill } from 'react-icons/ri';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

export function NumberCounter({ children }) {
  return <span className="inline-grid w-6 h-6 bg-danger text-white font-bold rounded-full text-xs place-items-center">{children}</span>;
}

NumberCounter.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]),
};

export function GroupStatus({ publicity, membersLength }) {
  function text() {
    if (publicity) return `text-green-500`;
    else return `text-gray-500`;
  }

  function bg() {
    if (publicity) return `bg-green-500`;
    else return `bg-gray-500`;
  }

  return (
    <>
      <span className={'inline-block h-2 w-2 rounded-full mr-1' + ' ' + bg()}></span>
      <span className={text()}>
        {publicity ? 'Public' : 'Private'} - {membersLength} members
      </span>
    </>
  );
}

GroupStatus.propTypes = {
  publicity: PropTypes.bool.isRequired,
  membersLength: PropTypes.number.isRequired,
};

export function UserStatus({ status }) {
  function text() {
    if (status === 'online') return `text-green-500`;
    else if (status === 'busy') return `text-red-500`;
    else if (status === 'afk') return `text-yellow-500`;
    else if (status === 'offline') return `text-gray-500`;
    else return `text-black`;
  }

  function bg() {
    if (status === 'online') return `bg-green-500`;
    else if (status === 'busy') return `bg-red-500`;
    else if (status === 'afk') return `bg-yellow-500`;
    else if (status === 'offline') return `bg-gray-500`;
    else return `bg-black`;
  }

  return (
    <>
      <span className={'inline-block h-2 w-2 rounded-full mr-1 color-red-400' + ' ' + bg()}></span>
      <span className={'capitalize' + ' ' + text()}>{status || 'unknown'}</span>
    </>
  );
}

UserStatus.propTypes = {
  status: PropTypes.string,
};

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

export function Footer() {
  return (
    <footer className="p-8 grid place-items-center">
      <p className="">
        <OutsideLink to={'https://github.com/minhhoccode111/messaging-app-front'}> Project</OutsideLink> is made by <OutsideLink to={'https://github.com/minhhoccode111'}> minhhoccode111 </OutsideLink>
        .
      </p>
    </footer>
  );
}

export function OutsideLink({ children, to }) {
  return (
    <a href={to} target="_blank" rel="noopener" className="text-link underline decoration-dotted hover:decoration-solid cursor-pointer">
      {children}
    </a>
  );
}

OutsideLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  to: PropTypes.string,
};

export function FakeLink({ children }) {
  return <span className="text-link underline decoration-dotted hover:decoration-solid cursor-pointer inline">{children}</span>;
}

FakeLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export function Header({ loginState }) {
  // hamburger menu state
  const [isShowMenu, setIsShowMenu] = useState(false);

  return (
    <header
      id="header"
      className={'flex gap-3 sm:gap-5 md:gap-7 lg:gap-9 items-center p-4 sm:p-5 md:p-6 lg:p-7 shadow-lg shadow-gray-300 text-slate-700 bg-white'}
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

        {loginState.token && (
          <>
            {/* link to chat section */}
            <NavLink
              className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
              to={'chat'}
            >
              Chat
            </NavLink>

            {/* link to profile section */}
            <NavLink
              className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
              to={'profile'}
            >
              Profile
            </NavLink>
          </>
        )}

        <NavLink
          className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
          to={'about'}
        >
          About
        </NavLink>
      </nav>

      {/* token not expired */}
      {new Date(loginState?.expiresInDate) > new Date() ? (
        <div className="flex gap-2 md:gap-4 max-sm:justify-end">
          <div className="border border-slate-900 w-0"></div>

          {/* link to logout section */}
          <NavLink
            className={({ isActive }) =>
              (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all grid place-items-center'
            }
            to={'logout'}
            title="Logout"
          >
            <IoIosLogOut className="text-6xl sm:text-2xl md:text-3xl" />
          </NavLink>
        </div>
      ) : (
        <div className="flex gap-2 md:gap-4 max-sm:justify-end">
          {/* link to signup section */}
          <NavLink
            className={({ isActive }) =>
              (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all grid place-items-center'
            }
            to={'signup'}
            title="Signup"
          >
            <IoIosPersonAdd className="text-6xl sm:text-2xl md:text-3xl" />
          </NavLink>

          <div className="border border-slate-900 w-0"></div>

          {/* link to login section */}
          <NavLink
            className={({ isActive }) =>
              (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all grid place-items-center'
            }
            to={'login'}
            title="Login"
          >
            <IoIosLogIn className="text-6xl sm:text-2xl md:text-3xl" />
          </NavLink>
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  loginState: PropTypes.object,
  isLightTheme: PropTypes.bool,
  setIsLightTheme: PropTypes.func,
};

Error.propTypes = {
  className: PropTypes.string,
};

Loading.propTypes = Error.propTypes;

export function SubmitButton({ children, isDisable }) {
  return (
    <button
      disabled={isDisable}
      type="submit"
      className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white transition-all hover:scale-110 hover:shadow hover:shadow-gray-400"
    >
      {children}
    </button>
  );
}

export function CustomButton({ isDisable, onClick, children, type = 'button', className = 'bg-link text-white' }) {
  return (
    <button
      onClick={onClick}
      disabled={isDisable}
      type={type}
      className={'inline-block rounded-lg px-5 py-3 text-sm font-medium transition-all hover:scale-110 hover:shadow hover:shadow-gray-400 ' + className}
    >
      {children}
    </button>
  );
}

SubmitButton.propTypes = {
  isDisable: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

CustomButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  isDisable: PropTypes.bool.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

import PropTypes from 'prop-types';
import { domParser } from './../../methods/index';
import { FakeLink, UserStatus, CircleAvatar } from '../more';
import { useOutletContext } from 'react-router-dom';

export default function ContactUser({ user, chatId, setChatId, chatType, setChatType }) {
  // if (user.status === 'online') console.log(user);

  const { loginState } = useOutletContext();

  function setFocus() {
    return chatType === 'users' && chatId === user?.id ? 'bg-gray-300' : 'bg-gray-100';
  }

  return (
    // BUG not accessibility best practice using onClick on <li></li> tag
    <li
      onClick={() => {
        setChatId(user?.id);
        setChatType('users');
      }}
      className={'my-2 rounded-md flex gap-2 items-center justify-start text-xs font-bold shadow-md p-2 hover:bg-gray-300 transition-colors cursor-pointer' + ' ' + setFocus()}
    >
      <div className={'w-11 h-11 flex-shrink-0'}>
        <CircleAvatar src={user?.avatarLink} alt={domParser(user?.fullname?.slice(0, 1)?.toUpperCase())} />
      </div>

      <div className="">
        <p className="text-sm">
          <FakeLink>
            {domParser(user?.fullname) === domParser(loginState?.user?.fullname)
              ? // differentiate if you are group's creator
                'You'
              : domParser(user?.fullname)}
          </FakeLink>
          {user?.isCreator && <span className="font-bold text-green-500"> (Creator) </span>}
        </p>

        <p className="">
          <UserStatus status={user?.status} />
        </p>
      </div>
    </li>
  );
}

ContactUser.propTypes = {
  user: PropTypes.object,
  chatId: PropTypes.string,
  setChatId: PropTypes.func,
  chatType: PropTypes.string,
  setChatType: PropTypes.func,
};

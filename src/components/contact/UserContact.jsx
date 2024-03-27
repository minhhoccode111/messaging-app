import PropTypes from 'prop-types';
import { domParser } from './../../methods/index';
import { FakeLink, UserStatus } from '../more';

export default function UserContact({ user, chatId, setChatId, chatType, setChatType }) {
  // if (user.status === 'online') console.log(user);

  function setFocus() {
    return chatType === 'user' && chatId === user.id ? 'bg-gray-300' : 'bg-gray-100';
  }

  return (
    // BUG not accessibility best practice using onClick on <li></li> tag
    <li
      onClick={() => {
        setChatId(user.id);
        setChatType('user');
      }}
      className={'my-2 rounded-md flex gap-2 items-center justify-between text-xs font-bold shadow-md p-2 hover:bg-gray-300 transition-colors cursor-pointer' + ' ' + setFocus()}
    >
      <p className="">
        <UserStatus status={user.status} />
        <FakeLink>{domParser(user.fullname)}</FakeLink>
      </p>

      <div className="">
        <img src={user.avatarLink} alt={domParser(user.fullname.slice(0, 1).toUpperCase())} className="w-10 h-10 rounded-full bg-gray-200 grid place-items-center overflow-hidden" />
      </div>
    </li>
  );
}

UserContact.propTypes = {
  user: PropTypes.object,
  chatId: PropTypes.string,
  chatType: PropTypes.string,
  setChatId: PropTypes.func,
  setChatType: PropTypes.func,
};

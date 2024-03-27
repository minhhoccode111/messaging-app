import PropTypes from 'prop-types';
import { domParser } from './../../methods/index';
import { FakeLink } from '../more';

export default function GroupContact({ group, chatId, setChatId, chatType, setChatType }) {
  // if (user.status === 'online') console.log(user);

  function setFocus() {
    return chatType === 'group' && chatId === group.id ? 'bg-gray-300' : 'bg-gray-100';
  }

  return (
    <li
      onClick={() => {
        setChatType('group');
        setChatId(group.id);
      }}
      className={'my-2 rounded-md flex gap-2 items-center justify-between text-xs font-bold shadow-md p-2 bg-gray-100 hover:bg-gray-300 transition-colors cursor-pointer' + ' ' + setFocus()}
    >
      <p className="">
        <FakeLink>{domParser(group.name)}</FakeLink>
      </p>

      <div className="">
        <img src={group.avatarLink} alt={domParser(group.name.slice(0, 1).toUpperCase())} className="w-10 h-10 rounded-full bg-gray-200 grid place-items-center overflow-hidden" />
      </div>
    </li>
  );
}

GroupContact.propTypes = {
  group: PropTypes.object,
  chatId: PropTypes.string,
  chatType: PropTypes.string,
  setChatId: PropTypes.func,
  setChatType: PropTypes.func,
};

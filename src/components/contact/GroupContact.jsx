import PropTypes from 'prop-types';
import { domParser } from './../../methods/index';
import { FakeLink, UserStatus } from '../more';

export default function GroupContact({ group }) {
  // if (user.status === 'online') console.log(user);
  return (
    <li className="my-2 rounded-md flex gap-2 items-center justify-between text-xs font-bold shadow-md p-2 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
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
};

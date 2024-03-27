import PropTypes from 'prop-types';
import { FakeLink, UserStatus } from '../more';
import { domParser } from './../../methods/index';

export default function ChatHeaderUser({ chatOptions }) {
  // chatOptions: {info: receivedUser, members: undefined}
  console.log(`chatOptions belike: `, chatOptions);
  const user = chatOptions?.info;

  return (
    <h2 className={'my-2 rounded-md flex gap-2 items-center justify-between text-xs font-bold shadow-md p-2 hover:bg-gray-300 transition-colors cursor-pointer'}>
      <p className="">
        <UserStatus status={user?.status} />
        <FakeLink>{domParser(user?.fullname)}</FakeLink>
      </p>

      <div className="">
        <img src={user?.avatarLink} alt={domParser(user?.fullname.slice(0, 1).toUpperCase())} className="w-10 h-10 rounded-full bg-gray-200 grid place-items-center overflow-hidden" />
      </div>
    </h2>
  );
}

ChatHeaderUser.propTypes = {
  chatOptions: PropTypes.object.isRequired,
};

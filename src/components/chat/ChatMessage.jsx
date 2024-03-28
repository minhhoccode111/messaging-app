import PropTypes from 'prop-types';
import { CircleAvatar } from '../more';

export default function ChatMessage({ message }) {
  // console.log(`the message in ChatMessage beliek: `, message);

  // display differently base on content type
  let jsx;
  if (message?.content) {
    jsx = (
      <div className={'max-w-full'}>
        <p className="">{message?.content}</p>
      </div>
    );
  } else if (message?.imageLink) {
    jsx = (
      // prevent too large image
      <div className={'max-w-[200px]'}>
        <div className="">
          <img src={message?.imageLink} alt="" className="block w-full max-w-xs" />
        </div>
      </div>
    );
  }

  // base on owned state to align message
  const alignFlex = () => (message?.owned ? `self-end` : `self-start`);
  const alignText = () => (message?.owned ? `text-right` : `text-left`);

  // base on owned state to order small avatar
  const order = () => (message?.owned ? `order-last` : `-order-last`);

  // console.log(`the message belike: `, message);

  return (
    <li className={'max-w-[70%] border flex gap-2 ' + alignFlex()}>
      {/* message's sender avatar */}
      <div className={'flex-shrink-0 ' + order()}>
        <CircleAvatar src={message?.sender?.avatarLink} alt={message?.sender?.fullname?.slice(0, 1)?.toUpperCase()} size={8}></CircleAvatar>
      </div>

      <div className="">
        {/* message's content */}
        {jsx}

        {/* time stamp */}
        <div className="">
          <p className={'text-xs text-gray-600 ' + alignText()}>{message?.createdAtFormatted}</p>
        </div>
      </div>
    </li>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired,
};

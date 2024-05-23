import PropTypes from "prop-types";
import { CircleAvatar } from "../more";
import { domParser } from "../../methods";

export default function ChatMessage({ message }) {
  // console.log(`the message in ChatMessage belike: `, message);

  // display differently base on content type
  let jsx;
  if (message?.content) {
    jsx = <p className="">{domParser(message?.content)}</p>;
  } else if (message?.imageLink) {
    jsx = (
      // prevent too large image
      <img
        src={domParser(message?.imageLink)}
        alt={`Can't display that image link`}
        className="block w-full"
      />
    );
  }

  // base on owned state to align message
  const alignFlex = () =>
    message?.owned ? `self-end justify-end` : `self-start justify-start`;
  const alignText = () => (message?.owned ? `text-right` : `text-left`);

  // base on owned state to order small avatar
  const order = () => (message?.owned ? `order-last` : `-order-last`);

  // console.log(`the message belike: `, message);

  return (
    <li className={"w-full max-w-[70%] flex gap-2 " + alignFlex()}>
      {/* message's sender avatar */}
      <div className={"w-8 h-8 flex-shrink-0 " + order()}>
        <CircleAvatar
          src={domParser(message?.sender?.avatarLink)}
          alt={domParser(message?.sender?.fullname?.slice(0, 1)?.toUpperCase())}
        ></CircleAvatar>
      </div>

      {/* only take full width if that's an image */}
      <div className={"" + (message?.imageLink && "flex-1")}>
        {/* message's content */}
        <div className={"w-full " + alignText()}>{jsx}</div>

        {/* time stamp */}
        <div className="">
          <p className={"text-xs text-gray-600 " + alignText()}>
            {message?.createdAtFormatted}
          </p>
        </div>
      </div>
    </li>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired,
};

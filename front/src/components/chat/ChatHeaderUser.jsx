import PropTypes from "prop-types";
import { UserStatus, CircleAvatar } from "../more";
import { domParser } from "./../../methods/index";
import { IoIosCall, IoIosVideocam, IoIosMore } from "react-icons/io";

export default function ChatHeaderUser({ chatOptions }) {
  // chatOptions: {info: receivedUser, members: undefined}
  // console.log(`chatOptions belike: `, chatOptions);
  const user = chatOptions?.info;

  return (
    <h2
      className={
        "flex gap-2 items-center justify-start text-lg font-bold text-slate-700"
      }
    >
      {/* display avatar */}
      <div className={"w-14 h-14 flex-shrink-0"}>
        <CircleAvatar
          src={user?.avatarLink}
          alt={user?.fullname?.slice(0, 1)?.toUpperCase()}
        />
      </div>

      {/* display name and status */}
      <div className="flex-1">
        <p className="">{domParser(user?.fullname)}</p>

        <p className="text-sm">
          <UserStatus status={user?.status} />
        </p>
      </div>

      {/* display open options and call and video call */}
      <div className="flex items-center gap-3 text-2xl">
        <IoIosCall className="inline-block p-1 rounded-full w-8 h-8 cursor-pointer bg-white hover:bg-gray-300" />
        <IoIosVideocam className="inline-block p-1 rounded-full w-8 h-8 cursor-pointer bg-white hover:bg-gray-300" />
        <IoIosMore className="text-white bg-slate-700 inline-block p-1 rounded-full w-6 h-6 cursor-pointer hover:bg-slate-900" />
      </div>
    </h2>
  );
}

ChatHeaderUser.propTypes = {
  chatOptions: PropTypes.object.isRequired,
};

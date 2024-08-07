import PropTypes from "prop-types";
import { domParser } from "./../../methods/index";
import { UserStatus, CircleAvatar } from "../more";
import { memo } from "react";
import useAuthStore from "../../stores/auth";

const ContactUser = memo(function ContactUser({
  user,
  chatId,
  setChatId,
  chatType,
  setChatType,

  // those props only being used when display option group joined
  children,
  isCreator,
  isMember,
}) {
  // if (user.status === 'online') console.log(user);

  const { authData } = useAuthStore();

  function setFocus() {
    return chatType === "users" && chatId === user?.id
      ? "bg-gray-300"
      : "bg-gray-100";
  }

  // console.log(`the children belike: `);

  return (
    // BUG not accessibility best practice using onClick on <li></li> tag
    <li
      onClick={() => {
        // not allowed to chat with ourselves
        if (authData?.self?.id === user?.id) return;

        // set chat to fetch
        setChatId(user?.id);
        setChatType("users");
      }}
      className={
        "my-2 rounded-md flex gap-2 items-center justify-start text-xs font-bold shadow-md p-2 hover:bg-gray-300 transition-colors cursor-pointer" +
        " " +
        setFocus()
      }
    >
      <div className={"w-11 h-11 flex-shrink-0"}>
        <CircleAvatar
          src={user?.avatarLink}
          alt={user?.fullname?.slice(0, 1)?.toUpperCase()}
        />
      </div>

      <div className="flex-1">
        <p className="text-sm">
          {user?.id === authData?.self?.id
            ? // differentiate if you are group's creator
              "You"
            : domParser(user?.fullname)}

          {user?.isCreator && (
            <span className="font-bold text-green-500"> (Creator) </span>
          )}
        </p>

        <p className="">
          <UserStatus status={user?.status} />
        </p>
      </div>

      {/* kick or leave group logic, used for option group joined */}
      {/* if group's creator */}
      {isCreator ? (
        // display kick to every one but ourselves
        user?.id !== authData?.self?.id && children
      ) : // else if group's member
      isMember ? (
        // display leave to no one but ourselves
        user?.id === authData?.self?.id && children
      ) : (
        // else display nothing
        <></>
      )}
    </li>
  );
});

export default ContactUser;

ContactUser.propTypes = {
  user: PropTypes.object,
  chatId: PropTypes.string,
  setChatId: PropTypes.func,
  chatType: PropTypes.string,
  setChatType: PropTypes.func,

  // only use these props when display members in options group joined
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  isCreator: PropTypes.bool,
  isMember: PropTypes.bool,
};

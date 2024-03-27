import PropTypes from 'prop-types';
import { domParser } from './../../methods/index';
import { IoIosCall, IoIosVideocam, IoIosMore } from 'react-icons/io';
import { GroupStatus } from '../more';

export default function ChatHeaderGroup({ chatOptions }) {
  console.log(chatOptions);
  const group = chatOptions?.info;

  const memLen = chatOptions?.members?.length;

  return (
    <h2 className={'flex gap-2 items-center justify-start text-lg font-bold text-slate-700'}>
      {/* display avatar */}
      <div className="w-10">
        <img src={group?.avatarLink} alt={domParser(group?.name.slice(0, 1).toUpperCase())} className="w-10 h-10 rounded-full bg-gray-200 grid place-items-center overflow-hidden" />
      </div>

      {/* display name and status */}
      <div className="flex-1">
        <p className="">{domParser(group?.name)}</p>

        <p className="text-sm">
          {/* BUG TODO FIXME here */}
          <GroupStatus public={group?.public} memLen={memLen} />
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

ChatHeaderGroup.propTypes = {
  chatOptions: PropTypes.object.isRequired,
};

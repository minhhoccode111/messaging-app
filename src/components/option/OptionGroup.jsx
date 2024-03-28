import PropTypes from 'prop-types';
import { CircleAvatar, FakeLink, NumberCounter } from '../more';
import { domParser } from '../../methods';
import ContactUser from '../contact/ContactUser';
import { useState } from 'react';

export default function OptionGroup({ info, members, setChatId, setChatType, setWillFetchContact }) {
  // console.log(`the info belike: `, info);
  // console.log(`the members belike: `, members);

  const [isMembersOpen, setIsMembersOpen] = useState(false);

  const textColor = () => {
    if (info?.public) return `text-green-500`;
    else return `text-gray-500`;
  };

  const handleToggleClick = () => setIsMembersOpen((current) => !current);

  const expand = () => (isMembersOpen ? 'max-h-full' : 'max-h-0');

  return (
    <div className="flex flex-col gap-2 p-2 max-h-full h-full">
      <div className="grid place-items-center self-center rounded-full my-8 w-28 h-28 font-bold text-5xl">
        {/* make the alt text center just in case the link is not an image, also make it unescaped */}
        <CircleAvatar src={domParser(info?.avatarLink)} alt={domParser(info?.name?.slice(0, 1)?.toUpperCase())} />
      </div>

      <div className="grid gap-4 grid-cols-profile">
        <h3 className="font-bold">Name</h3>
        {/* unescaped user fullname */}
        <h3 className="">{domParser(info?.name)}</h3>

        <h3 className="font-bold">Status</h3>
        {/* custom tailwind base on info?.status */}
        <p className={'capitalize font-bold ' + textColor()}>{info?.public ? 'Public' : 'Private'}</p>

        <h3 className="font-bold">Bio </h3>
        <p className="">{domParser(info?.bio)}</p>

        <h3 className="font-bold">Created at</h3>
        <p className="">{info?.createdAtFormatted}</p>

        <h3 className="font-bold">Updated at</h3>
        <p className="">{info?.updatedAtFormatted}</p>
      </div>

      <button onClick={handleToggleClick} className="flex items-center justify-between gap-2 font-bold text-xl p-4 text-center rounded-md hover:bg-red-300 bg-red-100 transition-all shadow-md">
        <FakeLink>Members</FakeLink>
        <NumberCounter>{members?.length}</NumberCounter>
      </button>
      <ul className={'overflow-y-auto transition-all origin-top ' + expand()}>
        {members?.map((user) => (
          <ContactUser setChatId={setChatId} setChatType={setChatType} user={user} key={user.id}></ContactUser>
        ))}
      </ul>
    </div>
  );
}

OptionGroup.propTypes = {
  info: PropTypes.object,
  members: PropTypes.array,
  setWillFetchContact: PropTypes.func,
  setChatId: PropTypes.func,
  setChatType: PropTypes.func,
};

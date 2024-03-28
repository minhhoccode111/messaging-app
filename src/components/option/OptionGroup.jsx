import PropTypes from 'prop-types';
import { CircleAvatar } from '../more';
import { domParser } from '../../methods';

export default function OptionGroup({ info, members, setWillFetchContact }) {
  // console.log(`the info belike: `, info);
  // console.log(`the members belike: `, members);

  const textColor = () => {
    if (info?.public) return `text-green-500`;
    else return `text-gray-500`;
  };

  return (
    <div className="flex flex-col gap-2 p-2">
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
    </div>
  );
}

OptionGroup.propTypes = {
  info: PropTypes.object,
  members: PropTypes.object,
  setWillFetchContact: PropTypes.func,
};

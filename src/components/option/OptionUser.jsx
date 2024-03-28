import PropTypes from 'prop-types';
import { CircleAvatar } from '../more';
import { domParser } from '../../methods';

export default function OptionUser({ info }) {
  // console.log(`the info belike: `, info);

  const textColor = () => {
    if (info?.status === 'online') return `text-green-500`;
    else if (info?.status === 'busy') return `text-red-500`;
    else if (info?.status === 'afk') return `text-yellow-500`;
    else if (info?.status === 'offline') return `text-gray-500`;
    else return `text-black`;
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="grid place-items-center self-center rounded-full my-8 w-28 h-28">
        {/* make the alt text center just in case the link is not an image, also make it unescaped */}
        <CircleAvatar src={domParser(info?.avatarLink)} alt={domParser(info?.fullname) + ' avatar'} />
      </div>

      <div className="grid gap-4 grid-cols-profile">
        <h3 className="font-bold">Name</h3>
        {/* unescaped user fullname */}
        <h3 className="">{domParser(info?.fullname)}</h3>

        <h3 className="font-bold">Status</h3>
        {/* custom tailwind base on info?.status */}
        <p className={'capitalize font-bold ' + textColor()}>{info?.status ?? 'Unknown'}</p>

        <h3 className="font-bold">Bio </h3>
        <p className="">{domParser(info?.bio)}</p>

        <h3 className="font-bold">Birth</h3>
        <p className="">{info?.dateOfBirthFormatted?.split(' - ')[0]}</p>
      </div>
    </div>
  );
}

OptionUser.propTypes = {
  info: PropTypes.object,
};

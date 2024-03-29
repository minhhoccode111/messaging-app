import PropTypes from 'prop-types';
import { IoIosPaperPlane } from 'react-icons/io';
import { CircleAvatar, SubmitWithStates, FakeLink, NumberCounter } from '../more';
import { domParser } from '../../methods';
import ContactUser from '../contact/ContactUser';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

export default function OptionGroup({ chatId, setChatId, setChatType, setWillFetchContact, setChatOptions, chatOptions }) {
  const info = chatOptions?.info;
  const members = chatOptions?.members;

  // console.log(`the info belike: `, info);
  // console.log(`the members belike: `, members);

  const { loginState } = useOutletContext();

  // toggle open sections
  const [currentSection, setCurrentSection] = useState('');

  // which needs confirmation (delete, join, leave, kick)
  const [currentConfirmation, setCurrentConfirmation] = useState('');

  // update group's info fetching states
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // form ref to get inputs inside
  const formRef = useRef(null);

  // creator update group's info
  const handleUpdateGroup = (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      //
    } catch (err) {
      console.log(err);

      //
      setIsError(true);
    } finally {
      setIsLoading(false);
      //
    }
  };

  // leave group or kick another user in group
  const handleDeleteUser =
    (isCreator, id = loginState?.user?.id) =>
    async (e) => {
      e.preventDefault();

      // if (isCreator) console.log(`try to kick user with id: `, id);
      // else console.log(`try to leave the group`);

      try {
        setIsLoading(true);

        const res = await axios({
          mode: 'cors',
          method: 'delete',
          url: import.meta.env.VITE_API_ORIGIN + `/chat/groups/${chatId}/members/${id}`,
          headers: {
            Authorization: `Bearer ${loginState?.token}`,
          },
        });

        // console.log(`members before deletion`, members);

        // console.log(`members after deletion`, res.data);

        // update group's members list if it's a kick
        if (isCreator) setChatOptions((current) => ({ ...current, members: res?.data }));
        // if it's a leave then just refetch everything (cause we also need to update group's states)
        else setWillFetchContact((current) => !current);
      } catch (err) {
        console.log(`error occurs when trying to delete user with id: `, err, id);

        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

  // join public group
  const handleJoinGroup = async (e) => {
    e.preventDefault();

    console.log(`try to join a group`);

    try {
      setIsLoading(true);

      await axios({
        mode: 'cors',
        method: 'post',
        url: import.meta.env.VITE_API_ORIGIN + `/chat/groups/${chatId}/members/`,
        headers: {
          Authorization: `Bearer ${loginState?.token}`,
        },
      });

      // console.log(res.data);

      setWillFetchContact((current) => !current);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      await axios({
        mode: 'cors',
        method: 'delete',
        url: import.meta.env.VITE_API_ORIGIN + `/chat/groups/${chatId}`,
        headers: {
          Authorization: `Bearer ${loginState?.token}`,
        },
      });

      // console.log(`res after deletion belike: `, res.data);

      setWillFetchContact((current) => !current);
    } catch (error) {
      console.log(`there is an error trying to delete this group`, error);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const textColor = () => {
    if (info?.public) return `text-green-500`;
    else return `text-gray-500`;
  };

  const handleToggleSection = (section) => () => setCurrentSection((current) => (current === section ? '' : section));

  const expand = (section) => (currentSection === section ? 'max-h-full' : 'max-h-0');

  const isMember = info?.isMember;
  const isCreator = info?.isCreator;
  const isPublic = info?.public;

  // console.log(`isMember belike: `, isMember);
  // console.log(`isCreator belike: `, isCreator);
  // console.log(`isPublic belike: `, isCreator);

  return (
    <div className="flex flex-col gap-2 p-2 max-h-full h-full">
      <div className="grid place-items-center self-center rounded-full my-4 w-28 h-28 font-bold text-5xl">
        {/* make the alt text center just in case the link is not an image, also make it unescaped */}
        <CircleAvatar src={domParser(info?.avatarLink)} alt={domParser(info?.name?.slice(0, 1)?.toUpperCase())} />
      </div>

      {/* toggle display info section */}
      <button
        onClick={handleToggleSection('info')}
        className="flex items-center justify-between gap-2 font-bold text-xl p-4 text-center rounded-md hover:bg-red-300 bg-red-100 transition-all shadow-md"
      >
        <FakeLink>About</FakeLink>
        {/* <NumberCounter>{members?.length}</NumberCounter> */}
      </button>

      <div className={'grid gap-4 grid-cols-profile overflow-y-auto transition-all origin-top ' + expand('info')}>
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

      {/* only allow if current logged in user is group's creator */}
      {isCreator && (
        <>
          {/* toggle display edit section */}
          <button
            onClick={handleToggleSection('update')}
            className="flex items-center justify-between gap-2 font-bold text-xl p-4 text-center rounded-md hover:bg-red-300 bg-red-100 transition-all shadow-md"
          >
            <FakeLink>Update</FakeLink>
            {/* <NumberCounter>{members?.length}</NumberCounter> */}
          </button>

          <form ref={formRef} className={'overflow-y-auto transition-all origin-top flex flex-col gap-3 px-2 ' + expand('update')} onSubmit={handleUpdateGroup}>
            <label htmlFor="name" className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 px-1 pt-2">
              <input type="text" id="name" className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="Name" required />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Name
              </span>
            </label>

            <label htmlFor="avatarLink" className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1">
              <input
                type="text"
                id="avatarLink"
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                placeholder="Avatar Link"
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Avatar Link
              </span>
            </label>

            <fieldset className="grid grid-cols-2 gap-4">
              <legend className="sr-only">Public</legend>
              <div>
                <label
                  htmlFor="public"
                  className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                >
                  <div>
                    <p className="text-gray-700">Public</p>
                  </div>
                  <input type="radio" name="public" value="true" id="public" className="size-5 border-gray-300 text-blue-500" defaultChecked />
                </label>
              </div>
              <div>
                <label
                  htmlFor="private"
                  className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                >
                  <div>
                    <p className="text-gray-700">Private</p>
                  </div>
                  <input type="radio" name="public" value="false" id="private" className="size-5 border-gray-300 text-blue-500" />
                </label>
              </div>
            </fieldset>

            <div className="p-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                {' '}
                Bio{' '}
              </label>

              <textarea id="bio" className="mt-2 w-full rounded-lg border-gray-200 p-2 align-top shadow-sm sm:text-sm" rows="3" placeholder="Enter group bio here" required></textarea>
            </div>

            <div className="flex justify-end">
              <SubmitWithStates isLoading={isLoading} isError={isError}>
                <span className="text-xl">
                  <IoIosPaperPlane />
                </span>
              </SubmitWithStates>
            </div>
          </form>
        </>
      )}

      {/* toggle display members section */}
      <button
        onClick={handleToggleSection('members')}
        className="flex items-center justify-between gap-2 font-bold text-xl p-4 text-center rounded-md hover:bg-red-300 bg-red-100 transition-all shadow-md"
      >
        <FakeLink>Members</FakeLink>
        <NumberCounter>{members?.length}</NumberCounter>
      </button>

      <ul className={'overflow-y-auto transition-all origin-top ' + expand('members')}>
        {members?.map((user) => (
          <ContactUser setChatId={setChatId} setChatType={setChatType} user={user} key={user.id} isCreator={isCreator} isMember={isMember}>
            {/* only joined ones can kick or leave */}
            {(isCreator || isMember) && (
              // kick and leave use the same API with endpoint user.id
              // but creator can't leave the group (delete gr instead)
              // and normal member can't kick others (leave only)
              // BUG bad practice onClick form element
              // but have to stop propagation to prevent going to chat with the user (the <li> inside ContactUser element)
              <form onClick={(e) => e.stopPropagation()} onSubmit={handleDeleteUser(isCreator, user.id)} className="">
                <SubmitWithStates bg="bg-red-500 text-xs" isLoading={isLoading} isError={isError}>
                  {/* display text different */}
                  {isCreator ? 'Kick' : 'Leave'}
                </SubmitWithStates>
              </form>
            )}
          </ContactUser>
        ))}
      </ul>

      {/* do something with group's authorization */}
      {isCreator ? (
        <form onSubmit={handleDeleteGroup} className="">
          <SubmitWithStates bg="bg-red-500" isLoading={isLoading} isError={isError}>
            Delete group
          </SubmitWithStates>
        </form>
      ) : isMember ? (
        <form onSubmit={handleDeleteUser(false)} className="">
          <SubmitWithStates bg="bg-red-500" isLoading={isLoading} isError={isError}>
            Leave group
          </SubmitWithStates>
        </form>
      ) : isPublic ? (
        <form onSubmit={handleJoinGroup} className="">
          <SubmitWithStates bg="bg-green-500" isLoading={isLoading} isError={isError}>
            Join group
          </SubmitWithStates>
        </form>
      ) : (
        <div className="">
          <SubmitWithStates bg="bg-green-500" isLoading={isLoading} isError={isError}>
            Do nothing to do
          </SubmitWithStates>
        </div>
      )}
    </div>
  );
}

OptionGroup.propTypes = {
  setChatOptions: PropTypes.func,
  chatOptions: PropTypes.object,
  setWillFetchContact: PropTypes.func,
  chatId: PropTypes.string,
  setChatId: PropTypes.func,
  setChatType: PropTypes.func,
};

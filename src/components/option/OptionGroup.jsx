import PropTypes from 'prop-types';
import { IoIosPaperPlane } from 'react-icons/io';
import { CircleAvatar, SubmitWithStates, NumberCounter } from '../more';
import { domParser } from '../../methods';
import ContactUser from '../contact/ContactUser';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

export default function OptionGroup({ chatId, setChatId, setChatType, setWillFetchContact, setChatOptions, chatOptions, everyGroupNames }) {
  const info = chatOptions?.info;
  const members = chatOptions?.members;

  // console.log(`the info belike: `, info);
  // console.log(`the members belike: `, members);

  const { loginState } = useOutletContext();

  // toggle open sections
  const [currentSection, setCurrentSection] = useState('');

  // update group's info fetching states
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // form ref to get inputs inside
  const formRef = useRef(null);

  // name state to make sure don't update group name to exists name
  const [updateName, setUpdateName] = useState('');
  const [isWarning, setIsWarning] = useState(false);
  useEffect(() => {
    const trim = updateName.trim();
    if (trim.length < 8) setIsWarning(true);
    else if (everyGroupNames.includes(trim)) setIsWarning(true);
    else setIsWarning(false);
  }, [updateName, everyGroupNames]);

  // creator update group's info
  const handleUpdateGroup = async (e) => {
    e.preventDefault();

    if (isWarning) return;

    try {
      const form = formRef.current;
      const nameInput = form.querySelector('#name');
      const avatarLinkInput = form.querySelector('#avatarLink');
      const bioInput = form.querySelector('#bio');
      const publicInput = form.querySelector('input[type="radio"]:checked');

      // still allow user to create group but we add default values for them
      if (avatarLinkInput.value.trim().length > 500) avatarLinkInput.value = ``;

      setIsLoading(true);

      await axios({
        mode: 'cors',
        method: 'put',
        url: import.meta.env.VITE_API_ORIGIN + `/chat/groups/${chatId}`,
        headers: {
          Authorization: `Bearer ${loginState?.token}`,
        },
        data: {
          name: nameInput.value,
          avatarLink: avatarLinkInput.value,
          bio: bioInput.value,
          public: publicInput.value,
        },
      });

      // console.log(res.data);

      // clear after success
      nameInput.value = '';
      avatarLinkInput.value = '';
      bioInput.value = '';
      publicInput.value = '';

      setWillFetchContact((current) => !current);
    } catch (err) {
      console.log(err);

      setIsError(true);
    } finally {
      setIsLoading(false);
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

    // console.log(`try to join a group`);

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

  const textColor = () => (info?.public ? `text-green-500` : `text-gray-500`);

  const handleToggleSection = (section) => () => setCurrentSection((current) => (current === section ? '' : section));

  const expand = (section) => (currentSection === section ? 'max-h-full' : 'max-h-0');

  const focus = (section) => (currentSection === section ? 'bg-red-100' : 'bg-red-50');

  const isMember = info?.isMember;
  const isCreator = info?.isCreator;
  const isPublic = info?.public;

  return (
    <div className="flex flex-col gap-1 p-2 max-h-full h-full">
      <div className="grid place-items-center self-center rounded-full my-4 w-28 h-28 min-h-28 font-bold text-5xl">
        {/* make the alt text center just in case the link is not an image, also make it unescaped */}
        <CircleAvatar src={domParser(info?.avatarLink)} alt={domParser(info?.name?.slice(0, 1)?.toUpperCase())} />
      </div>

      {/* toggle display info section */}
      <button
        onClick={handleToggleSection('info')}
        className={'flex items-center justify-between gap-2 font-bold text-xl px-4 py-2 text-center rounded-md hover:bg-red-100 transition-all shadow-md ' + focus('info')}
      >
        <h2 className="">About</h2>

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
            className={'flex items-center justify-between gap-2 font-bold text-xl px-4 py-2 text-center rounded-md hover:bg-red-100 transition-all shadow-md ' + focus('update')}
          >
            <h2 className="">Update</h2>
            {/* <NumberCounter>{members?.length}</NumberCounter> */}
          </button>

          <form ref={formRef} className={'overflow-y-auto transition-all origin-top flex flex-col gap-3 px-2 ' + expand('update')} onSubmit={handleUpdateGroup}>
            <label htmlFor="name" className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1 mt-3">
              <input
                type="text"
                id="name"
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
                placeholder="Name"
                required
                value={updateName}
                onChange={(e) => setUpdateName(e.target.value)}
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Name
              </span>
            </label>

            {isWarning && (
              <>
                <p className="text-danger font-bold text-xs">*Group name must be unique</p>
                <p className="text-danger font-bold text-xs">And between 8 - 60 characters</p>
              </>
            )}

            <label htmlFor="avatarLink" className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1">
              <input
                type="text"
                id="avatarLink"
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
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

            <label
              htmlFor="bio"
              className="text-sm font-medium text-gray-700 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1"
            >
              {' '}
              Bio{' '}
              <textarea
                id="bio"
                className="border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
                rows="3"
                placeholder="Enter group bio here"
                required
              ></textarea>
            </label>

            <div className="flex justify-end mb-3">
              {!isWarning && (
                <SubmitWithStates isLoading={isLoading} isError={isError}>
                  <span className="text-xl">
                    <IoIosPaperPlane />
                  </span>
                </SubmitWithStates>
              )}
            </div>
          </form>
        </>
      )}

      {/* toggle display members section */}
      <button
        onClick={handleToggleSection('members')}
        className={'flex items-center justify-between gap-2 font-bold text-xl px-4 py-2 text-center rounded-md hover:bg-red-100 bg-red-100 transition-all shadow-md ' + focus('members')}
      >
        <h2 className="">Members</h2>
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
        // joined group's creator will have button to delete the group
        <form onSubmit={handleDeleteGroup} className="">
          <SubmitWithStates bg="bg-red-500" isLoading={isLoading} isError={isError}>
            Delete group
          </SubmitWithStates>
        </form>
      ) : isMember ? (
        // joined group's member will have button to leave the group
        <form onSubmit={handleDeleteUser(false)} className="">
          <SubmitWithStates bg="bg-red-500" isLoading={isLoading} isError={isError}>
            Leave group
          </SubmitWithStates>
        </form>
      ) : isPublic ? (
        // public group will have button to join
        <form onSubmit={handleJoinGroup} className="">
          <SubmitWithStates bg="bg-green-500" isLoading={isLoading} isError={isError}>
            Join group
          </SubmitWithStates>
        </form>
      ) : (
        // can't do anything with private group
        <div className="">
          <SubmitWithStates bg="bg-black" isLoading={isLoading} isError={isError}>
            Chat with group&apos;s creator
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
  everyGroupNames: PropTypes.array,
};

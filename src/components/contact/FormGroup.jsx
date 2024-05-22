import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { redirect, } from 'react-router-dom';
import { IoIosPaperPlane } from 'react-icons/io';
import { SubmitWithStates } from '../more';
import useAuthStore from '../../stores/auth';

export default function FormGroup({ setWillFetchContact, everyGroupNames }) {
  const { authData } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // handle update input states
  const [nameInput, setNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [avatarLinkInput, setAvatarLinkInput] = useState('');
  const [publicInput, setPublicInput] = useState('public');
  const publicity = publicInput === 'public';

  const [warning, setWarning] = useState('');

  // manually handle validation
  useEffect(() => {
    if (nameInput.trim().length === 0) setWarning(`Name is empty`);
    else if (nameInput.trim().length > 50) setWarning(`Name is too long`);
    else if (bioInput?.trim().length > 250) setWarning(`Bio is too long`);
    else if (everyGroupNames?.includes(nameInput)) setWarning(`Name is already existed`);
    else setWarning('');
  }, [nameInput, avatarLinkInput, bioInput, everyGroupNames, publicity]);

  async function handleCreateGroup(e) {
    e.preventDefault();

    if (warning !== '') return;

    try {
      setIsLoading(true);

      await axios({
        mode: 'cors',
        method: 'post',
        url: import.meta.env.VITE_API_ORIGIN + '/chat/groups',
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
        data: {
          name: nameInput,
          avatarLink: avatarLinkInput,
          bio: bioInput,
          public: publicity,
        },
      });

      // console.log(`the res.data belike: `, res.data);

      // clear after success
      setNameInput('');
      setBioInput('');
      setAvatarLinkInput('');
      setPublicInput('public');

      // switch flag to refetch
      setWillFetchContact((current) => !current);
    } catch (error) {
      // console.log(error);

      // if a 401 unauthorized occur log current logged in user out
      if (error.response.status !== 401) redirect('/logout');

      // stop them from sending another request if it's not a 400
      if (error.response.status !== 400) setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-3 p-2" onSubmit={handleCreateGroup}>
      <label htmlFor="name" className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1">
        <input
          type="text"
          id="name"
          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
          placeholder="Name"
          minLength={1}
          maxLength={50}
          required
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          Name
        </span>
      </label>

      <label htmlFor="avatarLink" className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1">
        <input
          type="text"
          id="avatarLink"
          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
          placeholder="Avatar Link"
          value={avatarLinkInput}
          onChange={(e) => setAvatarLinkInput(e.target.value)}
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
            <input
              //
              type="radio"
              name="public"
              value="public"
              id="public"
              className="size-5 border-gray-300 text-blue-500"
              onChange={(e) => setPublicInput(e.target.value)}
              checked={publicity}
            />
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
            <input
              //
              type="radio"
              name="public"
              value="private"
              id="private"
              className="size-5 border-gray-300 text-blue-500"
              onChange={(e) => setPublicInput(e.target.value)}
              checked={!publicity}
            />
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
          maxLength={250}
          value={bioInput}
          onChange={(e) => setBioInput(e.target.value)}
        ></textarea>
      </label>

      {/* display warning */}
      {warning !== '' ? (
        <p className="text-danger font-bold text-xs">{warning}</p>
      ) : (
        <div className="flex justify-end">
          <SubmitWithStates isLoading={isLoading} isError={isError}>
            <span className="text-xl">
              <IoIosPaperPlane />
            </span>
          </SubmitWithStates>
        </div>
      )}
    </form>
  );
}

FormGroup.propTypes = {
  setWillFetchContact: PropTypes.func,
  everyGroupNames: PropTypes.array,
};

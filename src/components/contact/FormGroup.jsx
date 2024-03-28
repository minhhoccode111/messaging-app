import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import axios from 'axios';
import { redirect, useOutletContext } from 'react-router-dom';
import { IoIosPaperPlane } from 'react-icons/io';
import { SubmitWithStates } from '../more';

export default function FormGroup({ setWillFetchContact }) {
  const { loginState } = useOutletContext();

  const [isLoadingCreateGroup, setIsLoadingCreateGroup] = useState(false);
  const [isErrorCreateGroup, setIsErrorCreateGroup] = useState(false);

  const formRef = useRef(null);

  async function handleCreateGroup(e) {
    e.preventDefault();

    try {
      setIsLoadingCreateGroup(true);

      const form = formRef.current;
      const nameInput = form.querySelector('#name');
      const avatarLinkInput = form.querySelector('#avatarLink');
      const bioInput = form.querySelector('#bio');
      const publicInput = form.querySelector('input[type="radio"]:checked');

      // console.log(nameInput.value);
      // console.log(avatarLinkInput.value);
      // console.log(bioInput.value);
      // console.log(publicInput.value === 'true');

      // still allow user to create group but we add default values for them
      if (nameInput.value.trim().length < 8) nameInput.value = `Invalid name, used dummy - ${Math.random()}`;
      if (bioInput.value.trim().length < 8) bioInput.value = `Invalid bio, used dummy - ${Math.random()}`;
      if (avatarLinkInput.value.trim().length > 500 || avatarLinkInput.value.trim().length < 8) avatarLinkInput.value = `Invalid avatar link, used dummy - ${Math.random()}`;

      await axios({
        mode: 'cors',
        method: 'post',
        url: import.meta.env.VITE_API_ORIGIN + '/chat/groups',
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

      // console.log(`the res.data belike: `, res.data);

      // clear after success
      nameInput.value = '';
      avatarLinkInput.value = '';
      bioInput.value = '';
      publicInput.value = '';

      // switch flag to refetch
      setWillFetchContact((current) => !current);
    } catch (error) {
      console.log(error);

      // if a 401 unauthorized occur log current logged in user out
      if (error.response.status !== 401) redirect('/logout');

      // stop them from sending another request if it's not a 400
      if (error.response.status !== 400) setIsErrorCreateGroup(true);
    } finally {
      setIsLoadingCreateGroup(false);
    }
  }

  return (
    <form ref={formRef} className="flex flex-col gap-3 p-2" onSubmit={handleCreateGroup}>
      <label htmlFor="name" className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1">
        <input type="text" id="name" className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="Name" required />

        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          Name
        </span>
      </label>

      <label htmlFor="avatarLink" className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1">
        <input type="text" id="avatarLink" className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="Avatar Link" />

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
        <SubmitWithStates isLoading={isLoadingCreateGroup} isError={isErrorCreateGroup}>
          <span className="text-xl">
            <IoIosPaperPlane />
          </span>
        </SubmitWithStates>
      </div>
    </form>
  );
}

FormGroup.propTypes = {
  setWillFetchContact: PropTypes.func.isRequired,
};

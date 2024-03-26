import PropTypes from 'prop-types';
import { SubmitButton } from './../more';

export default function NewGroupForm({ setWillFetchContact }) {
  //
  return (
    <form className="flex flex-col gap-3">
      {/* header an dummy text */}
      <div className="text-center p-1">
        <p className="my-2 text-gray-500">Want to create a group? Fill every field!</p>
      </div>

      <label htmlFor="name" className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1">
        <input type="text" id="name" className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="Name" />

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

      <label htmlFor="public" className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1">
        <input type="text" id="public" className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" placeholder="Name" />

        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          Public
        </span>
      </label>

      <label htmlFor="bio" className="text-sm ml-3">
        Bio
      </label>
      <textarea id="bio" className="border" placeholder="Bio"></textarea>

      <div className="flex justify-end">
        <SubmitButton isDisable={false}>Create</SubmitButton>
      </div>
    </form>
  );
}

NewGroupForm.propTypes = {
  setWillFetchContact: PropTypes.func.isRequired,
};

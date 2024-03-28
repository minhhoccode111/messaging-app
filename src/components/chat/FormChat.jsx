import PropTypes from 'prop-types';
import { IoIosPaperPlane } from 'react-icons/io';
import { useState, useRef } from 'react';
import { SubmitButton } from '../more';

export default function FormChat({ setChatMessages }) {
  const [content, setContent] = useState('');
  const [imageLink, setImageLink] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);

  function handleMessageSend(field) {
    return async function () {
      //
    };
  }

  return (
    <>
      {/* send an image message */}
      <form onSubmit={handleMessageSend('imageLink')} className="flex gap-2 items-center">
        <label
          htmlFor="imageLink"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1 flex-1 self-stretch"
        >
          <input
            type="text"
            id="imageLink"
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
            placeholder="Image link ..."
            required
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            Image link ...
          </span>
        </label>

        <SubmitButton isDisable={false}>Send</SubmitButton>
      </form>

      <br className="" />

      {/* send a text message */}
      <form onSubmit={handleMessageSend('content')} className="flex gap-2 items-center">
        <label
          htmlFor="content"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1 flex-1 self-stretch"
        >
          <input
            type="text"
            id="content"
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
            placeholder="Text ..."
            required
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            Text ...
          </span>
        </label>

        <SubmitButton isDisable={false}>Send</SubmitButton>
      </form>
    </>
  );
}

FormChat.propTypes = {
  setChatMessages: PropTypes.func.isRequired,
};

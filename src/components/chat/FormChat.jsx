import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { IoIosPaperPlane } from 'react-icons/io';
import { SubmitWithStates } from '../more';
import axios from 'axios';

export default function FormChat({ setChatMessages, chatId, chatType }) {
  const [content, setContent] = useState('');
  const [imageLink, setImageLink] = useState('');

  const { loginState } = useOutletContext();

  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);

  function handleMessageSend(field) {
    return async function (e) {
      e.preventDefault();

      // console.log(`submit form in field: `, field);

      // console.log(`the content belike: `, content);
      // console.log(`the imageLink belike: `, imageLink);

      try {
        setIsSending(true);

        const res = await axios({
          mode: 'cors',
          method: 'post',
          url: import.meta.env.VITE_API_ORIGIN + `/chat/${chatType}/${chatId}`,
          headers: {
            Authorization: `Bearer ${loginState?.token}`,
          },
          data: {
            imageLink: field === 'imageLink' ? imageLink : undefined,
            content: field === 'content' ? content : undefined,
          },
        });

        if (field === 'content') setContent('');
        else setImageLink('');

        // console.log(`messages response from the post request belike: `, res?.data?.messages);
        setChatMessages(res?.data?.messages);
      } catch (error) {
        console.log(`there is an error when trying to send that message: `, error);

        setIsError(true);
      } finally {
        setIsSending(false);
      }
    };
  }

  return (
    <>
      {/* send an image message */}
      <form onSubmit={handleMessageSend('imageLink')} className="flex gap-2 items-center mb-2">
        <label
          htmlFor="imageLink"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1 flex-1 self-stretch"
        >
          <input
            type="text"
            id="imageLink"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
            placeholder="Image link ..."
            required
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            Image link ...
          </span>
        </label>

        <SubmitWithStates isLoading={isSending} isError={isError}>
          <span className="text-xl">
            <IoIosPaperPlane />
          </span>
        </SubmitWithStates>
      </form>

      {/* send a text message */}
      <form onSubmit={handleMessageSend('content')} className="flex gap-2 items-center">
        <label
          htmlFor="content"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1 flex-1 self-stretch"
        >
          <input
            type="text"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
            placeholder="Text ..."
            required
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            Text ...
          </span>
        </label>

        <SubmitWithStates isLoading={isSending} isError={isError}>
          <span className="text-xl">
            <IoIosPaperPlane />
          </span>
        </SubmitWithStates>
      </form>
    </>
  );
}

FormChat.propTypes = {
  setChatMessages: PropTypes.func.isRequired,
  chatId: PropTypes.string.isRequired,
  chatType: PropTypes.string.isRequired,
};

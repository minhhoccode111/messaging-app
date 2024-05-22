import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { IoIosPaperPlane } from 'react-icons/io';
import { SubmitWithStates } from '../more';
import axios from 'axios';
import useAuthStore from '../../stores/auth';

export default function FormChat({ setChatMessages, chatId, chatType }) {
  const [content, setContent] = useState('');
  const [allowContent, setAllowContent] = useState(false);
  useEffect(() => {
    if (content.trim().length === 0 || content.trim().length > 10000) setAllowContent(false);
    else setAllowContent(true);
  }, [content]);

  const [imageLink, setImageLink] = useState('');
  const [allowImageLink, setAllowImageLink] = useState(false);
  useEffect(() => {
    if (imageLink.trim().length === 0) setAllowImageLink(false);
    else setAllowImageLink(true);
  }, [imageLink]);

  const { authData } = useAuthStore();

  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);

  function handleMessageSend(field) {
    return async function(e) {
      e.preventDefault();

      // just clear input field if user try invalid one
      if (field === 'content' && !allowContent) return setContent('');
      if (field === 'imageLink' && !allowImageLink) return setImageLink('');

      try {
        setIsSending(true);

        const res = await axios({
          mode: 'cors',
          method: 'post',
          url: import.meta.env.VITE_API_ORIGIN + `/chat/${chatType}/${chatId}`,
          headers: {
            Authorization: `Bearer ${authData?.token}`,
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
          className="relative rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1 flex-1 self-stretch flex items-center"
        >
          <input
            type="text"
            id="imageLink"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            className="border-none bg-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
            placeholder="Image link ..."
            required
          />
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
          className="relative rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 p-1 flex-1 self-stretch flex items-center"
        >
          <input
            type="text"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border-none bg-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full"
            placeholder="Text ..."
            required
          />
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

import PropTypes from 'prop-types';

export default function ChatMessage({ message }) {
  console.log(`the message in ChatMessage beliek: `, message);

  return <></>;
}

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired,
};

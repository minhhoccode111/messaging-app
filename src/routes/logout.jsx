import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { set } from './../methods/index';

// logout using component
export default function Logout() {
  const navigate = useNavigate();
  const { setLoginState } = useOutletContext();

  useEffect(() => {
    set({});

    setLoginState({});

    navigate('/');
  });

	return <></>;
}

import { useState, useEffect, useRef } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loading, Error } from './../components';

export default function Profile() {
  const { loginState } = useOutletContext();

  // only logged in user be able to go to this route
  if (!loginState.token || !loginState.user) return <Navigate to={'/login'} />;

  return <></>;
}

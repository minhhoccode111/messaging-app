import { RiArrowUpDoubleLine } from 'react-icons/ri';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loading, Error } from './../components';

export default function Chat() {
  const { loginState } = useOutletContext();

  // only logged in user be able to go to this route
  if (!loginState.token || !loginState.user) return <Navigate to={'/'} />;

  return <></>;
}

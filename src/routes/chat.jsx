import { useState, useEffect, useRef } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loading, Error, SubmitButton, CustomButton } from './../components';

export default function Chat() {
  const { loginState } = useOutletContext();

  // only logged in user be able to go to this route
  if (!loginState.token || !loginState.user) return <Navigate to={'/'} />;

  return (
    <section className="flex-1 text-slate-900 p-4 border grid grid-cols-chat gap-4 max-h-full">
      {/* display contact section */}
      <article className="overflow-y-auto bg-success">
        {/* other users */}
        <div className=""></div>

        {/* create a group */}
        <div className=""></div>

        {/* joined groups */}
        <div className=""></div>

        {/* public groups */}
        <div className=""></div>

        {/* private groups */}
        <div className=""></div>

        {/* test over flow */}
        {Array.from({ length: 100 }, () => Math.random()).map((e, index) => (
          <p key={index}>{e}</p>
        ))}
      </article>

      {/* display chat section */}
      <article className="overflow-y-auto bg-danger">
        {/* display old messages section */}
        <div className=""></div>

        {/* form to send message section */}
        <div className="">
          {/* test over flow */}
          {Array.from({ length: 100 }, () => Math.random()).map((e, index) => (
            <p key={index}>{e}</p>
          ))}
        </div>
      </article>

      {/* display option section */}
      <article className="overflow-y-auto bg-warn">
        {/* display user or group  */}
        <div className=""></div>

        {/* display group's members */}
        <div className="">
          {/* test over flow */}
          {Array.from({ length: 100 }, () => Math.random()).map((e, index) => (
            <p key={index}>{e}</p>
          ))}
        </div>
      </article>
    </section>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loading, Error, FakeLink } from './../components';

export default function Profile() {
  const { loginState } = useOutletContext();

  // only logged in user be able to go to this route
  if (!loginState.token || !loginState.user) return <Navigate to={'/login'} />;

  async function handleUpdateSubmit(e) {
    //
  }

  const user = loginState.user;

  const [avatarLinkString, setAvatarLinkString] = useState(user.avatarLink);

  return (
    <section className="mx-auto max-w-[60ch] px-4 py-16 my-10 sm:px-6 lg:px-8 shadow-lg shadow-gray-400 rounded-xl bg-[#ffffffcc] text-slate-900">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center w-48 h-48 self-center bg-warn rounded-full">
          <img className="rounded-full w-full block text-xs" src={avatarLinkString} alt={user?.fullname + ' avatar'} />
        </div>

        <div className="">
          <p className="">Fullname: {user.fullname}</p>
          <p className="">Status: {user.status}</p>
          <p className="">Bio: {user.bio}</p>
          <p className="">Date of birth: {user.dateOfBirthFormatted.split(' - ')[0]}</p>
        </div>

        <div className="">
          <h2 className="">Edit</h2>

          <p className="">
            Fullname: <input type="text" defaultValue={user?.fullname} />
          </p>

          <p className="">
            Status:
            <select className="" defaultValue={user?.status}>
              Status:
              <option value="online">online</option>
              <option value="offline">offline</option>
              <option value="busy">busy</option>
              <option value="afk">afk</option>
            </select>
          </p>

          <p className="">
            Bio:
            <textarea defaultValue={user?.bio} name="" className="block box-border w-full"></textarea>
          </p>

          <p className="">
            Date of birth:
            <input
              type="date"
              // defaultValue={user.dateOfBirth}
              defaultValue={user?.dateOfBirthIso}
            />
          </p>

          <p className="">
            Avatar Link: <input className="block w-full" onChange={(e) => setAvatarLinkString(e.target.value)} type="text" defaultValue={avatarLinkString} />
          </p>

          <div className="flex gap-4 items-center justify-between">
            <button className="">
              <FakeLink>delete user</FakeLink>
            </button>
            <button className="">
              <FakeLink>update user</FakeLink>
            </button>
          </div>

          <hr className="my-4" />

          <p className="">Created at: {user?.createdAtFormatted}</p>
          <p className="">Updated at: {user?.updatedAtFormatted}</p>
        </div>
      </div>
    </section>
  );
}

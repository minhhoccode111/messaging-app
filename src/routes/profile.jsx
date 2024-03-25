import { useState, useEffect, useRef } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loading, Error, FakeLink } from './../components';

export default function Profile() {
  const { loginState } = useOutletContext();

  const user = loginState.user;

  const [avatarLinkString, setAvatarLinkString] = useState(user?.avatarLink);

  // only logged in user be able to go to this route
  if (!loginState.token || !loginState.user) return <Navigate to={'/login'} />;

  async function handleUpdateSubmit(e) {
    //
  }

  return (
    <section className="mx-auto max-w-[60ch] px-4 py-16 my-10 sm:px-6 lg:px-8 shadow-lg shadow-gray-400 rounded-xl bg-[#ffffffcc] text-slate-900">
      {/* preview container */}

      <article className="mb-8">
        <header className="">
          <h2 className="text-2xl font-bold">Preview</h2>
        </header>

        <div className="flex items-center justify-center self-center rounded-full my-8">
          {/* make the alt text center just in case the link is not an image */}
          <img className="rounded-full text-xs w-48 h-48 bg-warn grid place-items-center" src={user.avatarLink} alt={user?.fullname + ' avatar'} />
        </div>

        <div className="grid gap-4 grid-cols-custom">
          <h3 className="font-bold">Fullname </h3>
          <p className="">{user.fullname}</p>
          <h3 className="font-bold">Status</h3>
          {/* custom tailwind base on user.status */}
          <p className={'capitalize' + ' ' + (user.status === 'online' ? 'text-success' : user.status === 'busy' ? 'text-busy' : user.status === 'afk' ? 'text-afk' : 'text-gray-500')}>
            {user.status}
          </p>
          <h3 className="font-bold">Bio </h3>
          <p className="">{user.bio}</p>
          <h3 className="font-bold">Date of birth</h3>
          <p className="">{user.dateOfBirthFormatted.split(' - ')[0]}</p>
        </div>
      </article>

      {/* Update container  */}
      <article className="mb-8">
        <header className="">
          <h2 className="text-2xl font-bold">Update</h2>
        </header>

        <div className="">
          <p className="">Fullname</p>
          <input type="text" defaultValue={user?.fullname} />

          <p className="">Status</p>
          <select className="" defaultValue={user?.status}>
            Status:
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="busy">Busy</option>
            <option value="afk">Afk</option>
          </select>

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

          <div className="flex gap-4 items-center justify-end">
            <button className="ripper px-4 py-2">Update</button>
          </div>

          <hr className="my-4" />

          <p className="">Created at: {user?.createdAtFormatted}</p>
          <p className="">Updated at: {user?.updatedAtFormatted}</p>
        </div>
      </article>
    </section>
  );
}

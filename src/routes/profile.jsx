import { useState, useEffect, useRef } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loading, Error, FakeLink } from './../components';
import { domParser } from './../methods/index';

export default function Profile() {
  const { loginState } = useOutletContext();

  const user = loginState.user;

  const [avatarLinkString, setAvatarLinkString] = useState(user?.avatarLink);

  const [errorMessages, setErrorMessages] = useState([]);

  // only logged in user be able to go to this route
  if (!loginState.token || !loginState.user) return <Navigate to={'/'} />;

  async function handleUpdateSubmit(e) {
    //
  }

  return (
    <section className="mx-auto max-w-[60ch] px-4 py-16 my-10 sm:px-6 lg:px-8 shadow-lg shadow-gray-400 rounded-xl bg-[#ffffffcc] text-slate-900 w-full">
      {/* preview container */}

      <article className="mt-4 mb-8">
        <header className="">
          <h2 className="text-2xl font-bold">Preview</h2>
        </header>

        <div className="flex items-center justify-center self-center rounded-full my-8">
          {/* make the alt text center just in case the link is not an image, also make it unescaped */}
          <img className="rounded-full text-xs w-48 h-48 bg-warn grid place-items-center" src={user.avatarLink} alt={domParser(user?.fullname) + ' avatar'} />
        </div>

        <div className="grid gap-4 grid-cols-custom">
          <h3 className="font-bold">Fullname </h3>
          {/* unescaped user fullname */}
          <h3 className="">{domParser(user.fullname)}</h3>

          <h3 className="font-bold">Status</h3>
          {/* custom tailwind base on user.status */}
          <p className={'capitalize' + ' ' + (user.status === 'online' ? 'text-success' : user.status === 'busy' ? 'text-busy' : user.status === 'afk' ? 'text-afk' : 'text-gray-500')}>
            {user.status}
          </p>

          <h3 className="font-bold">Bio </h3>
          <p className="">{domParser(user.bio)}</p>

          <h3 className="font-bold">Date of birth</h3>
          <p className="">{user.dateOfBirthFormatted?.split(' - ')[0]}</p>
        </div>
      </article>

      <hr className="" />

      {/* Update container  */}
      <form className="mt-8 mb-4" onSubmit={handleUpdateSubmit}>
        <header className="">
          <h2 className="text-2xl font-bold">Update</h2>
        </header>

        <div className="flex items-center justify-center self-center rounded-full my-8">
          {/* make the alt text center just in case the link is not an image */}
          <img className="rounded-full text-xs w-48 h-48 bg-warn grid place-items-center" src={avatarLinkString && avatarLinkString} alt={domParser(user?.fullname) + ' avatar'} />
        </div>

        {/* update fullname */}
        <div className="grid gap-4 grid-cols-custom">
          <h3 className="font-bold">Fullname </h3>
          {/* unescaped default value inputs */}
          <input id="fullname" name="fullname" type="text" defaultValue={domParser(user?.fullname)} />

          {/* update current status */}
          <h3 className="font-bold">Status</h3>
          {/* custom tailwind base on user.status */}
          <select id="status" name="status" className="" defaultValue={user?.status}>
            Status:
            <option className="text-online" value="online">
              Online
            </option>
            <option className="text-gray-500" value="offline">
              Offline
            </option>
            <option className="text-busy" value="busy">
              Busy
            </option>
            <option className="text-afk" value="afk">
              Afk
            </option>
          </select>

          {/* update bio */}
          <h3 className="font-bold">Bio </h3>
          {/* unescaped default value input */}
          <textarea id="bio" name="bio" rows={8} defaultValue={domParser(user?.bio)} className="block box-border w-full"></textarea>

          {/* update date of birth */}
          <h3 className="font-bold">Date of birth</h3>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            // defaultValue={user.dateOfBirth}
            defaultValue={user?.dateOfBirthIso}
          />

          {/* update avatar link */}
          <h3 className="font-bold">Avatar link</h3>
          <input id="avatarLink" name="avatarLink" className="block w-full" onChange={(e) => setAvatarLinkString(e.target.value)} type="text" defaultValue={avatarLinkString} />
        </div>

        {errorMessages.length !== 0 && (
          <li className="text-danger font-bold text-lg">
            {errorMessages.map((e, index) => (
              <li key={index}>{e}</li>
            ))}
          </li>
        )}

        {/* update button */}
        <div className="flex gap-4 items-center justify-end my-4">
          <button className="ripper px-4 py-2">Update</button>
        </div>
      </form>
    </section>
  );
}

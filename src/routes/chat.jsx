import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useOutletContext, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loading, Error, SubmitButton, CustomButton, FakeLink, NumberCounter } from './../components/more';
import UserContact from './../components/contact/UserContact';
import GroupContact from './../components/contact/GroupContact';
import GroupForm from './../components/contact/GroupForm';

function useFetchContact() {
  const { loginState } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dataContact, setDataContact] = useState({});
  const [willFetchContact, setWillFetchContact] = useState(false);

  useEffect(() => {
    async function tmp() {
      try {
        setIsLoading(true);

        const [userContactRes, groupContactRes] = await Promise.all([
          axios({
            mode: 'cors',
            method: 'get',
            url: import.meta.env.VITE_API_ORIGIN + '/chat/users',
            headers: {
              Authorization: `Bearer ${loginState?.token}`,
            },
          }),
          axios({
            mode: 'cors',
            method: 'get',
            url: import.meta.env.VITE_API_ORIGIN + '/chat/groups',
            headers: {
              Authorization: `Bearer ${loginState?.token}`,
            },
          }),
        ]);

        // extract data from responses
        const data = {};
        const statusTable = {
          offline: 0,
          afk: 1,
          busy: 2,
          online: 3,
        };
        // 1 extra step to sort users contact data base on status
        data.users = userContactRes.data.users.sort((a, b) => statusTable[b.status] - statusTable[a.status]);
        data.joinedGroups = groupContactRes.data.joinedGroups;
        data.publicGroups = groupContactRes.data.publicGroups;
        data.privateGroups = groupContactRes.data.privateGroups;

        // console.log(userContactRes.data);
        // console.log(groupContactRes.data);

        // console.log(`the data belike: `, data);
        // console.log(dataContact);

        setDataContact(() => ({ ...data }));
      } catch (error) {
        // console.log(error);

        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    tmp();
    // flag to re-fetch
  }, [willFetchContact]);

  return { isLoading, isError, dataContact, setWillFetchContact };
}

export default function Chat() {
  const { loginState } = useOutletContext();

  // contact data, fetch states, flag to re-fetch
  const { isLoading, isError, dataContact, setWillFetchContact } = useFetchContact();

  // an array of messages to display in chat section
  const [currentMessages, setCurrentMessages] = useState();

  // an object to display in options section, {info: {}, members:[]}
  // includes info of current user or group, members for group only
  const [currentOptions, setCurrentOptions] = useState({});

  // identify which conversation current logged in user is engaging
  const [currentConversation, setCurrentConversation] = useState();

  // clear current working conversation when dataContact change
  useEffect(() => {
    setCurrentMessages();
    setCurrentOptions({});
    setCurrentConversation();
  }, [dataContact]);

  // which section to expand
  const [currentOpenSection, setCurrentOpenSection] = useState('');

  // only logged in user be able to go to this route
  if (!loginState.token || !loginState.user) return <Navigate to={'/'} />;

  // set current open section when button clicked
  function handleToggleClick(section) {
    return function () {
      if (currentOpenSection === section) setCurrentOpenSection('');
      else setCurrentOpenSection(section);
    };
  }

  // based on current open section to return a class
  function sectionExpand(current) {
    return currentOpenSection === current ? 'max-h-full' : 'max-h-0';
  }

  // based on current open section to return a class
  function sectionHighlight(current) {
    return currentOpenSection === current ? 'bg-red-300' : 'bg-red-100';
  }

  // console.log(dataContact);

  const users = dataContact?.users;
  const joinedGroups = dataContact?.joinedGroups;
  const publicGroups = dataContact?.publicGroups;
  const privateGroups = dataContact?.privateGroups;

  return (
    <section className="text-slate-900 p-2 grid grid-cols-chat grid-rows-chat gap-2 border-2 border-success">
      {/* display contact section */}
      <article className="overflow-y-auto shadow-gray-400 rounded-xl p-1 shadow-2xl bg-white max-w-[20rem] max-h-full flex flex-col gap-1">
        {/* other users */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-xl p-4 text-center w-full rounded-md hover:bg-red-300 transition-all shadow-md' + ' ' + sectionHighlight('users')}
          onClick={handleToggleClick('users')}
        >
          <FakeLink>Users</FakeLink>
          <NumberCounter>{users?.length}</NumberCounter>
        </button>
        <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('users')}>
          {users?.map((u) => {
            return <UserContact user={u} key={u.id} />;
          })}
        </ul>

        {/* joined groups */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-xl p-4 text-center w-full rounded-md hover:bg-red-300 transition-all shadow-md' + ' ' + sectionHighlight('joined')}
          onClick={handleToggleClick('joined')}
        >
          <FakeLink>Joined Groups</FakeLink>
          <NumberCounter>{joinedGroups?.length}</NumberCounter>
        </button>
        <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('joined')}>
          {joinedGroups?.map((gr) => {
            return <GroupContact group={gr} key={gr.id} />;
          })}
        </ul>

        {/* public groups */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-xl p-4 text-center w-full rounded-md hover:bg-red-300 transition-all shadow-md' + ' ' + sectionHighlight('public')}
          onClick={handleToggleClick('public')}
        >
          <FakeLink>Public Groups</FakeLink>
          <NumberCounter>{publicGroups?.length}</NumberCounter>
        </button>
        <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('public')}>
          {publicGroups?.map((gr) => {
            return <GroupContact group={gr} key={gr.id} />;
          })}
        </ul>

        {/* private groups */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-xl p-4 text-center w-full rounded-md hover:bg-red-300 transition-all shadow-md' + ' ' + sectionHighlight('private')}
          onClick={handleToggleClick('private')}
        >
          <FakeLink>Private Groups</FakeLink>
          <NumberCounter>{privateGroups?.length}</NumberCounter>
        </button>
        <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('private')}>
          {privateGroups?.map((gr) => {
            return <GroupContact group={gr} key={gr.id} />;
          })}
        </ul>

        {/* new group */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-xl p-4 text-center w-full rounded-md hover:bg-red-300 transition-all shadow-md' + ' ' + sectionHighlight('new')}
          onClick={handleToggleClick('new')}
        >
          <FakeLink>New Group</FakeLink>
          <NumberCounter>
            <FaPlus className="text-white font-bold" />
          </NumberCounter>
        </button>
        <div className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('new')}>
          <GroupForm setWillFetchContact={setWillFetchContact} />
        </div>
      </article>

      {/* display chat section */}
      <article className="overflow-y-auto shadow-gray-400 rounded-xl p-4 shadow-2xl bg-white">
        {/* display old messages section */}
        <div className=""></div>

        {/* form to send message section */}
        <div className=""></div>
      </article>

      {/* display option section */}
      <article className="overflow-y-auto shadow-gray-400 rounded-xl p-1 shadow-2xl bg-white max-w-[20rem] max-h-full">
        {/* display user or group  */}
        <div className=""></div>

        {/* display group's members */}
        <div className=""></div>
      </article>
    </section>
  );
}

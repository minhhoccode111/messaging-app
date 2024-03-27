import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useOutletContext, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loading, Error, FakeLink, NumberCounter } from './../components/more';
import UserContact from './../components/contact/UserContact';
import GroupContact from './../components/contact/GroupContact';
import GroupForm from './../components/contact/GroupForm';
import ChatForm from './../components/chat/ChatForm';
import Message from './../components/chat/Message';

function useFetchContact() {
  const { loginState } = useOutletContext();
  const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [isErrorContact, setIsErrorContact] = useState(false);
  const [dataContact, setDataContact] = useState({});
  const [willFetchContact, setWillFetchContact] = useState(false);

  // first load all conversations existed
  useEffect(() => {
    async function tmp() {
      try {
        setIsLoadingContact(true);

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

        setIsErrorContact(true);
      } finally {
        setIsLoadingContact(false);
      }
    }

    tmp();
    // flag to re-fetch
  }, [willFetchContact]);

  return { isLoadingContact, isErrorContact, dataContact, setWillFetchContact };
}

export default function Chat() {
  const { loginState } = useOutletContext();

  // contact data, fetch states, flag to re-fetch
  const { isLoadingContact, isErrorContact, dataContact, setWillFetchContact } = useFetchContact();

  // an array of messages to display in chat section
  const [chatMessages, setChatMessages] = useState();

  // an object to display in options section, {info: {}, members:[]}
  // includes info of current user or group, members for group only
  const [chatOptions, setChatOptions] = useState({});

  // identify which chat current logged in user is engaging
  // like :userid or :groupid
  const [chatId, setChatId] = useState('');
  const [chatType, setChatType] = useState('');

  // fetching states of chat (messages and options)
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isErrorChat, setIsErrorChat] = useState(false);

  // change chatMessages and chatOptions base on current chat
  useEffect(() => {
    // console.log(`chatId belike: `, chatId);
    // console.log(`chatType belike: `, chatType);

    async function userChat() {
      console.log(`fetch user chat`);

      try {
        setIsLoadingChat(true);

        const res = await axios({
          mode: 'cors',
          method: 'get',
          url: import.meta.env.VITE_API_ORIGIN + `/chat/${chatType}/${chatId}`,
          headers: {
            Authorization: `Bearer ${loginState?.token}`,
          },
        });

        console.log(res.data);
      } catch (error) {
        console.log(error);
        console.log(error.response.status);

        setIsErrorChat(true);
      } finally {
        //
        setIsLoadingChat(false);
      }
    }
    async function groupChat() {
      console.log(`fetch group chat`);

      try {
        setIsLoadingChat(true);

        const res = await axios({
          mode: 'cors',
          method: 'get',
          url: import.meta.env.VITE_API_ORIGIN + `/chat/${chatType}/${chatId}`,
          headers: {
            Authorization: `Bearer ${loginState?.token}`,
          },
        });

        console.log(res.data);
      } catch (error) {
        console.log(error);
        console.log(error.response.status);

        setIsErrorChat(true);
      } finally {
        //
        setIsLoadingChat(false);
      }
    }

    if (chatType === 'users') userChat();
    if (chatType === 'groups') groupChat();
  }, [chatId, chatType, loginState]);

  // clear current working conversation when dataContact change
  useEffect(() => {
    setChatMessages();
    setChatOptions({});
    setChatId('');
    setChatType('');

    // console.log('cleared current engaging conversation');
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
        {/* button to toggle expand ul */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-xl p-4 text-center w-full rounded-md hover:bg-red-300 transition-all shadow-md' + ' ' + sectionHighlight('users')}
          onClick={handleToggleClick('users')}
        >
          <FakeLink>Users</FakeLink>
          <NumberCounter>{users?.length}</NumberCounter>
        </button>
        {/* ul display other users conversations */}
        <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('users')}>
          {users?.map((u) => {
            // to display current chat we are focused
            return <UserContact chatId={chatId} setChatId={setChatId} chatType={chatType} setChatType={setChatType} user={u} key={u.id} />;
          })}
        </ul>

        {/* joined groups */}
        {/* button to toggle expand ul */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-xl p-4 text-center w-full rounded-md hover:bg-red-300 transition-all shadow-md' + ' ' + sectionHighlight('joined')}
          onClick={handleToggleClick('joined')}
        >
          <FakeLink>Joined Groups</FakeLink>
          <NumberCounter>{joinedGroups?.length}</NumberCounter>
        </button>
        {/* ul to display all joined groups */}
        <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('joined')}>
          {joinedGroups?.map((gr) => {
            // to display current chat we are focused
            return <GroupContact chatId={chatId} setChatId={setChatId} chatType={chatType} setChatType={setChatType} group={gr} key={gr.id} />;
          })}
        </ul>

        {/* public groups */}
        {/* button to toggle expand ul */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-xl p-4 text-center w-full rounded-md hover:bg-red-300 transition-all shadow-md' + ' ' + sectionHighlight('public')}
          onClick={handleToggleClick('public')}
        >
          <FakeLink>Public Groups</FakeLink>
          <NumberCounter>{publicGroups?.length}</NumberCounter>
        </button>
        {/* ul to display all public groups */}
        <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('public')}>
          {publicGroups?.map((gr) => {
            // to display current chat we are focused
            return <GroupContact chatId={chatId} setChatId={setChatId} chatType={chatType} setChatType={setChatType} group={gr} key={gr.id} />;
          })}
        </ul>

        {/* private groups */}
        {/* button to toggle expand ul */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-xl p-4 text-center w-full rounded-md hover:bg-red-300 transition-all shadow-md' + ' ' + sectionHighlight('private')}
          onClick={handleToggleClick('private')}
        >
          <FakeLink>Private Groups</FakeLink>
          <NumberCounter>{privateGroups?.length}</NumberCounter>
        </button>
        {/* ul to display all private groups */}
        <ul className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('private')}>
          {privateGroups?.map((gr) => {
            // to display current chat we are focused
            return <GroupContact chatId={chatId} setChatId={setChatId} chatType={chatType} setChatType={setChatType} group={gr} key={gr.id} />;
          })}
        </ul>

        {/* new group */}
        {/* button to toggle expand form */}
        <button
          className={'flex items-center justify-between gap-2 font-bold text-xl p-4 text-center w-full rounded-md hover:bg-red-300 transition-all shadow-md' + ' ' + sectionHighlight('new')}
          onClick={handleToggleClick('new')}
        >
          <FakeLink>New Group</FakeLink>
          <NumberCounter>
            <FaPlus className="text-white font-bold" />
          </NumberCounter>
        </button>
        {/* form to create new group */}
        <div className={'overflow-y-auto transition-all origin-top' + ' ' + sectionExpand('new')}>
          {/* to switch flag and fetch contacts again after creating a group */}
          <GroupForm setWillFetchContact={setWillFetchContact} />
        </div>
      </article>

      {/* display chat section */}
      <article className="overflow-y-auto shadow-gray-400 rounded-xl p-4 shadow-2xl bg-white">
        {/* display old messages section */}
        <ul className="overflow-y-auto">
          {chatMessages?.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </ul>

        {/* form to send message section */}
        <div className="">
          <ChatForm setChatMessages={setChatMessages} />
        </div>
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

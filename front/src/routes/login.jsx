import { useNavigate, Link } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";
import { Loading, Error, SubmitButton } from "./../components/more";
import useAuthStore from "../stores/auth";
import { ApiOrigin, NumberRandomUsers } from "../shared/constants";

export default function Login() {
  // back to home after logging
  const navigate = useNavigate();

  // store token to local storage after logging
  const { setAuthData } = useAuthStore();

  // handle fetch states
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // error messages to display
  const [displayMessages, setDisplayMessages] = useState([]);

  // keep track of username and password elements
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  // handle login submit manually
  async function handleLoginFormSubmit(e) {
    e.preventDefault();
    const username = usernameRef.current;
    const password = passwordRef.current;

    setIsLoading(() => true);

    try {
      const res = await axios({
        mode: "cors",
        method: "post",
        url: ApiOrigin + "/auth/login",
        data: {
          username: username.value,
          password: password.value,
        },
      });

      // console.log(res.data);

      // set to display different Layout
      setAuthData(res.data);

      // go to profile after user logged in
      navigate("/profile");
    } catch (err) {
      console.log(`login error belike: `, err);
      if (err.response.status === 400) {
        setDisplayMessages(() => [
          { msg: `*Username or password do not match` },
        ]);
      } else {
        setIsError(() => true);

        setDisplayMessages(() => [
          { msg: `*There is a server error or internet connection!` },
        ]);
      }
    } finally {
      setIsLoading(() => false);
    }
  }

  async function handleLoginRandom(e) {
    e.preventDefault();

    try {
      setIsLoading(true);

      // from 0 to number random accounts to use
      const random = Math.floor(Math.random() * Number(NumberRandomUsers));

      const username = "asd" + random;
      const password = "asd";

      const res = await axios({
        mode: "cors",
        url: ApiOrigin + "/auth/login",
        method: "post",
        data: {
          username,
          password,
        },
      });

      // console.log(res.data);

      setAuthData(res.data);

      navigate("/profile");
    } catch (err) {
      console.log(err);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-[60ch] px-4 py-16 my-10 sm:px-6 lg:px-8 shadow-lg shadow-gray-400 rounded-xl bg-[#ffffffcc] text-slate-900">
      {/* header and dummy text */}
      <div className="mx-auto text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Login</h1>

        <p className="mt-4 text-gray-500">
          To participate in the conversation, express your opinions, and share
          valuable insights with others, consider logging in to chat!
        </p>
      </div>

      <form
        onSubmit={handleLoginFormSubmit}
        className="mx-auto mb-0 mt-8 space-y-4"
      >
        <div className="">
          <label htmlFor="username" className="sr-only">
            Username
          </label>

          <div className="relative">
            <input
              name="username"
              id="username"
              ref={usernameRef}
              type="text"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
              placeholder="Enter username"
              required
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="">
          <label htmlFor="password" className="sr-only">
            Password
          </label>

          <div className="relative">
            <input
              name="password"
              id="password"
              ref={passwordRef}
              type="password"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
              placeholder="Enter password"
              required
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <p>
              No account?{" "}
              <Link className="underline text-link" to="/signup">
                Sign up
              </Link>{" "}
              now
            </p>
          </div>

          {/* if a server error or no internet connection */}
          {isError ? (
            <SubmitButton isDisable={true}>
              <Error />
            </SubmitButton>
          ) : // if waiting for response
          isLoading ? (
            <SubmitButton isDisable={true}>
              <Loading />
            </SubmitButton>
          ) : (
            // display login button
            <SubmitButton isDisable={false}>Login</SubmitButton>
          )}
        </div>
      </form>

      <form onSubmit={handleLoginRandom} className="flex items-center">
        <span className="text-gray-500 mr-2">Or login </span>{" "}
        {isError ? (
          <SubmitButton isDisable={true}>
            <Error />
          </SubmitButton>
        ) : // if waiting for response
        isLoading ? (
          <SubmitButton isDisable={true}>
            <Loading />
          </SubmitButton>
        ) : (
          // display login button
          <SubmitButton isDisable={false}>Random</SubmitButton>
        )}
      </form>

      {/* a list of error messages from server (wrong password and stuffs) */}
      {displayMessages.length !== 0 && (
        <div className="px-8 py-2 font-bold text-lg">
          {displayMessages.map((error, index) => {
            return (
              <p key={index} className="text-danger">
                {error.msg}
              </p>
            );
          })}
        </div>
      )}
    </section>
  );
}

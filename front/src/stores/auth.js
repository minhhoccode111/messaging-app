import { create } from "zustand";

import { AuthStoreName } from "../shared/constants";

const useAuthStore = create((set) => {
  const authData =
    localStorage.getItem(AuthStoreName) === null
      ? {}
      : JSON.parse(localStorage.getItem(AuthStoreName));

  return {
    authData,
    setAuthData: (data) => {
      console.log(`the authData is: `, data); // TODO: turn this off
      localStorage.setItem(AuthStoreName, JSON.stringify(data));
      set(() => ({ authData: data }));
    },
  };
});

export default useAuthStore;

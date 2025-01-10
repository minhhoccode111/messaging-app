import { Outlet, useLocation } from "react-router-dom";
import { Footer, Header } from "./../components/more";
import { Fragment, useEffect } from "react";
import axios from "axios";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const tmp = async () => {
      try {
        await axios({
          mode: "cors",
          method: "get",
          url: import.meta.env.VITE_API_ORIGIN + "/user",
          headers: {
            Authorization: `Bearer asd`,
          },
        });
      } catch (err) {
        console.log(`try to wake the server up early`, err);
      }
    };

    tmp();
  }, []);

  return (
    <>
      {/* pathname !== "/chat" && <Header /> */}
      <Header />

      <main className={"flex-1"}>
        <Outlet />
      </main>

      {/* pathname !== "/" && pathname !== "/chat" && <Footer /> */}
      <Footer />
    </>
  );
}

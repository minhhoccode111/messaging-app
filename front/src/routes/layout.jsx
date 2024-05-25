import { Outlet, useLocation } from "react-router-dom";
import { Footer, Header } from "./../components/more";

export default function Layout() {
  // location.pathname - the path of the current URL
  const { pathname } = useLocation();

  return (
    <>
      {pathname !== "/chat" && <Header />}

      <main className={"flex-1"}>
        <Outlet />
      </main>

      {pathname !== "/" && pathname !== "/chat" && <Footer />}
    </>
  );
}

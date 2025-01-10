import { Outlet, useLocation } from "react-router-dom";
import { Footer, Header } from "./../components/more";

export default function Layout() {
  // location.pathname - the path of the current URL
  const { pathname } = useLocation();

  return (
    <Fragment>
      <Header />

      {/* overflow-hidden so that it never goes past the parent */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {pathname !== "/" && pathname !== "/chat" && <Footer />}
    </Fragment>
  );
}

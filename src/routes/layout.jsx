import { Outlet, useLocation } from 'react-router-dom';
import { Footer, Header } from './../components';

export default function Layout() {
  // location.pathname - the path of the current URL
  const { pathname } = useLocation();

  return (
    <>
      {/* index don't need Header */}
      {pathname !== '/' && <Header />}

      {/* dynamic part */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* footer part */}
      {pathname !== '/' && pathname !== '/play' && <Footer />}
    </>
  );
}

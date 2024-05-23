import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './404';
import Layout from './layout';
import Index from './index';
import Profile from './profile';
import Chat from './chat';
import About from './about';
import Login from './login';
import { loader as logoutLoader } from './logout';
import Signup from './signup';

export default function Router() {
  // setting router
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Index />,
          errorElement: <NotFound />,
        },

        {
          path: 'profile',
          element: <Profile />,
        },

        {
          path: 'chat',
          element: <Chat />,
        },

        {
          path: 'login',
          element: <Login />,
        },

        {
          path: 'logout',
          loader: logoutLoader
        },

        {
          path: 'signup',
          element: <Signup />,
        },

        {
          path: 'about',
          element: <About />,
        },
      ],
    },
  ]);

  // wrapper with setting router
  return <RouterProvider router={router} />;
}

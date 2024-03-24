import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './404';
import Layout from './layout';
import Index from './index';
import Score from './score';
import Game from './game';
import About from './about';

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
          path: 'score',
          element: <Score />,
          errorElement: <NotFound />,
        },

        {
          path: 'game',
          element: <Game />,
          errorElement: <NotFound />,
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

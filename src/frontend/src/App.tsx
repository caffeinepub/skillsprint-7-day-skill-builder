import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import SkillInputForm from './pages/SkillInputForm';
import PlanResults from './pages/PlanResults';
import UnlockPage from './pages/UnlockPage';

// Root route with Layout wrapper
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SkillInputForm,
});

// Plan results route
const planRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plan/$planId',
  component: PlanResults,
});

// Hidden unlock page route
const unlockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/unlock',
  component: UnlockPage,
});

const routeTree = rootRoute.addChildren([indexRoute, planRoute, unlockRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

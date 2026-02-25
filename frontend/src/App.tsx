import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import SkillInputForm from './pages/SkillInputForm';
import PlanResults from './pages/PlanResults';

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

const routeTree = rootRoute.addChildren([indexRoute, planRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

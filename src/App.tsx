import { useUserSettings } from '@Hooks/useUserSettings';
import { routes } from '@Routes/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { changeRootFontSize } from './Utils';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AsyncBoundary } from '@Components/AsyncBoundary';
import { ErrorView } from '@Components/ErrorView';

const router = createBrowserRouter(routes);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
});

const App = () => {
  return (
    <>
      <UserSettingsHandler />

      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <RecoilRoot>
          <AsyncBoundary ErrorFallback={ErrorView} SuspenseFallback={<></>}>
            <RouterProvider router={router} />
          </AsyncBoundary>
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
};

const UserSettingsHandler = () => {
  const { get: getUserSettings } = useUserSettings();

  useEffect(() => {
    const savedUserSettings = getUserSettings();

    if (savedUserSettings === null) {
      return;
    }

    const { baseFontSize } = savedUserSettings;

    changeRootFontSize(baseFontSize);
  }, []);

  return null;
};

export default App;

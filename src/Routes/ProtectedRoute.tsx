import { auth } from '@Firebase/firebase';
import { PropsWithChildren } from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';

export async function loader() {
  await auth.authStateReady();
  return { isLoggined: auth.currentUser !== null };
}

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isLoggined } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  if (!isLoggined) {
    return <Navigate to="/" />;
  }

  return children;
};

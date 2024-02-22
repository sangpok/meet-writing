import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, type PropsWithChildren, type SuspenseProps } from 'react';
import { ErrorBoundary, type ErrorBoundaryPropsWithRender } from 'react-error-boundary';

type ExceptFallbackErrorBoundaryAttributes = Omit<
  ErrorBoundaryPropsWithRender,
  'fallbackRender' | 'fallback' | 'FallbackComponent' | 'onReset'
>;

type AsyncBoundaryProps = PropsWithChildren<{
  ErrorFallback: ErrorBoundaryPropsWithRender['fallbackRender'];
  SuspenseFallback: SuspenseProps['fallback'];
}> &
  ExceptFallbackErrorBoundaryAttributes;

export const AsyncBoundary = ({
  children,
  ErrorFallback,
  SuspenseFallback,
  ...restErrorBoundaryAttributes
}: AsyncBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallbackRender={ErrorFallback}
          onReset={reset}
          {...restErrorBoundaryAttributes}
        >
          <Suspense fallback={SuspenseFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

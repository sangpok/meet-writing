import { useEffect, useMemo } from 'react';

export const useInfiniteObserver = ({
  parentNodeId,
  onIntersection,
}: {
  parentNodeId: string;
  onIntersection: () => void;
}) => {
  const intersectionObserver = useMemo(
    () =>
      new IntersectionObserver(
        ([intersection]) => {
          const { isIntersecting } = intersection;
          isIntersecting && onIntersection();
        },
        { threshold: 0.1 }
      ),
    []
  );

  const mutationObserver = useMemo(
    () =>
      new MutationObserver((mutations) => {
        const [lastNode] = mutations.pop()!.addedNodes;

        intersectionObserver.disconnect();
        intersectionObserver.observe(lastNode as Element);
      }),
    []
  );

  const disconnect = () => {
    mutationObserver.disconnect();
    intersectionObserver.disconnect();
  };

  useEffect(() => {
    const parentNode = document.getElementById(parentNodeId)!;

    mutationObserver.observe(parentNode, { childList: true });
    intersectionObserver.observe(parentNode.lastElementChild! || parentNode);

    return () => disconnect();
  }, []);

  return { disconnect };
};

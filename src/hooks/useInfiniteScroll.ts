import { useEffect, useRef, useState } from "react";

type UseInfiniteScrollCallback = () => Promise<void>;

export function useInfiniteScroll(
  callback: UseInfiniteScrollCallback
): [React.MutableRefObject<HTMLDivElement | null>, boolean] {
  const [isFetching, setIsFetching] = useState(false);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const fetchMore = async () => {
    setIsFetching(true);
    await callback();
    setIsFetching(false);
  };

  useEffect(() => {
    if (!targetRef.current) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchMore();
      }
    }, observerOptions);

    intersectionObserver.observe(targetRef.current);
    setObserver(intersectionObserver);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [targetRef.current]);

  return [targetRef, isFetching];
}

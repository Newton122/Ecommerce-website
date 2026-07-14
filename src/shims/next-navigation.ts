import { useCallback } from "react";

export function usePathname() {
  return typeof window !== "undefined" ? window.location.pathname : "/";
}

export function useParams() {
  if (typeof window === "undefined") {
    return {} as Record<string, string>;
  }

  const path = window.location.pathname;
  const segments = path.split("/").filter(Boolean);
  const params: Record<string, string> = {};

  if (segments.length >= 2) {
    params.id = segments[segments.length - 1];
  }

  return params;
}

export function useSearchParams() {
  if (typeof window === "undefined") {
    return new URLSearchParams("");
  }

  return new URLSearchParams(window.location.search);
}

export function useRouter() {
  const push = useCallback((href: string) => {
    if (typeof window === "undefined") return;
    const url = new URL(href, window.location.href);
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
    window.scrollTo(0, 0);
  }, []);

  const replace = useCallback((href: string) => {
    if (typeof window === "undefined") return;
    const url = new URL(href, window.location.href);
    window.history.replaceState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
    window.scrollTo(0, 0);
  }, []);

  const back = useCallback(() => {
    if (typeof window === "undefined") return;
    window.history.back();
  }, []);

  return {
    push,
    replace,
    back,
  };
}

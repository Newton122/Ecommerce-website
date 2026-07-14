import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { forwardRef } from "react";

type NextLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string | URL;
  replace?: boolean;
  scroll?: boolean;
};

function isLocalLink(href: string) {
  if (href.startsWith("#")) return false;
  if (href.startsWith("/")) return true;
  try {
    const url = new URL(href, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return url.origin === (typeof window !== "undefined" ? window.location.origin : url.origin);
  } catch {
    return false;
  }
}

const Link = forwardRef<HTMLAnchorElement, NextLinkProps>(({ href, replace, scroll = true, onClick, target, children, ...props }, ref) => {
  const hrefString = String(href);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(event);
    }

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      target && target !== "_self" ||
      !isLocalLink(hrefString)
    ) {
      return;
    }

    event.preventDefault();

    if (typeof window !== "undefined") {
      const url = new URL(hrefString, window.location.href);
      const pathWithQuery = url.pathname + url.search + url.hash;
      
      if (replace) {
        window.history.replaceState({}, "", pathWithQuery);
      } else {
        window.history.pushState({}, "", pathWithQuery);
      }
      
      // Dispatch popstate event to trigger AppRouter update
      window.dispatchEvent(new PopStateEvent("popstate"));

      if (scroll) {
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <a ref={ref} href={hrefString} onClick={handleClick} target={target} {...props}>
      {children}
    </a>
  );
});

Link.displayName = "Link";

export default Link;

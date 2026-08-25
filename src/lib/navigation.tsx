import {
  Link as TanStackLink,
  useLocation,
  useNavigate,
  useRouter as useTanStackRouter,
} from "@tanstack/react-router";
import { forwardRef, type AnchorHTMLAttributes } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, ...props },
  ref,
) {
  if (/^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith("mailto:")) {
    return (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <TanStackLink ref={ref} to={href} {...props}>
      {children}
    </TanStackLink>
  );
});

export default Link;

export function useRouter() {
  const navigate = useNavigate();
  const router = useTanStackRouter();

  return {
    push: (to: string) => navigate({ to }),
    replace: (to: string) => navigate({ to, replace: true }),
    refresh: () => router.invalidate(),
  };
}

export function usePathname() {
  return useLocation({ select: (location) => location.pathname });
}

export function useSearchParams() {
  const search = useLocation({ select: (location) => location.searchStr });
  return new URLSearchParams(search);
}

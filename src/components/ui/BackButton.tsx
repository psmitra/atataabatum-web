import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faHouse } from "@fortawesome/free-solid-svg-icons";

type BackButtonProps = {
  /** Parent route inside the Stock Exchange */
  to?: string;
  /** External URL, e.g. the Atataabatum main dashboard */
  href?: string;
  label?: string;
  variant?: "back" | "home";
};

const styles =
  "group inline-flex items-center gap-1 text-ice/80 hover:text-ice text-sm sm:text-lg shrink-0 transition-colors cursor-pointer";

function Content({
  label,
  variant,
}: {
  label: string;
  variant: "back" | "home";
}) {
  const isHome = variant === "home";

  return (
    <>
      <FontAwesomeIcon
        icon={isHome ? faHouse : faChevronLeft}
        className={
          isHome
            ? "text-sm sm:text-base"
            : "mt-0.5 text-xs sm:text-sm transition-transform duration-200 group-hover:-translate-x-1"
        }
      />
      <span>{label}</span>
    </>
  );
}

export function BackButton({
  to,
  href,
  label,
  variant = "back",
}: BackButtonProps) {
  const text = label ?? (variant === "home" ? "Home" : "Back");

  // External link, e.g. Atataabatum main dashboard
  if (href) {
    return (
      <a href={href} target="_top" rel="noopener" className={styles}>
        <Content label={text} variant={variant} />
      </a>
    );
  }

  // Parent route inside the Stock Exchange
  return (
    <Link to={to ?? "/"} className={styles}>
      <Content label={text} variant={variant} />
    </Link>
  );
}
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

type BackButtonProps = {
  to?: string;
  href?: string;
  label?: string;
};

const styles =
  "group inline-flex items-center gap-0 md:gap-1 text-ice/80 hover:text-ice text-sm sm:text-lg shrink-0 transition-colors";

function Content({ label }: { label: string }) {
  return (
    <>
      <FontAwesomeIcon
        icon={faChevronLeft}
        className="mt-0.5 text-xs sm:text-sm transition-transform duration-200 group-hover:-translate-x-1"
      />
      <span>{label}</span>
    </>
  );
}

export function BackButton({ to, href, label = "Back" }: BackButtonProps) {
  if (href) {
    return (
      <a href={href} target="_top" rel="noopener" className={styles}>
        <Content label={label} />
      </a>
    );
  }
  return (
    <Link to={to ?? "/"} className={styles}>
      <Content label={label} />
    </Link>
  );
}

import type { SVGProps } from "react";

export function BackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2em"
      height="2em"
      viewBox="0 0 24 24"
      color="#7d7a78"
      {...props}
    >
      <path
        fill="currentColor"
        d="m10 18l-6-6l6-6l1.4 1.45L7.85 11H20v2H7.85l3.55 3.55z"
      ></path>
    </svg>
  );
}

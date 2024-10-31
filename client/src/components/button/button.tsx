import { ButtonHTMLAttributes, ReactNode } from "react";

import "./button.scss";

type Props = {
  children: ReactNode | ReactNode[];
};

export const Button = ({
  children,
  ...rest
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...rest} className={`regular-button ${rest.className}`}>
      {children}
    </button>
  );
};

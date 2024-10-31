import "./input.scss";
import { forwardRef, InputHTMLAttributes } from "react";

type Props = {
  error?: boolean;
  errorText?: string;
};

export const Input = forwardRef<
  HTMLInputElement,
  Props & InputHTMLAttributes<HTMLInputElement>
>(({ error = false, errorText, ...rest }, ref) => {
  return (
    <div className="input-container">
      <input ref={ref} {...rest} className={error ? "input-error" : ""} />
      {error ? (
        <p className="input-error-label">{errorText ?? "Set error text"}</p>
      ) : null}
    </div>
  );
});

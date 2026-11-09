export function Button({ children, variant = "primary", ...props }) {
  return (
    <button type="button" className={`button button--${variant}`} {...props}>
      {children}
    </button>
  );
}

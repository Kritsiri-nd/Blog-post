const VARIANT_CLASSES = {
  primary: `bg-brown-600 text-white font-poppins b1 hover:bg-brown-500 disabled:bg-brown-300 disabled:cursor-not-allowed`,
  secondary: `bg-white text-brown-600 font-poppins b1 border border-brown-300 hover:bg-brown-100`,
};

// 👇 ปรับ BASE ใหม่
const BASE =
  "inline-flex items-center justify-center transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed rounded-full px-[40px] py-[12px]";

function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  disabled = false,
  ...props
}) {
  const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${BASE} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

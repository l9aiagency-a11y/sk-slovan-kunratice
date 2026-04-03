import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

type ButtonBaseProps = {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
};

type ButtonWithHref = ButtonBaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "children" | "className"
  >;

type ButtonWithoutHref = ButtonBaseProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "children" | "className"
  >;

type ButtonProps = ButtonWithHref | ButtonWithoutHref;

const primaryClasses =
  "bg-[var(--club-primary)] text-white rounded-full px-6 py-3 font-heading font-semibold uppercase text-[13px] tracking-wide hover:brightness-110 hover:-translate-y-px hover:shadow-lg transition-all inline-block";

const secondaryClasses =
  "bg-transparent border border-gray-300 text-gray-900 rounded-full px-6 py-3 font-heading font-semibold uppercase text-[13px] hover:bg-gray-100 transition-all inline-block";

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = `${variant === "primary" ? primaryClasses : secondaryClasses} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "children" | "className">)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}

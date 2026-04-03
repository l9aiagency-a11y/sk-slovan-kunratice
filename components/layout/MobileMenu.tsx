"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  pathname: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  links,
  pathname,
}: MobileMenuProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-white flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 h-16 shrink-0">
            <Link href="/" onClick={onClose} className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="SK Slovan Kunratice"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Zavřít menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-6">
            {links.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`font-heading font-semibold text-2xl uppercase tracking-wider transition-colors ${
                      isActive
                        ? "text-[var(--club-primary)]"
                        : "text-gray-900 hover:text-[var(--club-primary)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

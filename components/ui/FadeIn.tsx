"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function FadeIn({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

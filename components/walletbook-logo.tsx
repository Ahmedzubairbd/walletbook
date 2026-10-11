"use client";

import { motion } from "framer-motion";

interface WalletBookLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  collapsed?: boolean;
}

export function WalletBookLogo({
  size = "md",
  showText = true,
  collapsed = false,
}: WalletBookLogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 56, text: "text-3xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="relative flex items-center justify-center rounded-xl bg-linear-to-br from-primary via-primary to-primary/80 shadow-lg"
        style={{ width: icon, height: icon }}
        whileHover={{ scale: 1.1, rotate: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Book shape */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[60%] h-[60%]"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <motion.path
            d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          {/* Wallet/money symbol inside book */}
          <motion.circle
            cx="12"
            cy="10"
            r="3"
            stroke="white"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          />
          <motion.path
            d="M12 8v4M10.5 10h3"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
          />
        </svg>

        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-linear-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
          }}
        />
      </motion.div>

      {showText && !collapsed && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className={`${text} font-bold text-foreground tracking-tight`}>
            Wallet<span className="text-primary">Book</span>
          </span>
          <span className="text-[10px] text-muted-foreground -mt-1">
            Powered by NEXT Lab
          </span>
        </motion.div>
      )}
    </div>
  );
}

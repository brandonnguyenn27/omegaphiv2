"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "../ui/aurora-background";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export function AuroraComponent() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="min-h-screen flex items-start justify-center pt-[35vh]">
          <div className="flex flex-col items-center gap-6 font-semibold text-5xl">
            <span>Welcome to Omega Phi</span>
            <Button asChild className="[cursor:pointer]" variant="default">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}

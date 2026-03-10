import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const trustBadges = [
  { icon: Shield, label: "256-bit Encryption" },
  { icon: Lock, label: "Zero Data Storage" },
  { icon: CheckCircle, label: "Breach Verified" },
  { icon: Zap, label: "Real-time Alerts" },
];

const TYSON = "TYSON";

export default function HeroSection() {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < TYSON.length) {
        setDisplayedText(TYSON.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 150);
    return () => clearInterval(typing);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(blink);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#b91c1c" }}
    >
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 scanline-bg pointer-events-none" />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 mt-20 mb-8 px-4 py-2 rounded-full border border-white/40 bg-white/10 flex items-center gap-2 text-sm text-white font-mono tracking-widest"
      >
        <Shield className="w-4 h-4" />
        <span>VERIFIED SECURE PLATFORM — EDUCATIONAL USE ONLY</span>
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="mb-2"
        >
          <h1 className="font-display font-black text-7xl md:text-9xl tracking-[0.2em] text-white glow-text select-none">
            {displayedText}
            <span
              style={{ opacity: cursorVisible ? 1 : 0 }}
              className="inline-block w-1 bg-white ml-1 align-baseline"
              aria-hidden="true"
            />
          </h1>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-display text-xl md:text-3xl text-white tracking-[0.15em] mb-3"
        >
          Your Personal Cyber Shield
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-white/80 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Check if your phone number or email has been compromised in known data
          breaches. Stay informed. Stay protected.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            asChild
            size="lg"
            className="bg-white text-red-700 font-bold tracking-wider px-8 py-6 text-base hover:bg-white/90 hover:scale-105 transition-all duration-300"
            data-ocid="hero.primary_button"
          >
            <a href="#check">
              <Shield className="mr-2 w-5 h-5" />
              Check My Number
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/70 text-white hover:bg-white/10 hover:border-white font-bold tracking-wider px-8 py-6 text-base transition-all duration-300"
            data-ocid="hero.secondary_button"
          >
            <a href="#tips">Explore Cyber Tips</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-white/30 bg-white/10 backdrop-blur"
            >
              <badge.icon className="w-5 h-5 text-white" />
              <span className="text-xs text-white/90 font-mono tracking-wide text-center">
                {badge.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/70 font-mono tracking-widest">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="w-0.5 h-8 bg-gradient-to-b from-white to-transparent"
        />
      </motion.div>
    </section>
  );
}

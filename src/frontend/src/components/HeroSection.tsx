import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";

const trustBadges = [
  { icon: Shield, label: "256-bit Encryption" },
  { icon: Lock, label: "Zero Data Storage" },
  { icon: CheckCircle, label: "Breach Verified" },
  { icon: Zap, label: "Real-time Alerts" },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/tyson-hero-bg.dim_1600x800.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-background/75" />
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute inset-0 scanline-bg pointer-events-none" />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 mt-20 mb-8 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 flex items-center gap-2 text-sm text-primary font-mono tracking-widest animate-pulse-glow"
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
          <h1 className="font-display font-black text-7xl md:text-9xl tracking-[0.2em] text-primary glow-text select-none">
            TYSON
          </h1>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-display text-xl md:text-3xl text-foreground/80 tracking-[0.15em] mb-3"
        >
          Your Personal Cyber Shield
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed"
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
            className="bg-primary text-primary-foreground font-bold tracking-wider px-8 py-6 text-base shadow-cyber hover:shadow-cyber-lg hover:scale-105 transition-all duration-300"
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
            className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary font-bold tracking-wider px-8 py-6 text-base transition-all duration-300"
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
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/40 backdrop-blur"
            >
              <badge.icon className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground font-mono tracking-wide text-center">
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
        <span className="text-xs text-muted-foreground font-mono tracking-widest">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="w-0.5 h-8 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}

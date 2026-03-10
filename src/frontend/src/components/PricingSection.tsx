import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { PlanType } from "../hooks/useQueries";
import PaymentModal from "./PaymentModal";

interface Plan {
  id: PlanType;
  name: string;
  price: string;
  period: string;
  icon: React.ElementType;
  features: string[];
  highlighted?: boolean;
  color: string;
  glowClass: string;
}

const PLANS: Plan[] = [
  {
    id: PlanType.super_,
    name: "Super",
    price: "₹500",
    period: "/month",
    icon: Zap,
    color: "text-blue-400",
    glowClass: "hover:shadow-[0_0_30px_oklch(0.65_0.18_270/0.35)]",
    features: [
      "Basic breach check",
      "10 checks per day",
      "Email alerts",
      "Breach database access",
      "Basic security report",
    ],
  },
  {
    id: PlanType.elite,
    name: "Elite",
    price: "₹1500",
    period: "/3 months",
    icon: Star,
    highlighted: true,
    color: "text-primary",
    glowClass: "hover:shadow-cyber-lg",
    features: [
      "All Super features",
      "50 checks per day",
      "Priority support",
      "Detailed reports",
      "Dark web monitoring",
      "SMS alerts",
    ],
  },
  {
    id: PlanType.premium,
    name: "Premium",
    price: "₹5000",
    period: "/month",
    icon: Crown,
    color: "text-yellow-400",
    glowClass: "hover:shadow-[0_0_30px_oklch(0.80_0.18_85/0.35)]",
    features: [
      "All Elite features",
      "Unlimited checks",
      "Real-time alerts",
      "Advanced analytics",
      "Dedicated support",
      "API access",
      "Custom integrations",
    ],
  },
];

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <section id="pricing" className="section-divider py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-widest mb-4">
            <Crown className="w-3.5 h-3.5" />
            UPGRADE YOUR SHIELD
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">
            Choose Your{" "}
            <span className="text-primary glow-text">Protection Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Elevate your cybersecurity posture with advanced monitoring and
            alerts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={`relative card-cyber rounded-2xl p-6 flex flex-col transition-all duration-300 glow-hover ${
                plan.highlighted
                  ? "border-primary/60 ring-1 ring-primary/30"
                  : ""
              } ${plan.glowClass}`}
              data-ocid={`pricing.item.${i + 1}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-mono font-bold rounded-full tracking-wider">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`p-2.5 rounded-lg border ${
                    plan.highlighted
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-muted/50"
                  }`}
                >
                  <plan.icon className={`w-5 h-5 ${plan.color}`} />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-foreground">
                    {plan.name}
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono tracking-wider">
                    PLAN
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <span
                  className={`font-display font-black text-4xl ${
                    plan.highlighted
                      ? "text-primary glow-text"
                      : "text-foreground"
                  }`}
                >
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm ml-1">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => setSelectedPlan(plan)}
                className={`w-full font-bold tracking-wider transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground shadow-cyber hover:shadow-cyber-lg"
                    : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
                data-ocid={`pricing.primary_button.${i + 1}`}
              >
                Upgrade Now
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          open={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </section>
  );
}

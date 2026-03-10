import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BookOpen, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Category, useAllTips, useTipsByCategory } from "../hooks/useQueries";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: Category.phishing, label: "Phishing" },
  { value: Category.passwords, label: "Passwords" },
  { value: Category.safeBrowsing, label: "Safe Browsing" },
  { value: Category.mobileSecurity, label: "Mobile" },
  { value: Category.emailSafety, label: "Email" },
  { value: Category.malware, label: "Malware" },
];

const CATEGORY_COLORS: Record<string, string> = {
  phishing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  passwords: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  safeBrowsing: "bg-green-500/20 text-green-400 border-green-500/30",
  mobileSecurity: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  emailSafety: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  malware: "bg-red-500/20 text-red-400 border-red-500/30",
};

// Fallback tips if backend hasn't populated yet
const FALLBACK_TIPS = [
  {
    id: 1n,
    title: "Recognize Phishing Emails",
    content:
      "Always verify the sender's email address. Phishing emails often mimic legitimate companies but have slight variations in the domain name. Never click suspicious links.",
    category: Category.phishing,
  },
  {
    id: 2n,
    title: "Use Strong Unique Passwords",
    content:
      "Create passwords with at least 12 characters combining uppercase, lowercase, numbers, and symbols. Never reuse passwords across multiple accounts.",
    category: Category.passwords,
  },
  {
    id: 3n,
    title: "Enable Two-Factor Authentication",
    content:
      "2FA adds an extra layer of security. Even if your password is compromised, attackers cannot access your account without the second factor.",
    category: Category.passwords,
  },
  {
    id: 4n,
    title: "Check URLs Before Clicking",
    content:
      "Hover over links to preview the destination URL. Look for HTTPS and verify the domain name matches the legitimate site before entering any information.",
    category: Category.safeBrowsing,
  },
  {
    id: 5n,
    title: "Update Apps Regularly",
    content:
      "Keep your apps and operating system updated. Security patches are critical — attackers exploit known vulnerabilities in outdated software.",
    category: Category.mobileSecurity,
  },
  {
    id: 6n,
    title: "Beware of Email Attachments",
    content:
      "Never open attachments from unknown senders. Even documents can contain macros that install malware on your device.",
    category: Category.emailSafety,
  },
  {
    id: 7n,
    title: "Install Reputable Antivirus",
    content:
      "Use well-known antivirus software and keep it updated. Real-time protection can detect and block malware before it causes damage.",
    category: Category.malware,
  },
  {
    id: 8n,
    title: "Use Public Wi-Fi Safely",
    content:
      "Avoid accessing sensitive accounts on public Wi-Fi. If necessary, use a VPN to encrypt your connection and protect your data from interception.",
    category: Category.mobileSecurity,
  },
];

function TipCard({
  tip,
  index,
}: {
  tip: { id: bigint; title: string; content: string; category: Category };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-cyber rounded-xl p-5 glow-hover cursor-default"
      data-ocid={`tips.item.${index + 1}`}
    >
      <Badge
        variant="outline"
        className={`text-xs font-mono mb-3 ${CATEGORY_COLORS[tip.category] || "bg-primary/20 text-primary border-primary/30"}`}
      >
        {tip.category.toUpperCase()}
      </Badge>
      <h3 className="font-display font-bold text-foreground mb-2 leading-tight">
        {tip.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {tip.content}
      </p>
    </motion.div>
  );
}

export default function TipsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: allTips, isLoading: allLoading } = useAllTips();
  const { data: filteredTips, isLoading: filteredLoading } = useTipsByCategory(
    activeCategory as Category,
  );

  const isLoading = activeCategory === "all" ? allLoading : filteredLoading;
  const rawTips = activeCategory === "all" ? allTips : filteredTips;
  const tips =
    rawTips && rawTips.length > 0
      ? rawTips
      : activeCategory === "all"
        ? FALLBACK_TIPS
        : FALLBACK_TIPS.filter((t) => t.category === activeCategory);

  return (
    <section id="tips" className="section-divider py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            CYBER AWARENESS
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">
            Security{" "}
            <span className="text-primary glow-text">Tips & Tactics</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Expert-curated cybersecurity knowledge to protect you in the digital
            world.
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-muted/50 border border-border h-auto flex-wrap gap-1 p-1">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="text-xs font-mono tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-ocid="tips.tab"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Tips grid */}
        {isLoading ? (
          <div
            className="flex justify-center py-12"
            data-ocid="tips.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : tips && tips.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {tips.map((tip, i) => (
                <TipCard key={String(tip.id)} tip={tip} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-12" data-ocid="tips.empty_state">
            <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No tips found for this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

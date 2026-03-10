import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Bug,
  Database,
  Eye,
  Globe,
  Key,
  Lock,
  Network,
  RefreshCw,
  Server,
  Shield,
  Skull,
  UserX,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Severity = "Critical" | "High" | "Medium";

interface Attack {
  id: string;
  name: string;
  severity: Severity;
  icon: React.ReactNode;
  description: string;
  howItWorks: string;
  protection: string[];
}

const ATTACKS: Attack[] = [
  {
    id: "sql-injection",
    name: "SQL Injection",
    severity: "Critical",
    icon: <Database className="w-5 h-5" />,
    description:
      "Injects malicious SQL code into queries to manipulate databases.",
    howItWorks:
      "Attackers insert crafted SQL statements into input fields (login forms, search boxes) that get executed by the database. This can expose entire databases, bypass authentication, modify records, or even execute OS commands depending on database privileges and configuration.",
    protection: [
      "Use parameterized queries / prepared statements in all database interactions",
      "Implement strict input validation and whitelist allowed characters",
      "Apply the principle of least privilege — database accounts should have minimal permissions",
    ],
  },
  {
    id: "xss",
    name: "Cross-Site Scripting (XSS)",
    severity: "High",
    icon: <Globe className="w-5 h-5" />,
    description:
      "Injects malicious scripts into web pages viewed by other users.",
    howItWorks:
      "Attackers inject JavaScript into websites through comment fields, user profiles, or URLs. When victims load the page, the malicious script executes in their browser — stealing cookies, session tokens, redirecting users to phishing pages, or performing actions on their behalf.",
    protection: [
      "Sanitize and escape all user-supplied content before rendering in HTML",
      "Implement a strict Content Security Policy (CSP) header",
      "Use modern frameworks (React, Vue) that auto-escape output by default",
    ],
  },
  {
    id: "ddos",
    name: "DDoS Attack",
    severity: "High",
    icon: <Server className="w-5 h-5" />,
    description:
      "Overwhelms servers with massive traffic to cause service outages.",
    howItWorks:
      "Attackers harness thousands of compromised devices (a botnet) to flood a target server with requests simultaneously, exhausting its bandwidth, CPU, or memory. The server becomes unable to serve legitimate users — sometimes within seconds. Volumetric, protocol, and application-layer variants all exist.",
    protection: [
      "Deploy a CDN and DDoS protection service like Cloudflare or AWS Shield",
      "Implement rate limiting and IP reputation-based traffic filtering",
      "Use auto-scaling cloud infrastructure to absorb traffic spikes",
    ],
  },
  {
    id: "phishing",
    name: "Phishing",
    severity: "High",
    icon: <Eye className="w-5 h-5" />,
    description:
      "Deceives victims into revealing credentials via fake messages or sites.",
    howItWorks:
      "Attackers craft convincing emails, SMS (smishing), or voice calls (vishing) impersonating trusted organizations. They create near-identical fake login pages to harvest credentials. Spear phishing targets specific individuals with personalized context, making it significantly harder to detect.",
    protection: [
      "Train employees and users to verify sender addresses and URLs before clicking",
      "Enable DMARC, DKIM, and SPF email authentication on your domain",
      "Use multi-factor authentication so stolen passwords alone aren't sufficient",
    ],
  },
  {
    id: "ransomware",
    name: "Ransomware",
    severity: "Critical",
    icon: <Lock className="w-5 h-5" />,
    description: "Encrypts victim's files and demands payment for decryption.",
    howItWorks:
      "Once executed (often via phishing or malicious download), ransomware quietly scans and encrypts files across the local drive and network shares using strong asymmetric encryption. After completion, it displays a ransom note demanding cryptocurrency payment in exchange for the decryption key.",
    protection: [
      "Maintain regular offline backups (3-2-1 rule: 3 copies, 2 media types, 1 offsite)",
      "Keep all software and OS patched; disable macros in Office documents",
      "Segment your network to limit lateral movement if a machine is compromised",
    ],
  },
  {
    id: "mitm",
    name: "Man-in-the-Middle (MITM)",
    severity: "High",
    icon: <Network className="w-5 h-5" />,
    description:
      "Secretly intercepts and potentially alters communications between parties.",
    howItWorks:
      "The attacker positions themselves between two communicating parties — often on unsecured public Wi-Fi — intercepting traffic. Techniques include ARP poisoning, SSL stripping (downgrading HTTPS to HTTP), and rogue hotspot creation. The victim believes they're communicating securely while all data passes through the attacker.",
    protection: [
      "Always use HTTPS — look for the padlock and verify certificate validity",
      "Use a VPN on public Wi-Fi networks to encrypt all traffic",
      "Enable HSTS (HTTP Strict Transport Security) on web servers",
    ],
  },
  {
    id: "brute-force",
    name: "Brute Force Attack",
    severity: "Medium",
    icon: <Zap className="w-5 h-5" />,
    description:
      "Systematically tries all possible passwords until the correct one is found.",
    howItWorks:
      "Automated tools try millions of password combinations per second — either exhaustive (pure brute force), dictionary-based, or credential stuffing (using breached databases). Simple passwords can be cracked in seconds. Targeted attacks often combine personal information with common substitutions.",
    protection: [
      "Use long, complex, unique passwords — ideally managed by a password manager",
      "Implement account lockout after repeated failed login attempts",
      "Require multi-factor authentication on all user accounts",
    ],
  },
  {
    id: "zero-day",
    name: "Zero-Day Exploit",
    severity: "Critical",
    icon: <Skull className="w-5 h-5" />,
    description:
      "Exploits unknown software vulnerabilities before patches are available.",
    howItWorks:
      "A zero-day is a vulnerability that the software vendor doesn't know about yet — so there's zero days to patch it. Attackers (often nation-state actors) discover these flaws and silently exploit them. Targets may include browsers, OS kernels, or embedded systems. These attacks often persist undetected for months.",
    protection: [
      "Apply security patches immediately when vendors release them",
      "Use exploit mitigation features like ASLR, DEP, and sandboxing",
      "Employ behavioral-based endpoint detection (EDR) that detects anomalies without signatures",
    ],
  },
  {
    id: "social-engineering",
    name: "Social Engineering",
    severity: "High",
    icon: <UserX className="w-5 h-5" />,
    description:
      "Psychologically manipulates people to divulge confidential information.",
    howItWorks:
      "Rather than breaking technical defenses, attackers exploit human factors — authority, urgency, fear, or trust. A call claiming to be IT support, a fake executive email requesting wire transfers (BEC), or a USB drive left in a parking lot are all social engineering vectors. Humans are often the weakest security link.",
    protection: [
      "Run regular security awareness training and simulated social engineering tests",
      "Establish strict verification protocols before sharing sensitive information",
      "Create a culture where employees feel comfortable questioning unusual requests",
    ],
  },
  {
    id: "keylogging",
    name: "Keylogging",
    severity: "High",
    icon: <Bug className="w-5 h-5" />,
    description:
      "Records keystrokes to capture passwords, messages, and sensitive data.",
    howItWorks:
      "Keyloggers can be software (malware that hooks into the OS keyboard driver, browser extensions, JavaScript) or hardware (USB/PS2 dongles between keyboard and computer). All keystrokes — including passwords, credit card numbers, and private messages — are recorded and exfiltrated to the attacker.",
    protection: [
      "Use reputable antivirus/EDR software with behavior-based keylogger detection",
      "Use a password manager so passwords are auto-filled, not typed",
      "Enable 2FA so compromised passwords alone cannot gain access",
    ],
  },
  {
    id: "credential-stuffing",
    name: "Credential Stuffing",
    severity: "Medium",
    icon: <RefreshCw className="w-5 h-5" />,
    description:
      "Uses leaked username/password pairs to break into other accounts.",
    howItWorks:
      "Billions of credentials from past data breaches are freely available on the dark web. Attackers feed these through automated tools that try each pair across hundreds of popular websites simultaneously, exploiting the fact that people reuse passwords. A single data breach can cascade into dozens of account takeovers.",
    protection: [
      "Use a unique, strong password for every single account — use a password manager",
      "Check haveibeenpwned.com regularly to see if your email appears in breaches",
      "Enable login alerts and review active sessions periodically",
    ],
  },
  {
    id: "dns-spoofing",
    name: "DNS Spoofing",
    severity: "High",
    icon: <AlertTriangle className="w-5 h-5" />,
    description:
      "Redirects DNS queries to malicious IP addresses, hijacking web traffic.",
    howItWorks:
      "Attackers corrupt a DNS resolver's cache by injecting forged DNS responses. When victims query a legitimate domain (e.g., yourbank.com), they're silently redirected to an attacker-controlled clone. The browser shows the correct URL but the page is malicious — credentials entered are captured immediately.",
    protection: [
      "Use DNSSEC-enabled resolvers to cryptographically validate DNS responses",
      "Configure HTTPS everywhere and verify SSL certificates match the domain",
      "Use trusted DNS providers (1.1.1.1 or 8.8.8.8) instead of default ISP resolvers",
    ],
  },
];

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; classes: string; glow: string }
> = {
  Critical: {
    label: "Critical",
    classes: "bg-red-500/15 text-red-400 border-red-500/30",
    glow: "hover:shadow-[0_0_20px_oklch(0.55_0.22_25/0.3)]",
  },
  High: {
    label: "High",
    classes: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    glow: "hover:shadow-[0_0_20px_oklch(0.7_0.18_50/0.3)]",
  },
  Medium: {
    label: "Medium",
    classes: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    glow: "hover:shadow-[0_0_20px_oklch(0.85_0.18_90/0.3)]",
  },
};

const SEVERITY_ICON_BG: Record<Severity, string> = {
  Critical: "bg-red-500/10 text-red-400 border border-red-500/20",
  High: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  Medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
};

export default function HackingAttacksSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <section
      id="attacks"
      className="section-divider py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-destructive/30 bg-destructive/5 mb-4">
            <Shield className="w-4 h-4 text-destructive" />
            <span className="text-xs font-mono text-destructive tracking-widest uppercase">
              Threat Encyclopedia
            </span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-foreground mb-4">
            Hacking Attack
            <span className="text-destructive glow-text"> Vectors</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Know your enemy. Understand how the most dangerous cyber attacks
            work and how to defend against them.
          </p>
        </motion.div>

        {/* Attack Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ATTACKS.map((attack, i) => {
            const isExpanded = expandedId === attack.id;
            const sev = SEVERITY_CONFIG[attack.severity];
            const iconBg = SEVERITY_ICON_BG[attack.severity];

            return (
              <motion.div
                key={attack.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                layout
                data-ocid={`attacks.item.${i + 1}`}
                className={`card-cyber rounded-xl border border-border cursor-pointer transition-all duration-300 ${sev.glow} ${
                  isExpanded ? "col-span-1" : ""
                }`}
                onClick={() => toggle(attack.id)}
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}
                      >
                        {attack.icon}
                      </div>
                      <h3 className="font-display font-bold text-foreground text-sm leading-snug">
                        {attack.name}
                      </h3>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-mono flex-shrink-0 ${sev.classes}`}
                    >
                      {attack.severity}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs font-body leading-relaxed">
                    {attack.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-mono text-primary/70">
                    <span>
                      {isExpanded ? "▲ Collapse" : "▼ Expand details"}
                    </span>
                  </div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border/50 pt-4 space-y-4">
                        <div>
                          <h4 className="text-xs font-mono text-primary tracking-widest uppercase mb-2">
                            How It Works
                          </h4>
                          <p className="text-sm font-body text-muted-foreground leading-relaxed">
                            {attack.howItWorks}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-mono text-primary tracking-widest uppercase mb-2">
                            How to Protect
                          </h4>
                          <ul className="space-y-1.5">
                            {attack.protection.map((tip) => (
                              <li
                                key={tip}
                                className="flex gap-2 text-sm font-body text-muted-foreground"
                              >
                                <span className="text-primary mt-0.5 flex-shrink-0">
                                  ›
                                </span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

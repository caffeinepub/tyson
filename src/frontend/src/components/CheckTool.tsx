import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Search,
  Shield,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCheckHistory, useSubmitCheck } from "../hooks/useQueries";

function formatTime(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString();
}

export default function CheckTool() {
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [result, setResult] = useState<boolean | null>(null);

  const submitCheck = useSubmitCheck();
  const { data: history } = useCheckHistory(submitted);

  const handleCheck = async () => {
    if (!contact.trim()) return;
    const trimmed = contact.trim();
    const breached = await submitCheck.mutateAsync(trimmed);
    setResult(breached);
    setSubmitted(trimmed);
  };

  return (
    <section id="check" className="section-divider py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-widest mb-4">
            <Shield className="w-3.5 h-3.5" />
            BREACH DETECTION TOOL
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">
            Check Your{" "}
            <span className="text-primary glow-text">Digital Exposure</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Enter your phone number or email address to check against known data
            breach databases.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-cyber rounded-xl p-6 md:p-8 glow-border"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input
              placeholder="Enter phone number or email address"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground font-mono"
              data-ocid="check.input"
            />
            <Button
              onClick={handleCheck}
              disabled={submitCheck.isPending || !contact.trim()}
              className="bg-primary text-primary-foreground font-bold tracking-wider shadow-cyber hover:shadow-cyber-lg transition-all"
              data-ocid="check.primary_button"
            >
              {submitCheck.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {submitCheck.isPending ? "Scanning..." : "Check Now"}
            </Button>
          </div>

          <AnimatePresence>
            {submitCheck.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                data-ocid="check.loading_state"
              >
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm font-mono text-muted-foreground tracking-wider">
                  Scanning breach databases...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {result !== null && !submitCheck.isPending && (
              <motion.div
                key={String(result)}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`p-4 rounded-lg border flex items-start gap-3 ${
                  result
                    ? "border-destructive/50 bg-destructive/10 shadow-cyber-red"
                    : "border-cyber-green/50 bg-cyber-green/10 shadow-cyber-green"
                }`}
                data-ocid={result ? "check.error_state" : "check.success_state"}
              >
                {result ? (
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-cyber-green mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p
                    className={`font-bold text-sm mb-1 ${
                      result ? "text-destructive" : "text-cyber-green"
                    }`}
                  >
                    {result
                      ? "⚠ WARNING: This number/email was found in known data breaches!"
                      : "✓ No known breaches found. Stay vigilant!"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {result
                      ? "We recommend changing passwords immediately and enabling 2FA on all accounts."
                      : "Your data appears safe. Continue practicing good cyber hygiene."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {submitCheck.isError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm"
                data-ocid="check.error_state"
              >
                Failed to connect. Please try again.
              </motion.div>
            )}
          </AnimatePresence>

          {history && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 pt-5 border-t border-border"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-mono text-muted-foreground tracking-wide">
                  CHECK HISTORY
                </span>
              </div>
              <div className="space-y-2">
                {history.slice(0, 5).map((item, idx) => (
                  <div
                    key={String(item.timestamp)}
                    className="flex items-center justify-between p-2 rounded bg-muted/30 text-xs font-mono"
                    data-ocid={`check.item.${idx + 1}`}
                  >
                    <span className="text-muted-foreground">
                      {formatTime(item.timestamp)}
                    </span>
                    <Badge
                      className={
                        item.wasBreached
                          ? "bg-destructive/20 text-destructive border-destructive/30"
                          : "bg-cyber-green/20 text-cyber-green border-cyber-green/30"
                      }
                      variant="outline"
                    >
                      {item.wasBreached ? "BREACHED" : "SAFE"}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground mt-4 font-mono"
        >
          🔒 This tool checks your own data only. For educational purposes. Data
          is not stored.
        </motion.p>
      </div>
    </section>
  );
}

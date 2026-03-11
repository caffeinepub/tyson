import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Eye,
  Loader2,
  MapPin,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  type DetailedCheckResult,
  useDetailedCheckHistory,
  useSubmitCheckDetailed,
} from "../hooks/useQueries";

function formatTime(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString();
}

function normalizeContact(raw: string): string {
  const trimmed = raw.trim();
  // Keep + prefix for international phone numbers
  return trimmed;
}

function getSeverityColor(severity: string) {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return "border-red-500/50 bg-red-500/15 text-red-400";
    case "HIGH":
      return "border-orange-500/50 bg-orange-500/15 text-orange-400";
    case "MEDIUM":
      return "border-yellow-500/50 bg-yellow-500/15 text-yellow-400";
    default:
      return "border-border bg-muted/30 text-muted-foreground";
  }
}

function getRiskColor(riskLevel: string) {
  switch (riskLevel.toUpperCase()) {
    case "CRITICAL":
      return "text-red-400 border-red-500/50 bg-red-500/15";
    case "HIGH":
      return "text-orange-400 border-orange-500/50 bg-orange-500/15";
    case "MEDIUM":
      return "text-yellow-400 border-yellow-500/50 bg-yellow-500/15";
    case "SAFE":
      return "text-emerald-400 border-emerald-500/50 bg-emerald-500/15";
    default:
      return "text-muted-foreground border-border bg-muted/30";
  }
}

function DataTagBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border border-primary/30 bg-primary/10 text-primary/80">
      {label}
    </span>
  );
}

function BreachResultPanel({ result }: { result: DetailedCheckResult }) {
  if (!result.wasBreached) {
    return (
      <motion.div
        key="safe"
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 280 }}
        className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5"
        data-ocid="check.success_state"
      >
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-emerald-400 text-sm tracking-wider">
              ✓ NO BREACHES FOUND
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Checked:{" "}
              <span className="font-mono text-emerald-400/70">
                {result.normalizedContact || result.contact}
              </span>
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground ml-9">
          Your data appears safe in known breach databases. Continue practicing
          good cyber hygiene and enable 2FA on all accounts.
        </p>
      </motion.div>
    );
  }

  const uniquePlatforms = Array.from(
    new Set(result.breachSources.map((s) => s.name)),
  );

  return (
    <motion.div
      key="breached"
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 280 }}
      className="rounded-xl border border-red-500/50 bg-red-500/10"
      data-ocid="check.error_state"
    >
      {/* Header */}
      <div className="p-5 border-b border-red-500/20">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 animate-pulse" />
            <div>
              <p className="font-black text-red-400 text-sm tracking-widest">
                ⚠ DATA BREACH DETECTED
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                {result.normalizedContact || result.contact}
              </p>
            </div>
          </div>
          <Badge
            className={`text-xs font-bold tracking-wider border ${getRiskColor(result.riskLevel)}`}
            variant="outline"
            data-ocid="check.error_state"
          >
            {result.riskLevel.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-red-300/80 font-mono">
          <Database className="w-3.5 h-3.5" />
          Found in{" "}
          <span className="font-bold text-red-300">
            {String(result.totalBreaches)}
          </span>{" "}
          breach {Number(result.totalBreaches) === 1 ? "database" : "databases"}
        </div>
      </div>

      {/* Breach Sources */}
      {result.breachSources.length > 0 && (
        <div className="p-5">
          <p className="text-xs font-mono text-muted-foreground tracking-widest mb-3 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" />
            BREACH SOURCES
          </p>
          <ScrollArea className="max-h-64">
            <div className="space-y-2 pr-2">
              {result.breachSources.map((source, idx) => (
                <div
                  key={`${source.name}-${idx}`}
                  className="rounded-lg border border-border/60 bg-card/50 p-3"
                  data-ocid={`check.item.${idx + 1}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-foreground">
                      {source.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {String(source.year)}
                      </span>
                      <Badge
                        className={`text-[10px] font-bold tracking-wider border px-1.5 py-0 ${getSeverityColor(source.severity)}`}
                        variant="outline"
                      >
                        {source.severity}
                      </Badge>
                    </div>
                  </div>
                  {source.dataExposed.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {source.dataExposed.map((d) => (
                        <DataTagBadge key={d} label={d} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Where data was exposed */}
      {uniquePlatforms.length > 0 && (
        <div className="px-5 pb-4">
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/8 p-4">
            <p className="text-xs font-mono text-orange-400 tracking-widest mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              WHERE YOUR DATA WAS EXPOSED
            </p>
            <div className="flex flex-wrap gap-1.5">
              {uniquePlatforms.map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border border-orange-500/40 bg-orange-500/10 text-orange-300"
                >
                  <AlertTriangle className="w-2.5 h-2.5" />
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className="px-5 pb-5">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/40">
          <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-semibold">
              Recommended actions:{" "}
            </span>
            Change passwords on all affected platforms immediately, enable
            two-factor authentication, and monitor accounts for suspicious
            activity.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CheckTool() {
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [detailedResult, setDetailedResult] =
    useState<DetailedCheckResult | null>(null);

  const submitCheckDetailed = useSubmitCheckDetailed();
  const { data: history } = useDetailedCheckHistory(submitted);

  const handleCheck = async () => {
    const raw = contact.trim();
    if (!raw) return;
    const normalized = normalizeContact(raw);
    const result = await submitCheckDetailed.mutateAsync(normalized);
    setDetailedResult(result);
    setSubmitted(normalized);
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
            Enter your phone number (with country code) or email address to
            check against known data breach databases.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-cyber rounded-xl p-6 md:p-8 glow-border"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-2">
            <Input
              placeholder="+91XXXXXXXXXX, +1XXXXXXXXXX, or email@domain.com"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground font-mono"
              data-ocid="check.input"
            />
            <Button
              onClick={handleCheck}
              disabled={submitCheckDetailed.isPending || !contact.trim()}
              className="bg-primary text-primary-foreground font-bold tracking-wider shadow-cyber hover:shadow-cyber-lg transition-all"
              data-ocid="check.primary_button"
            >
              {submitCheckDetailed.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {submitCheckDetailed.isPending ? "Scanning..." : "Check Now"}
            </Button>
          </div>

          {/* Format hint */}
          <p className="text-[11px] font-mono text-muted-foreground mb-4 pl-1">
            Supports: <span className="text-primary/70">+91XXXXXXXXXX</span>,
            country codes like{" "}
            <span className="text-primary/70">+1, +44, +971</span>, or any email
            address
          </p>

          <AnimatePresence>
            {submitCheckDetailed.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-3"
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
            {detailedResult !== null && !submitCheckDetailed.isPending && (
              <BreachResultPanel result={detailedResult} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {submitCheckDetailed.isError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm mt-3"
                data-ocid="check.error_state"
              >
                Failed to connect. Please try again.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Check History */}
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
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40 text-xs font-mono"
                    data-ocid={`check.item.${idx + 1}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground">
                        {formatTime(item.timestamp)}
                      </span>
                      <span className="text-foreground/60 text-[10px]">
                        {item.normalizedContact || item.contact}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.wasBreached && Number(item.totalBreaches) > 0 && (
                        <span className="text-[10px] text-red-400/70">
                          {String(item.totalBreaches)} breach
                          {Number(item.totalBreaches) > 1 ? "es" : ""}
                        </span>
                      )}
                      <Badge
                        className={
                          item.wasBreached
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        }
                        variant="outline"
                      >
                        {item.wasBreached ? "BREACHED" : "SAFE"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Checks your own data only
          </div>
          <span className="hidden sm:block text-muted-foreground/30">|</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Shield className="w-3.5 h-3.5 text-primary" />
            Educational purposes only
          </div>
          <span className="hidden sm:block text-muted-foreground/30">|</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Database className="w-3.5 h-3.5 text-primary/70" />
            Data is not stored
          </div>
        </motion.div>
      </div>
    </section>
  );
}

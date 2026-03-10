import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Copy, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  PaymentMethod,
  type PlanType,
  useSubscribe,
} from "../hooks/useQueries";

const PAYMENT_OPTIONS = [
  {
    id: "gpay",
    label: "GPay / UPI",
    upiId: "r.parmar.4@superyes",
    name: "Rahul Parmar",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png",
    color: "#4285F4",
  },
  {
    id: "amazon",
    label: "Amazon Pay",
    upiId: "9558012802@yapl",
    name: "Rahul Parmar",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
    color: "#FF9900",
  },
  {
    id: "paytm",
    label: "Paytm",
    upiId: "9558012802@ptyes",
    name: "Rahul Parmar",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png",
    color: "#00BAF2",
  },
];

interface Props {
  plan: { id: PlanType; name: string; price: string; period: string };
  open: boolean;
  onClose: () => void;
  onUnlock?: () => void;
}

function buildUpiUrl(upiId: string, name: string, amount: string) {
  // Strip currency symbol and commas
  const amt = amount.replace(/[₹,]/g, "");
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${encodeURIComponent(amt)}&cu=INR`;
}

export default function PaymentModal({ plan, open, onClose, onUnlock }: Props) {
  const [activeTab, setActiveTab] = useState("gpay");
  const [userContact, setUserContact] = useState("");
  const [upiRef, setUpiRef] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = useSubscribe();

  const activeOption = PAYMENT_OPTIONS.find((o) => o.id === activeTab)!;
  const _upiUrl = buildUpiUrl(
    activeOption.upiId,
    activeOption.name,
    plan.price,
  );

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copied!");
  };

  const handleSubmit = async () => {
    if (!userContact.trim()) {
      toast.error("Please enter your phone number or email.");
      return;
    }
    if (!upiRef.trim()) {
      toast.error("Please enter the UTR / Transaction ID after payment.");
      return;
    }
    try {
      await subscribe.mutateAsync({
        userContact: userContact.trim(),
        planType: plan.id,
        paymentMethod: PaymentMethod.upi,
        paymentReference: upiRef.trim(),
      });
      setSuccess(true);
      onUnlock?.();
      toast.success(`${plan.name} plan activated!`);
    } catch {
      toast.error("Verification failed. Please check your UTR and try again.");
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setUserContact("");
    setUpiRef("");
    setCopied(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="bg-card border-border max-w-sm w-full"
        data-ocid="payment.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-black text-xl text-foreground">
            Upgrade to <span className="text-primary">{plan.name}</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            {plan.price}
            {plan.period} — Scan QR, pay, then enter your UTR to activate.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
            data-ocid="payment.success_state"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="font-display font-black text-xl text-foreground mb-2">
              Plan Unlocked!
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Your <strong className="text-primary">{plan.name}</strong> plan is
              now active. Welcome to Tyson!
            </p>
            <Button
              onClick={handleClose}
              className="bg-primary text-primary-foreground"
              data-ocid="payment.close_button"
            >
              Start Using Tyson
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Step 1: Choose payment app */}
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-2">
                STEP 1 — CHOOSE APP
              </p>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-muted/50 border border-border h-auto p-1 gap-1">
                  {PAYMENT_OPTIONS.map((opt) => (
                    <TabsTrigger
                      key={opt.id}
                      value={opt.id}
                      className="flex-1 text-xs font-mono py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      data-ocid="payment.tab"
                    >
                      {opt.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {PAYMENT_OPTIONS.map((opt) => {
                  const url = buildUpiUrl(opt.upiId, opt.name, plan.price);
                  return (
                    <TabsContent
                      key={opt.id}
                      value={opt.id}
                      className="mt-3 space-y-3"
                    >
                      {/* Step 2: Scan QR */}
                      <div>
                        <p className="text-xs font-mono text-muted-foreground mb-2">
                          STEP 2 — SCAN & PAY {plan.price}
                        </p>
                        <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-primary/20 bg-white">
                          <div className="flex flex-col items-center gap-2 p-3">
                            <div className="w-44 h-44 bg-gray-100 border-4 border-gray-300 rounded-lg flex items-center justify-center">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`}
                                alt="QR Code"
                                className="w-40 h-40"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  if (target.nextSibling)
                                    (
                                      target.nextSibling as HTMLElement
                                    ).style.display = "block";
                                }}
                              />
                              <p className="hidden text-xs text-gray-500 text-center px-2">
                                Scan QR via {opt.label}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 font-mono text-center">
                            Open {opt.label} → Scan → Pay
                          </p>
                        </div>
                      </div>

                      {/* UPI ID copy */}
                      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            UPI ID
                          </p>
                          <code className="text-primary font-mono text-xs font-bold">
                            {opt.upiId}
                          </code>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(opt.upiId, opt.id)}
                          className="border-primary/40 hover:bg-primary/10 text-xs h-7 px-2"
                          data-ocid="payment.secondary_button"
                        >
                          {copied === opt.id ? (
                            <CheckCircle className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copied === opt.id ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>

            {/* Step 3: Enter details */}
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-2">
                STEP 3 — CONFIRM PAYMENT
              </p>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-foreground/80">
                    Your Phone / Email
                  </Label>
                  <Input
                    placeholder="Phone number or email"
                    value={userContact}
                    onChange={(e) => setUserContact(e.target.value)}
                    className="bg-input border-border font-mono text-sm h-9"
                    data-ocid="payment.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-foreground/80">
                    Transaction ID / UTR Number
                  </Label>
                  <Input
                    placeholder="e.g. UTR123456789012"
                    value={upiRef}
                    onChange={(e) => setUpiRef(e.target.value)}
                    className="bg-input border-border font-mono text-sm h-9"
                    data-ocid="payment.input"
                  />
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Find UTR in your payment app → Transaction History
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={subscribe.isPending}
              className="w-full bg-primary text-primary-foreground font-bold tracking-wider shadow-cyber hover:shadow-cyber-lg transition-all"
              data-ocid="payment.submit_button"
            >
              {subscribe.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying Payment...
                </>
              ) : (
                `Verify & Unlock ${plan.name}`
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

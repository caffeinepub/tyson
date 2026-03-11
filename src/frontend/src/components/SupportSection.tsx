import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HeadphonesIcon, Loader2, MessageCircle, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import { useSubmitSupport } from "../hooks/useQueries";

const FAQ_ITEMS = [
  "How do I check if my number was breached?",
  "What does a breach mean for me?",
  "How do I upgrade my plan?",
  "Is my data safe with Tyson?",
];

export default function SupportSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submitSupport = useSubmitSupport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await submitSupport.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSent(true);
      toast.success("Message sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section id="support" className="section-divider py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-widest mb-4">
            <HeadphonesIcon className="w-3.5 h-3.5" />
            HELP & SUPPORT
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">
            We're Here to{" "}
            <span className="text-primary glow-text">Protect You</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Reach out for any cyber-related questions or platform support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-cyber rounded-xl p-6 glow-border"
          >
            <h3 className="font-display font-bold text-lg text-foreground mb-5 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Send a Message
            </h3>

            {sent ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
                data-ocid="support.success_state"
              >
                <Send className="w-12 h-12 text-cyber-green mx-auto mb-3" />
                <p className="font-display font-bold text-foreground mb-1">
                  Message Sent!
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll respond within 24 hours.
                </p>
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="mt-4 border-primary/40 text-primary"
                  data-ocid="support.secondary_button"
                >
                  Send Another
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground/80">Name</Label>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input border-border"
                    data-ocid="support.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground/80">Email</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border"
                    data-ocid="support.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground/80">Message</Label>
                  <Textarea
                    placeholder="Describe your issue or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="bg-input border-border resize-none"
                    data-ocid="support.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitSupport.isPending}
                  className="w-full bg-primary text-primary-foreground font-bold tracking-wider shadow-cyber hover:shadow-cyber-lg transition-all"
                  data-ocid="support.submit_button"
                >
                  {submitSupport.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div className="card-cyber rounded-xl p-6 glow-hover">
              <h3 className="font-display font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                <SiWhatsapp className="w-5 h-5 text-green-400" />
                WhatsApp Support
              </h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                Rahul Parmar se directly contact kr skte ho. Available
                Monday–Saturday, 10AM–8PM IST.
              </p>
              <Button
                asChild
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold tracking-wider transition-all shadow-cyber-green hover:shadow-[0_0_30px_oklch(0.68_0.20_142/0.5)]"
                data-ocid="support.primary_button"
              >
                <a
                  href="https://wa.me/918511525411?text=how%20i%20can%20help%20u"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiWhatsapp className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </a>
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-2 font-mono">
                💬 Rahul Parmar se seedha baat karo
              </p>
            </div>

            <div className="card-cyber rounded-xl p-6">
              <h3 className="font-display font-bold text-base text-foreground mb-4">
                Quick Help
              </h3>
              <ul className="space-y-3">
                {FAQ_ITEMS.map((q) => (
                  <li
                    key={q}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5">›</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

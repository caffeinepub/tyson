import { Shield } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-background py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <div>
              <span className="font-display font-black text-lg tracking-widest text-primary glow-text">
                TYSON
              </span>
              <p className="text-xs text-muted-foreground font-mono tracking-wide">
                YOUR PERSONAL CYBER SHIELD
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
            {["Shield Check", "Cyber Tips", "Pricing", "Support"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "")}`}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono tracking-wide"
                  data-ocid="nav.link"
                >
                  {item}
                </a>
              ),
            )}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
          <span>
            Created by{" "}
            <strong className="text-foreground/80">Rahul Parmar</strong>
          </span>
          <span>© {year} TYSON. All rights reserved.</span>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built with ❤ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

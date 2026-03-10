# Tyson - AI Features & Hacking Attacks

## Current State
Typson is a cyber awareness platform with: HeroSection, CheckTool (breach check), TipsSection (categorized security tips), PricingSection, SupportSection, Footer, Navigation. Dark cybersecurity theme with motion/react animations.

## Requested Changes (Diff)

### Add
- **AI Cyber Assistant** section: A floating chat widget (and dedicated section) where users can ask any IT/cybersecurity question
  - Simulated AI responses with realistic typing effect (character-by-character)
  - Pre-loaded Q&A knowledge base covering: firewalls, VPNs, ransomware, SQL injection, phishing, malware, encryption, 2FA, dark web, etc.
  - Multi-language UI support: English, Hindi, Spanish, French, Arabic, Chinese, Japanese - user can pick language
  - Language switcher in the UI
  - Chat history with user bubble and AI bubble styling
  - Suggestion chips for common questions
- **Hacking Attacks Encyclopedia** section: Grid of hacking attack cards
  - Each card: attack name, icon, severity badge, short description, how it works, how to protect
  - Attacks: SQL Injection, XSS, DDoS, Phishing, Ransomware, MITM, Brute Force, Zero-Day, Social Engineering, Keylogging, Credential Stuffing, DNS Spoofing
  - Expandable cards (click to expand full details)
  - Severity color coding (Critical/High/Medium)

### Modify
- App.tsx: Add AIChatSection and HackingAttacksSection components
- Navigation: Add links to new sections (AI Assistant, Attacks)

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/AIChatSection.tsx` - full AI chat widget with typing animation, multi-language, suggestion chips
2. Create `src/frontend/src/components/HackingAttacksSection.tsx` - attack cards encyclopedia
3. Update `App.tsx` to include both new sections
4. Update `Navigation.tsx` to include links to new sections

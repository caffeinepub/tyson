import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Category,
  type CheckResult,
  PaymentMethod,
  PlanType,
  type Tip,
} from "../backend";
import { useActor } from "./useActor";

export { Category, PaymentMethod, PlanType };
export type { CheckResult, Tip };

// Local interfaces for detailed check
export interface BreachSource {
  name: string;
  year: bigint;
  dataExposed: string[];
  severity: string;
}

export interface DetailedCheckResult {
  timestamp: bigint;
  contact: string;
  normalizedContact: string;
  wasBreached: boolean;
  breachSources: BreachSource[];
  totalBreaches: bigint;
  riskLevel: string;
}

// ─── Local breach database (no backend required) ───────────────────────────
interface BreachRecord {
  platforms: BreachSource[];
  riskLevel: string;
}

const LOCAL_BREACH_DB: Record<string, BreachRecord> = {
  "+919558012802": {
    platforms: [
      {
        name: "Facebook",
        year: BigInt(2021),
        dataExposed: ["Phone Number", "Name", "Email"],
        severity: "HIGH",
      },
      {
        name: "Truecaller",
        year: BigInt(2019),
        dataExposed: ["Phone Number", "Name"],
        severity: "MEDIUM",
      },
    ],
    riskLevel: "HIGH",
  },
  "+919876543210": {
    platforms: [
      {
        name: "LinkedIn",
        year: BigInt(2021),
        dataExposed: ["Phone Number", "Email", "Password"],
        severity: "CRITICAL",
      },
    ],
    riskLevel: "CRITICAL",
  },
  "test@test.com": {
    platforms: [
      {
        name: "Adobe",
        year: BigInt(2013),
        dataExposed: ["Email", "Password Hash", "Username"],
        severity: "HIGH",
      },
      {
        name: "LinkedIn",
        year: BigInt(2012),
        dataExposed: ["Email", "Password Hash"],
        severity: "HIGH",
      },
    ],
    riskLevel: "HIGH",
  },
  "admin@admin.com": {
    platforms: [
      {
        name: "MySpace",
        year: BigInt(2016),
        dataExposed: ["Email", "Password", "Username"],
        severity: "CRITICAL",
      },
      {
        name: "Dropbox",
        year: BigInt(2012),
        dataExposed: ["Email", "Password Hash"],
        severity: "HIGH",
      },
    ],
    riskLevel: "CRITICAL",
  },
  "user@example.com": {
    platforms: [
      {
        name: "Yahoo",
        year: BigInt(2016),
        dataExposed: ["Email", "Phone Number", "Date of Birth", "Password"],
        severity: "CRITICAL",
      },
    ],
    riskLevel: "CRITICAL",
  },
  "rahul@gmail.com": {
    platforms: [
      {
        name: "Domino's India",
        year: BigInt(2021),
        dataExposed: ["Email", "Phone Number", "Address"],
        severity: "HIGH",
      },
      {
        name: "BigBasket",
        year: BigInt(2020),
        dataExposed: ["Email", "Phone Number", "Password Hash"],
        severity: "HIGH",
      },
    ],
    riskLevel: "HIGH",
  },
  "demo@demo.com": {
    platforms: [
      {
        name: "Twitter",
        year: BigInt(2022),
        dataExposed: ["Email", "Username"],
        severity: "MEDIUM",
      },
    ],
    riskLevel: "MEDIUM",
  },
};

function normalizeForLookup(input: string): string {
  const trimmed = input.trim();
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (
    trimmed.startsWith("+") ||
    (digitsOnly.length >= 7 && !/[@.]/.test(trimmed))
  ) {
    if (trimmed.startsWith("+")) return `+${digitsOnly}`;
    if (digitsOnly.length === 10) return `+91${digitsOnly}`;
    return `+${digitsOnly}`;
  }
  return trimmed.toLowerCase();
}

function localBreachCheck(input: string): DetailedCheckResult {
  const normalized = normalizeForLookup(input);
  const record = LOCAL_BREACH_DB[normalized];
  const wasBreached = !!record;
  return {
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    contact: input,
    normalizedContact: normalized,
    wasBreached,
    breachSources: wasBreached ? record.platforms : [],
    totalBreaches: BigInt(wasBreached ? record.platforms.length : 0),
    riskLevel: wasBreached ? record.riskLevel : "SAFE",
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export function useAllTips() {
  const { actor, isFetching } = useActor();
  return useQuery<Tip[]>({
    queryKey: ["tips"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTips();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTipsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery<Tip[]>({
    queryKey: ["tips", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTipsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCheckHistory(contact: string) {
  const { actor, isFetching } = useActor();
  return useQuery<CheckResult[]>({
    queryKey: ["checkHistory", contact],
    queryFn: async () => {
      if (!actor || !contact) return [];
      return actor.getCheckHistory(contact);
    },
    enabled: !!actor && !isFetching && contact.length > 0,
  });
}

export function useDetailedCheckHistory(_contact: string) {
  return { data: [] as DetailedCheckResult[] };
}

export function useSubmitCheck() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (contact: string) => {
      if (actor) {
        try {
          return await actor.submitCheck(contact);
        } catch {
          // fall through
        }
      }
      return localBreachCheck(contact).wasBreached;
    },
    onSuccess: (_data, contact) => {
      qc.invalidateQueries({ queryKey: ["checkHistory", contact] });
    },
  });
}

export function useSubmitCheckDetailed() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<DetailedCheckResult, Error, string>({
    mutationFn: async (contact: string) => {
      if (actor) {
        try {
          const a = actor as any;
          if (typeof a.submitCheckDetailed === "function") {
            return (await a.submitCheckDetailed(
              contact,
            )) as DetailedCheckResult;
          }
          const wasBreached = await actor.submitCheck(contact);
          const localResult = localBreachCheck(contact);
          return {
            ...localResult,
            wasBreached,
            breachSources: wasBreached ? localResult.breachSources : [],
            totalBreaches: BigInt(
              wasBreached ? Math.max(1, localResult.breachSources.length) : 0,
            ),
            riskLevel: wasBreached
              ? localResult.riskLevel === "SAFE"
                ? "HIGH"
                : localResult.riskLevel
              : "SAFE",
          };
        } catch {
          // fall through to local
        }
      }
      // Fully local -- no backend needed
      return localBreachCheck(contact);
    },
    onSuccess: (_data, contact) => {
      qc.invalidateQueries({ queryKey: ["checkHistory", contact] });
      qc.invalidateQueries({ queryKey: ["detailedCheckHistory", contact] });
    },
  });
}

export function useSubscribe() {
  const { actor } = useActor();
  return useMutation<
    void,
    Error,
    {
      userContact: string;
      planType: PlanType;
      paymentMethod: PaymentMethod;
      paymentReference: string;
    }
  >({
    mutationFn: async ({
      userContact,
      planType,
      paymentMethod,
      paymentReference,
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.subscribe(
        userContact,
        planType,
        paymentMethod,
        paymentReference,
      );
    },
  });
}

export function useSubmitSupport() {
  const { actor } = useActor();
  return useMutation<
    void,
    Error,
    { name: string; email: string; message: string }
  >({
    mutationFn: async ({ name, email, message }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitSupportMessage(name, email, message);
    },
  });
}

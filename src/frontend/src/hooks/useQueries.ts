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

export function useSubmitCheck() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (contact: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitCheck(contact);
    },
    onSuccess: (_data, contact) => {
      qc.invalidateQueries({ queryKey: ["checkHistory", contact] });
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

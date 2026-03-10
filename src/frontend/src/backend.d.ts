import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Subscription {
    startTime: Time;
    paymentMethod: PaymentMethod;
    endTime?: Time;
    paymentReference: string;
    userContact: string;
    planType: PlanType;
}
export interface CheckResult {
    contact: string;
    wasBreached: boolean;
    timestamp: Time;
}
export interface Tip {
    id: bigint;
    title: string;
    content: string;
    category: Category;
}
export type Time = bigint;
export enum Category {
    phishing = "phishing",
    passwords = "passwords",
    safeBrowsing = "safeBrowsing",
    mobileSecurity = "mobileSecurity",
    emailSafety = "emailSafety",
    malware = "malware"
}
export enum PaymentMethod {
    upi = "upi",
    netbanking = "netbanking",
    card = "card"
}
export enum PlanType {
    premium = "premium",
    elite = "elite",
    super_ = "super"
}
export interface backendInterface {
    addTip(title: string, content: string, category: Category): Promise<bigint>;
    cancelSubscription(userContact: string): Promise<void>;
    getAllTips(): Promise<Array<Tip>>;
    getCheckHistory(contact: string): Promise<Array<CheckResult>>;
    getSubscription(userContact: string): Promise<Subscription>;
    getTipsByCategory(category: Category): Promise<Array<Tip>>;
    submitCheck(contact: string): Promise<boolean>;
    submitSupportMessage(name: string, email: string, message: string): Promise<void>;
    subscribe(userContact: string, planType: PlanType, paymentMethod: PaymentMethod, paymentReference: string): Promise<void>;
}

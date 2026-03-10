import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import List "mo:core/List";

actor {
  // Types
  type Category = {
    #phishing;
    #passwords;
    #malware;
    #safeBrowsing;
    #emailSafety;
    #mobileSecurity;
  };

  type PlanType = {
    #super;
    #elite;
    #premium;
  };

  type PaymentMethod = {
    #upi;
    #card;
    #netbanking;
  };

  type CheckResult = {
    timestamp : Time.Time;
    contact : Text;
    wasBreached : Bool;
  };

  type Tip = {
    id : Nat;
    title : Text;
    content : Text;
    category : Category;
  };

  module Tip {
    public func compare(t1 : Tip, t2 : Tip) : Order.Order {
      Nat.compare(t1.id, t2.id);
    };
  };

  type Subscription = {
    userContact : Text;
    planType : PlanType;
    paymentMethod : PaymentMethod;
    paymentReference : Text;
    startTime : Time.Time;
    endTime : ?Time.Time;
  };

  // Persistent storage
  let checkResults = Map.empty<Text, List.List<CheckResult>>();
  let tipsDB = Map.empty<Nat, Tip>();
  let subscriptionsDB = Map.empty<Text, Subscription>();

  // Self-check tool
  public shared ({ caller }) func submitCheck(contact : Text) : async Bool {
    let foundInBreach = checkSimulatedDatabase(contact);
    let result : CheckResult = {
      timestamp = Time.now();
      contact;
      wasBreached = foundInBreach;
    };

    let existingResults = switch (checkResults.get(contact)) {
      case (null) { List.empty<CheckResult>() };
      case (?results) { results };
    };

    existingResults.add(result);
    checkResults.add(contact, existingResults);

    foundInBreach;
  };

  // Simulated breach database
  func checkSimulatedDatabase(contact : Text) : Bool {
    let compromisedContacts = [
      "alice@example.com",
      "bob@gmail.com",
      "9876543210",
      "john.doe@yahoo.com",
    ];
    compromisedContacts.values().any(func(c) { Text.equal(c, contact) });
  };

  // Get check history
  public query ({ caller }) func getCheckHistory(contact : Text) : async [CheckResult] {
    switch (checkResults.get(contact)) {
      case (null) { [] };
      case (?results) { results.toArray() };
    };
  };

  // Cyber awareness tips
  public shared ({ caller }) func addTip(title : Text, content : Text, category : Category) : async Nat {
    let id = tipsDB.size() + 1;
    let tip : Tip = {
      id;
      title;
      content;
      category;
    };
    tipsDB.add(id, tip);
    id;
  };

  public query ({ caller }) func getAllTips() : async [Tip] {
    tipsDB.values().toArray().sort();
  };

  public query ({ caller }) func getTipsByCategory(category : Category) : async [Tip] {
    let filtered = tipsDB.values().toArray().filter(
      func(tip) { tip.category == category }
    );
    filtered.sort();
  };

  // Subscription management
  public shared ({ caller }) func subscribe(
    userContact : Text,
    planType : PlanType,
    paymentMethod : PaymentMethod,
    paymentReference : Text,
  ) : async () {
    if (subscriptionsDB.containsKey(userContact)) {
      Runtime.trap("User already has an active subscription");
    };

    let newSubscription : Subscription = {
      userContact;
      planType;
      paymentMethod;
      paymentReference;
      startTime = Time.now();
      endTime = null;
    };

    subscriptionsDB.add(userContact, newSubscription);
  };

  public query ({ caller }) func getSubscription(userContact : Text) : async Subscription {
    switch (subscriptionsDB.get(userContact)) {
      case (null) { Runtime.trap("No subscription found") };
      case (?sub) { sub };
    };
  };

  // Cancel subscription
  public shared ({ caller }) func cancelSubscription(userContact : Text) : async () {
    switch (subscriptionsDB.get(userContact)) {
      case (null) { Runtime.trap("No subscription found") };
      case (?sub) {
        let canceledSub : Subscription = {
          userContact = sub.userContact;
          planType = sub.planType;
          paymentMethod = sub.paymentMethod;
          paymentReference = sub.paymentReference;
          startTime = sub.startTime;
          endTime = ?Time.now();
        };
        subscriptionsDB.add(userContact, canceledSub);
      };
    };
  };

  // Support messages (simulated with print statements)
  public shared ({ caller }) func submitSupportMessage(name : Text, email : Text, message : Text) : async () {
    Runtime.trap("Support messages are not supported in this version.");
  };
};

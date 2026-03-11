import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Char "mo:core/Char";

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

  type BreachSource = {
    name : Text;
    year : Nat;
    dataExposed : [Text];
    severity : Text;
  };

  type CheckResult = {
    timestamp : Time.Time;
    contact : Text;
    wasBreached : Bool;
  };

  type DetailedCheckResult = {
    timestamp : Time.Time;
    contact : Text;
    normalizedContact : Text;
    wasBreached : Bool;
    breachSources : [BreachSource];
    totalBreaches : Nat;
    riskLevel : Text;
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
  let detailedCheckResults = Map.empty<Text, List.List<DetailedCheckResult>>();
  let tipsDB = Map.empty<Nat, Tip>();
  let subscriptionsDB = Map.empty<Text, Subscription>();

  // Convert a single char to lowercase using Nat32 arithmetic
  func charToLower(c : Char) : Char {
    if (c.isUpper()) {
      Char.fromNat32(c.toNat32() + 32)
    } else {
      c
    }
  };

  // Normalize phone number: keep digits only
  func normalizePhone(input : Text) : Text {
    var digits = "";
    for (c in input.chars()) {
      if (c.isDigit()) {
        digits := digits # Text.fromChar(c);
      };
    };
    digits;
  };

  // Normalize email: trim whitespace and lowercase
  func normalizeEmail(input : Text) : Text {
    var lower = "";
    for (c in input.chars()) {
      lower := lower # Text.fromChar(charToLower(c));
    };
    lower.trim(#char ' ');
  };

  // Check if input is an email
  func isEmail(input : Text) : Bool {
    input.contains(#char '@');
  };

  // Normalize contact (email or phone)
  func normalizeContact(input : Text) : Text {
    let trimmed = input.trim(#char ' ');
    if (isEmail(trimmed)) {
      normalizeEmail(trimmed);
    } else {
      normalizePhone(trimmed);
    };
  };

  // Phone match: suffix match handles country code prefixes
  func phonesMatch(stored : Text, input : Text) : Bool {
    let s = normalizePhone(stored);
    let i = normalizePhone(input);
    Text.equal(s, i) or i.endsWith(#text s) or s.endsWith(#text i);
  };

  // Simulated breach database with detailed sources
  type BreachEntry = {
    phone : ?Text;
    email : ?Text;
    sources : [BreachSource];
  };

  func getBreachDatabase() : [BreachEntry] {
    [
      {
        phone = ?"9876543210";
        email = null;
        sources = [
          { name = "Truecaller Database"; year = 2019; dataExposed = ["Phone Number", "Name", "Location"]; severity = "HIGH" },
          { name = "JioFiber Leak"; year = 2021; dataExposed = ["Phone Number", "Address", "Email"]; severity = "CRITICAL" },
          { name = "Facebook India"; year = 2021; dataExposed = ["Phone Number", "Facebook ID", "Name"]; severity = "HIGH" },
        ];
      },
      {
        phone = null;
        email = ?"alice@example.com";
        sources = [
          { name = "Adobe Breach"; year = 2013; dataExposed = ["Email", "Password Hash", "Username"]; severity = "HIGH" },
          { name = "Canva Breach"; year = 2019; dataExposed = ["Email", "Name", "City"]; severity = "MEDIUM" },
        ];
      },
      {
        phone = null;
        email = ?"bob@gmail.com";
        sources = [
          { name = "LinkedIn Breach"; year = 2021; dataExposed = ["Email", "Full Name", "Phone", "Address"]; severity = "CRITICAL" },
          { name = "Twitter Breach"; year = 2022; dataExposed = ["Email", "Username"]; severity = "MEDIUM" },
          { name = "MyFitnessPal"; year = 2018; dataExposed = ["Email", "Password Hash", "IP Address"]; severity = "HIGH" },
        ];
      },
      {
        phone = null;
        email = ?"john.doe@yahoo.com";
        sources = [
          { name = "Yahoo Data Breach"; year = 2016; dataExposed = ["Email", "Password", "Security Questions", "DOB"]; severity = "CRITICAL" },
          { name = "Zomato Breach"; year = 2017; dataExposed = ["Email", "Password Hash"]; severity = "MEDIUM" },
        ];
      },
    ];
  };

  func findBreachEntry(normalizedInput : Text, originalInput : Text) : ?BreachEntry {
    let db = getBreachDatabase();
    let isEmailInput = isEmail(originalInput);
    for (entry in db.vals()) {
      if (isEmailInput) {
        switch (entry.email) {
          case (?e) {
            if (Text.equal(e, normalizedInput)) return ?entry;
          };
          case (null) {};
        };
      } else {
        switch (entry.phone) {
          case (?p) {
            if (phonesMatch(p, normalizedInput)) return ?entry;
          };
          case (null) {};
        };
      };
    };
    null;
  };

  // Self-check tool (backward compatible)
  public shared ({ caller }) func submitCheck(contact : Text) : async Bool {
    let trimmed = contact.trim(#char ' ');
    let normalized = normalizeContact(trimmed);
    let result = findBreachEntry(normalized, trimmed);
    let foundInBreach = switch (result) { case (?_) true; case (null) false };

    let checkResult : CheckResult = {
      timestamp = Time.now();
      contact = trimmed;
      wasBreached = foundInBreach;
    };

    let existingResults = switch (checkResults.get(normalized)) {
      case (null) { List.empty<CheckResult>() };
      case (?results) { results };
    };
    existingResults.add(checkResult);
    checkResults.add(normalized, existingResults);

    foundInBreach;
  };

  // Detailed check with breach sources
  public shared ({ caller }) func submitCheckDetailed(contact : Text) : async DetailedCheckResult {
    let trimmed = contact.trim(#char ' ');
    let normalized = normalizeContact(trimmed);
    let breachEntry = findBreachEntry(normalized, trimmed);

    let (wasBreached, sources, riskLevel) = switch (breachEntry) {
      case (?entry) {
        let count = entry.sources.size();
        let risk = if (count >= 3) "CRITICAL" else if (count == 2) "HIGH" else "MEDIUM";
        (true, entry.sources, risk);
      };
      case (null) { (false, [], "SAFE") };
    };

    let detailedResult : DetailedCheckResult = {
      timestamp = Time.now();
      contact = trimmed;
      normalizedContact = normalized;
      wasBreached;
      breachSources = sources;
      totalBreaches = sources.size();
      riskLevel;
    };

    let existingResults = switch (detailedCheckResults.get(normalized)) {
      case (null) { List.empty<DetailedCheckResult>() };
      case (?results) { results };
    };
    existingResults.add(detailedResult);
    detailedCheckResults.add(normalized, existingResults);

    detailedResult;
  };

  // Get check history
  public query ({ caller }) func getCheckHistory(contact : Text) : async [CheckResult] {
    let normalized = normalizeContact(contact);
    switch (checkResults.get(normalized)) {
      case (null) { [] };
      case (?results) { results.toArray() };
    };
  };

  // Get detailed check history
  public query ({ caller }) func getDetailedCheckHistory(contact : Text) : async [DetailedCheckResult] {
    let normalized = normalizeContact(contact);
    switch (detailedCheckResults.get(normalized)) {
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

  // Support messages
  public shared ({ caller }) func submitSupportMessage(name : Text, email : Text, message : Text) : async () {
    Runtime.trap("Support messages are not supported in this version.");
  };
};

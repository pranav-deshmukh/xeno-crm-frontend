export interface Rule {
  id: string;
  field: "total_spent" | "last_order_date" | "total_orders" | "city" | "registration_date";
  operator: ">" | "<" | ">=" | "<=" | "=" | "!=" | "contains" | "not_contains" | "older_than";
  value: string | number | Date;
  logic?: "AND" | "OR";
}
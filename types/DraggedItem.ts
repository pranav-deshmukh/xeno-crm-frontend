import { Rule } from "./Rules";

export type DraggedItem =
  | ({ type: "rule" } & {
      id: string;
      field: string;
      operators: string[];
      valueType: "number" | "text" | "date" | "days";
      placeholder?: string;
    })
  | ({ type: "template" } & {
      id: string;
      rules: Rule[];
    })
  | ({ type: "logic" } & {
      operator: "AND" | "OR";
    });

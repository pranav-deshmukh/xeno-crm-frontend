import { Rule } from "./Rules";


export type TemplateRule = Omit<Rule, "id">;

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
      rules: TemplateRule[]; 
      name: string;
      description: string;
      icon: string;
    })
  | ({ type: "logic" } & {
      operator: "AND" | "OR";
    });
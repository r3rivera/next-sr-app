export const CONDITION_OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Not Contains' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
  { value: 'is_empty', label: 'Is Empty' },
  { value: 'is_not_empty', label: 'Is Not Empty' },
] as const;

export type ConditionOperator = (typeof CONDITION_OPERATORS)[number]['value'];

export const NO_VALUE_OPERATORS = new Set<string>(['is_empty', 'is_not_empty']);

export interface Condition {
  id: string;
  fieldName: string;
  operator: ConditionOperator | '';
  expectedValue: string;
}

export interface ConditionError {
  fieldName?: string;
  operator?: string;
  expectedValue?: string;
}

export interface RuleFormErrors {
  conditions: Record<string, ConditionError>;
  thenBehavior?: string;
  elseBehavior?: string;
}

export interface RuleData {
  conditions: Condition[];
  thenBehavior: string;
  elseBehavior: string;
}

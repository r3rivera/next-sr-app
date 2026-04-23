'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/app/lib/utils';
import {
  CONDITION_OPERATORS,
  Condition,
  ConditionError,
  NO_VALUE_OPERATORS,
} from './rule-builder.types';

interface ConditionRowProps {
  condition: Condition;
  index: number;
  error?: ConditionError;
  canDelete: boolean;
  onChange: (id: string, field: keyof Omit<Condition, 'id'>, value: string) => void;
  onDelete: (id: string) => void;
}

export function ConditionRow({
  condition,
  index,
  error,
  canDelete,
  onChange,
  onDelete,
}: ConditionRowProps) {
  const noValueNeeded = NO_VALUE_OPERATORS.has(condition.operator);

  return (
    <div className="relative flex flex-col gap-3 rounded-lg border border-light-blue-200 bg-light-blue-50 p-4 sm:flex-row sm:items-start">
      <span className="absolute -left-2.5 -top-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-light-blue-600 text-xs font-bold text-white">
        {index + 1}
      </span>

      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Field Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-light-gold-950">Field Name</label>
          <input
            type="text"
            placeholder="e.g. property_type"
            value={condition.fieldName}
            onChange={(e) => onChange(condition.id, 'fieldName', e.target.value)}
            className={cn(
              'rounded-md border px-3 py-2 text-sm text-light-gold-950 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-light-blue-400',
              error?.fieldName
                ? 'border-red-400 bg-red-50 focus:ring-red-400'
                : 'border-light-blue-200 bg-white',
            )}
          />
          {error?.fieldName && (
            <p className="text-xs text-red-500">{error.fieldName}</p>
          )}
        </div>

        {/* Condition Operator */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-light-gold-950">Condition</label>
          <select
            value={condition.operator}
            onChange={(e) => onChange(condition.id, 'operator', e.target.value)}
            className={cn(
              'rounded-md border px-3 py-2 text-sm text-light-gold-950 transition-colors focus:outline-none focus:ring-2 focus:ring-light-blue-400',
              error?.operator
                ? 'border-red-400 bg-red-50 focus:ring-red-400'
                : 'border-light-blue-200 bg-white',
            )}
          >
            <option value="">Select condition...</option>
            {CONDITION_OPERATORS.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
          {error?.operator && (
            <p className="text-xs text-red-500">{error.operator}</p>
          )}
        </div>

        {/* Expected Value */}
        <div className="flex flex-col gap-1">
          <label
            className={cn(
              'text-xs font-medium',
              noValueNeeded ? 'text-gray-400' : 'text-light-gold-950',
            )}
          >
            Expected Value
          </label>
          <input
            type="text"
            placeholder={noValueNeeded ? 'Not required' : 'e.g. apartment'}
            value={condition.expectedValue}
            disabled={noValueNeeded}
            onChange={(e) => onChange(condition.id, 'expectedValue', e.target.value)}
            className={cn(
              'rounded-md border px-3 py-2 text-sm placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-light-blue-400',
              noValueNeeded
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                : error?.expectedValue
                  ? 'border-red-400 bg-red-50 text-light-gold-950 focus:ring-red-400'
                  : 'border-light-blue-200 bg-white text-light-gold-950',
            )}
          />
          {!noValueNeeded && error?.expectedValue && (
            <p className="text-xs text-red-500">{error.expectedValue}</p>
          )}
        </div>
      </div>

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(condition.id)}
          aria-label="Remove condition"
          className="self-center rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-500 sm:mt-5"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

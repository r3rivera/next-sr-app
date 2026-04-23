'use client';

import { useState, useCallback } from 'react';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/app/lib/utils';
import { ConditionRow } from './ConditionRow';
import {
  Condition,
  ConditionError,
  NO_VALUE_OPERATORS,
  RuleData,
  RuleFormErrors,
} from './rule-builder.types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function createCondition(): Condition {
  return { id: crypto.randomUUID(), fieldName: '', operator: '', expectedValue: '' };
}

function validate(
  conditions: Condition[],
  thenBehavior: string,
  elseBehavior: string,
): RuleFormErrors {
  const conditionErrors: Record<string, ConditionError> = {};

  conditions.forEach((c) => {
    const err: ConditionError = {};
    if (!c.fieldName.trim()) err.fieldName = 'Field name is required';
    if (!c.operator) err.operator = 'Please select a condition';
    if (!NO_VALUE_OPERATORS.has(c.operator) && !c.expectedValue.trim()) {
      err.expectedValue = 'Expected value is required';
    }
    if (Object.keys(err).length > 0) conditionErrors[c.id] = err;
  });

  return {
    conditions: conditionErrors,
    thenBehavior: thenBehavior.trim()
      ? undefined
      : 'Please describe the behavior when conditions are met',
    elseBehavior: elseBehavior.trim()
      ? undefined
      : 'Please describe the behavior when conditions are not met',
  };
}

function hasErrors(errors: RuleFormErrors): boolean {
  return (
    Object.keys(errors.conditions).length > 0 ||
    !!errors.thenBehavior ||
    !!errors.elseBehavior
  );
}

// ─── FlowConnector ───────────────────────────────────────────────────────────

interface FlowConnectorProps {
  label: string;
  variant: 'green' | 'orange';
}

function FlowConnector({ label, variant }: FlowConnectorProps) {
  const isGreen = variant === 'green';
  return (
    <div className="flex h-14 w-full max-w-3xl flex-col items-center">
      <div className={cn('w-px flex-1', isGreen ? 'bg-green-300' : 'bg-tangerine-dream-300')} />
      <span
        className={cn(
          'my-1 rounded-full border px-3 py-0.5 text-xs font-bold tracking-widest',
          isGreen
            ? 'border-green-300 bg-green-50 text-green-700'
            : 'border-tangerine-dream-200 bg-tangerine-dream-50 text-tangerine-dream-600',
        )}
      >
        {label}
      </span>
      <div className="flex flex-col items-center">
        <div className={cn('h-3 w-px', isGreen ? 'bg-green-300' : 'bg-tangerine-dream-300')} />
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          aria-hidden="true"
          className={isGreen ? 'text-green-300' : 'text-tangerine-dream-300'}
        >
          <path d="M5 6L0 0h10L5 6z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

// ─── RuleBuilder ─────────────────────────────────────────────────────────────

interface RuleBuilderProps {
  onClose?: () => void;
  onSave?: (data: RuleData) => void;
}

export function RuleBuilder({ onClose, onSave }: RuleBuilderProps) {
  const [conditions, setConditions] = useState<Condition[]>([createCondition()]);
  const [thenBehavior, setThenBehavior] = useState('');
  const [elseBehavior, setElseBehavior] = useState('');
  const [errors, setErrors] = useState<RuleFormErrors>({ conditions: {} });
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const addCondition = useCallback(() => {
    setConditions((prev) => [...prev, createCondition()]);
  }, []);

  const removeCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
    setErrors((prev) => {
      const next = { ...prev.conditions };
      delete next[id];
      return { ...prev, conditions: next };
    });
  }, []);

  const updateCondition = useCallback(
    (id: string, field: keyof Omit<Condition, 'id'>, value: string) => {
      setConditions((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const updated = { ...c, [field]: value };
          if (field === 'operator' && NO_VALUE_OPERATORS.has(value)) {
            updated.expectedValue = '';
          }
          return updated;
        }),
      );
      setErrors((prev) => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          [id]: { ...prev.conditions[id], [field]: undefined },
        },
      }));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const validationErrors = validate(conditions, thenBehavior, elseBehavior);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    setStatus('saving');
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    setStatus('saved');
    onSave?.({ conditions, thenBehavior, elseBehavior });
    setTimeout(() => setStatus('idle'), 2500);
  }, [conditions, thenBehavior, elseBehavior, onSave]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-4 py-8 sm:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-light-gold-950">Rule Builder</h1>
        <p className="mt-1 text-sm text-gray-500">
          Define conditions and specify behaviors for when those conditions are met or not met.
        </p>
      </div>

      <div className="flex flex-col items-center">

        {/* ── Card 1: Conditions (IF) ─────────────────────────────────────── */}
        <section className="w-full max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-light-blue-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-light-blue-100 bg-light-blue-50 px-6 py-4">
              <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded-full bg-light-blue-600 text-xs font-bold uppercase tracking-widest text-white">
                IF
              </span>
              <div>
                <h2 className="text-base font-semibold text-light-gold-950">Conditions</h2>
                <p className="text-xs text-gray-500">
                  Define when this rule should trigger — all conditions must be met
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-6">
              {conditions.map((condition, index) => (
                <div key={condition.id}>
                  {index > 0 && (
                    <div className="mb-4 flex items-center gap-2">
                      <div className="h-px flex-1 bg-gray-200" />
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                        AND
                      </span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  )}
                  <ConditionRow
                    condition={condition}
                    index={index}
                    error={errors.conditions[condition.id]}
                    canDelete={conditions.length > 1}
                    onChange={updateCondition}
                    onDelete={removeCondition}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addCondition}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-light-blue-300 py-3 text-sm font-medium text-light-blue-600 transition-colors hover:border-light-blue-500 hover:bg-light-blue-50 hover:text-light-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                Add Condition
              </button>
            </div>
          </div>
        </section>

        <FlowConnector label="THEN" variant="green" />

        {/* ── Card 2: Then Behavior ───────────────────────────────────────── */}
        <section className="w-full max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-green-100 bg-green-50 px-6 py-4">
              <span className="flex h-7 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold uppercase tracking-widest text-white">
                THEN
              </span>
              <div>
                <h2 className="text-base font-semibold text-light-gold-950">
                  Behavior When Conditions Are Met
                </h2>
                <p className="text-xs text-gray-500">
                  Describe what should happen when all conditions are satisfied
                </p>
              </div>
            </div>
            <div className="p-6">
              <label className="mb-1.5 block text-xs font-medium text-light-gold-950">
                Action / Behavior
              </label>
              <textarea
                rows={4}
                placeholder="e.g. Send email notification to the property owner, flag listing as high priority..."
                value={thenBehavior}
                onChange={(e) => {
                  setThenBehavior(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, thenBehavior: undefined }));
                  }
                }}
                className={cn(
                  'w-full resize-none rounded-md border px-3 py-2.5 text-sm text-light-gold-950 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2',
                  errors.thenBehavior
                    ? 'border-red-400 bg-red-50 focus:ring-red-400'
                    : 'border-green-200 focus:ring-green-400',
                )}
              />
              {errors.thenBehavior && (
                <p className="mt-1 text-xs text-red-500">{errors.thenBehavior}</p>
              )}
            </div>
          </div>
        </section>

        <FlowConnector label="ELSE" variant="orange" />

        {/* ── Card 3: Else Behavior ───────────────────────────────────────── */}
        <section className="w-full max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-tangerine-dream-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-tangerine-dream-100 bg-tangerine-dream-50 px-6 py-4">
              <span className="flex h-7 w-14 shrink-0 items-center justify-center rounded-full bg-tangerine-dream-500 text-xs font-bold uppercase tracking-widest text-white">
                ELSE
              </span>
              <div>
                <h2 className="text-base font-semibold text-light-gold-950">
                  Behavior When Conditions Are Not Met
                </h2>
                <p className="text-xs text-gray-500">
                  Describe what should happen when conditions are not satisfied
                </p>
              </div>
            </div>
            <div className="p-6">
              <label className="mb-1.5 block text-xs font-medium text-light-gold-950">
                Action / Behavior
              </label>
              <textarea
                rows={4}
                placeholder="e.g. Skip processing, log a warning, notify the admin team..."
                value={elseBehavior}
                onChange={(e) => {
                  setElseBehavior(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, elseBehavior: undefined }));
                  }
                }}
                className={cn(
                  'w-full resize-none rounded-md border px-3 py-2.5 text-sm text-light-gold-950 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2',
                  errors.elseBehavior
                    ? 'border-red-400 bg-red-50 focus:ring-red-400'
                    : 'border-tangerine-dream-300 focus:ring-tangerine-dream-400',
                )}
              />
              {errors.elseBehavior && (
                <p className="mt-1 text-xs text-red-500">{errors.elseBehavior}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── Action Buttons ──────────────────────────────────────────────── */}
        <div className="mt-8 flex w-full max-w-3xl flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={status === 'saving'}
            className={cn(
              'flex h-10 items-center justify-center gap-2 rounded-lg px-6 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              status === 'saved'
                ? 'bg-green-600 focus-visible:outline-green-600'
                : 'bg-[#96151D] hover:bg-[#7a1118] focus-visible:outline-[#96151D] active:bg-[#5e0d14]',
              status === 'saving' && 'cursor-wait opacity-75',
            )}
          >
            {status === 'saving' && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {status === 'saved' && <CheckIcon className="h-4 w-4" aria-hidden="true" />}
            {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Validate and Save'}
          </button>
        </div>

      </div>
    </div>
  );
}

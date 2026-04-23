'use client';

import { useRouter } from 'next/navigation';
import { RuleBuilder } from '@/app/ui/features/rule-engine/RuleBuilder';

export default function ManageRulesPage() {
  const router = useRouter();

  return (
    <RuleBuilder
      onClose={() => router.back()}
      onSave={(data) => {
        console.log('Rule saved:', data);
      }}
    />
  );
}

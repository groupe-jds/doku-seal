'use client';

import { FileSignature, Type, Calendar, Mail, Hash } from 'lucide-react';
import { Button } from '@doku-seal/ui/primitives/button';

type FieldType = 'SIGNATURE' | 'INITIALS' | 'NAME' | 'EMAIL' | 'DATE' | 'TEXT' | 'NUMBER';

type FieldsToolbarProps = {
  selectedFieldType: FieldType | null;
  onSelectFieldType: (type: FieldType | null) => void;
  disabled?: boolean;
};

const fieldTypes = [
  { type: 'SIGNATURE' as const, label: 'Signature', icon: FileSignature },
  { type: 'INITIALS' as const, label: 'Initials', icon: FileSignature },
  { type: 'NAME' as const, label: 'Name', icon: Type },
  { type: 'EMAIL' as const, label: 'Email', icon: Mail },
  { type: 'DATE' as const, label: 'Date', icon: Calendar },
  { type: 'TEXT' as const, label: 'Text', icon: Type },
  { type: 'NUMBER' as const, label: 'Number', icon: Hash },
];

export function FieldsToolbar({
  selectedFieldType,
  onSelectFieldType,
  disabled = false,
}: FieldsToolbarProps) {
  return (
    <div className="border-border flex items-center gap-2 border-b bg-white px-4 py-3 dark:bg-gray-950">
      <p className="text-muted-foreground mr-2 text-sm">
        {disabled ? 'Select a recipient first' : 'Click a field type, then click on the document to place it'}
      </p>
      {fieldTypes.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          size="sm"
          variant={selectedFieldType === type ? 'default' : 'outline'}
          disabled={disabled}
          onClick={() => onSelectFieldType(selectedFieldType === type ? null : type)}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}

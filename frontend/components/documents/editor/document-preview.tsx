'use client';

import { X } from 'lucide-react';
import { Button } from '@doku-seal/ui/primitives/button';

type Field = {
  id: string;
  type: 'SIGNATURE' | 'INITIALS' | 'NAME' | 'EMAIL' | 'DATE' | 'TEXT' | 'NUMBER';
  recipientId: string;
  pageNumber: number;
  pageX: number;
  pageY: number;
  pageWidth: number;
  pageHeight: number;
  required: boolean;
};

type Recipient = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type DocumentPreviewProps = {
  documentId?: string;
  fields: Field[];
  recipients: Recipient[];
  selectedFieldType: string | null;
  selectedRecipient: string | null;
  onFieldClick: (position: { pageNumber: number; x: number; y: number }) => void;
  onRemoveField: (fieldId: string) => void;
};

const recipientColors = [
  'border-blue-500 bg-blue-100 dark:bg-blue-900/30',
  'border-green-500 bg-green-100 dark:bg-green-900/30',
  'border-purple-500 bg-purple-100 dark:bg-purple-900/30',
  'border-orange-500 bg-orange-100 dark:bg-orange-900/30',
  'border-pink-500 bg-pink-100 dark:bg-pink-900/30',
];

export function DocumentPreview({
  documentId,
  fields,
  recipients,
  selectedFieldType,
  selectedRecipient,
  onFieldClick,
  onRemoveField,
}: DocumentPreviewProps) {
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedFieldType && selectedRecipient) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      onFieldClick({
        pageNumber: 1, // For simplicity, assuming single page
        x: x,
        y: y,
      });
    }
  };

  const getRecipientColor = (recipientId: string) => {
    const index = recipients.findIndex((r) => r.id === recipientId);
    return recipientColors[index % recipientColors.length];
  };

  const getRecipientName = (recipientId: string) => {
    return recipients.find((r) => r.id === recipientId)?.name || 'Unknown';
  };

  return (
    <div className="flex flex-1 flex-col items-center overflow-auto bg-gray-100 p-8 dark:bg-gray-950">
      <div className="relative w-full max-w-4xl">
        {/* Document Canvas */}
        <div
          className="bg-white shadow-lg"
          style={{
            width: '100%',
            minHeight: '800px',
            cursor: selectedFieldType && selectedRecipient ? 'crosshair' : 'default',
          }}
          onClick={handleCanvasClick}
        >
          {!documentId && (
            <div className="text-muted-foreground flex h-full items-center justify-center p-8 text-center">
              <div>
                <p className="text-lg font-medium">No document uploaded</p>
                <p className="mt-2 text-sm">
                  PDF preview will appear here once a document is uploaded
                </p>
              </div>
            </div>
          )}

          {/* Render fields */}
          {fields.map((field) => (
            <div
              key={field.id}
              className={`group absolute flex items-center justify-center border-2 ${getRecipientColor(
                field.recipientId,
              )}`}
              style={{
                left: `${field.pageX}px`,
                top: `${field.pageY}px`,
                width: `${field.pageWidth}px`,
                height: `${field.pageHeight}px`,
              }}
            >
              <div className="text-center">
                <p className="text-xs font-medium">{field.type}</p>
                <p className="text-xs opacity-70">{getRecipientName(field.recipientId)}</p>
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveField(field.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        {selectedFieldType && selectedRecipient && (
          <div className="bg-primary text-primary-foreground mt-4 rounded-lg p-4 text-center">
            <p className="font-medium">
              Click anywhere on the document to place a {selectedFieldType} field
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

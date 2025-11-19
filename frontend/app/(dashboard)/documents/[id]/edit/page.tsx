'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@doku-seal/ui/primitives/button';
import { apiClient } from '@/lib/api-client';
import { RecipientsSidebar } from '@/components/documents/editor/recipients-sidebar';
import { FieldsToolbar } from '@/components/documents/editor/fields-toolbar';
import { DocumentPreview } from '@/components/documents/editor/document-preview';

type Recipient = {
  id: string;
  email: string;
  name: string;
  role: 'SIGNER' | 'VIEWER' | 'APPROVER' | 'CC';
};

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

type Envelope = {
  id: string;
  title: string;
  status: string;
  recipients: Recipient[];
  fields: Field[];
  documentId?: string;
};

export default function DocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const envelopeId = params?.id as string;

  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [selectedFieldType, setSelectedFieldType] = useState<Field['type'] | null>(null);

  const { data: envelope, isLoading } = useQuery<Envelope>({
    queryKey: ['envelope', envelopeId],
    queryFn: async () => {
      const response = await apiClient.get(`envelopes/${envelopeId}`);
      return response.json();
    },
  });

  const addRecipient = useMutation({
    mutationFn: async (data: { email: string; name: string; role: Recipient['role'] }) => {
      const response = await apiClient.post('recipients', {
        json: {
          envelopeId,
          ...data,
        },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelope', envelopeId] });
    },
  });

  const removeRecipient = useMutation({
    mutationFn: async (recipientId: string) => {
      await apiClient.delete(`recipients/${recipientId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelope', envelopeId] });
    },
  });

  const addField = useMutation({
    mutationFn: async (data: {
      type: Field['type'];
      recipientId: string;
      pageNumber: number;
      pageX: number;
      pageY: number;
      pageWidth: number;
      pageHeight: number;
    }) => {
      const response = await apiClient.post('fields', {
        json: {
          envelopeId,
          required: true,
          ...data,
        },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelope', envelopeId] });
      setSelectedFieldType(null);
    },
  });

  const removeField = useMutation({
    mutationFn: async (fieldId: string) => {
      await apiClient.delete(`fields/${fieldId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelope', envelopeId] });
    },
  });

  const handleFieldClick = (position: { pageNumber: number; x: number; y: number }) => {
    if (selectedFieldType && selectedRecipient) {
      addField.mutate({
        type: selectedFieldType,
        recipientId: selectedRecipient,
        pageNumber: position.pageNumber,
        pageX: position.x,
        pageY: position.y,
        pageWidth: 200,
        pageHeight: 50,
      });
    }
  };

  const handleSendEnvelope = async () => {
    try {
      await apiClient.post(`envelopes/${envelopeId}/send`);
      router.push('/documents');
    } catch (error) {
      console.error('Failed to send envelope:', error);
    }
  };

  if (isLoading || !envelope) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold">{envelope.title}</h1>
          <p className="text-muted-foreground text-sm">Add recipients and fields to your document</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/documents')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEnvelope}
            disabled={envelope.recipients.length === 0 || envelope.fields.length === 0}
          >
            Send Document
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Recipients */}
        <RecipientsSidebar
          recipients={envelope.recipients}
          selectedRecipient={selectedRecipient}
          onSelectRecipient={setSelectedRecipient}
          onAddRecipient={(data) => addRecipient.mutate(data)}
          onRemoveRecipient={(id) => removeRecipient.mutate(id)}
        />

        {/* Center - Document Preview */}
        <div className="flex flex-1 flex-col">
          <FieldsToolbar
            selectedFieldType={selectedFieldType}
            onSelectFieldType={setSelectedFieldType}
            disabled={!selectedRecipient}
          />
          <DocumentPreview
            documentId={envelope.documentId}
            fields={envelope.fields}
            recipients={envelope.recipients}
            selectedFieldType={selectedFieldType}
            selectedRecipient={selectedRecipient}
            onFieldClick={handleFieldClick}
            onRemoveField={(id) => removeField.mutate(id)}
          />
        </div>
      </div>
    </div>
  );
}

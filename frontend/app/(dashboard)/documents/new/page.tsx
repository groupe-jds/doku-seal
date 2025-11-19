'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import { Button } from '@doku-seal/ui/primitives/button';
import { Input } from '@doku-seal/ui/primitives/input';
import { Label } from '@doku-seal/ui/primitives/label';
import { apiClient } from '@/lib/api-client';

export default function NewDocumentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const createEnvelope = useMutation({
    mutationFn: async (data: { title: string; file: File }) => {
      // First, create the envelope
      const envelope = await apiClient.post('envelopes', {
        json: {
          title: data.title,
          recipients: [],
        },
      }).json<{ id: string }>();

      // Then upload the document
      const formData = new FormData();
      formData.append('file', data.file);

      await apiClient.post(`envelopes/${envelope.id}/upload`, {
        body: formData,
      });

      return envelope;
    },
    onSuccess: (envelope) => {
      router.push(`/documents/${envelope.id}/edit`);
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        if (!title) {
          setTitle(droppedFile.name.replace('.pdf', ''));
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        if (!title) {
          setTitle(selectedFile.name.replace('.pdf', ''));
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && file) {
      createEnvelope.mutate({ title, file });
    }
  };

  return (
    <div className="mx-auto w-full max-w-screen-md px-4 md:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Create New Document</h1>
        <p className="text-muted-foreground mt-2">
          Upload a PDF document to start collecting signatures
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Document Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter document title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Document File</Label>
          <div
            className={`border-border relative rounded-lg border-2 border-dashed p-8 transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-primary/10 text-primary rounded-full p-4">
                  <Upload className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="text-muted-foreground rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                  <Upload className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Drop your PDF here</p>
                  <p className="text-muted-foreground text-sm">or</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="mt-2"
                  >
                    Browse Files
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">PDF files only, max 10MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/documents')}
            disabled={createEnvelope.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!title || !file || createEnvelope.isPending}
          >
            {createEnvelope.isPending ? 'Creating...' : 'Continue to Editor'}
          </Button>
        </div>
      </form>
    </div>
  );
}

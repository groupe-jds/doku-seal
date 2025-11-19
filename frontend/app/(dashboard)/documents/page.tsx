'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@doku-seal/ui/primitives/avatar';
import { Tabs, TabsList, TabsTrigger } from '@doku-seal/ui/primitives/tabs';
import { DocumentsTable } from '@/components/documents/documents-table';
import { DocumentSearch } from '@/components/documents/document-search';
import { apiClient } from '@/lib/api-client';

type DocumentStatus = 'DRAFT' | 'PENDING' | 'COMPLETED' | 'ALL';

export default function DocumentsPage() {
  const [status, setStatus] = useState<DocumentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: envelopes, isLoading } = useQuery({
    queryKey: ['envelopes', status, searchQuery],
    queryFn: async () => {
      const response = await apiClient.get('/envelopes', {
        searchParams: {
          ...(status !== 'ALL' && { status }),
          ...(searchQuery && { query: searchQuery }),
        },
      });
      return response.json();
    },
  });

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 md:px-8">
      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-8">
        <div className="flex flex-row items-center">
          <Avatar className="dark:border-border mr-3 h-12 w-12 border-2 border-solid border-white">
            <AvatarFallback className="text-muted-foreground text-xs">
              DS
            </AvatarFallback>
          </Avatar>

          <h2 className="text-4xl font-semibold">Documents</h2>
        </div>

        <div className="-m-1 flex flex-wrap gap-x-4 gap-y-6 overflow-hidden p-1">
          <Tabs value={status} onValueChange={(value) => setStatus(value as DocumentStatus)} className="overflow-x-auto">
            <TabsList>
              <TabsTrigger
                className="hover:text-foreground min-w-[60px]"
                value="PENDING"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                className="hover:text-foreground min-w-[60px]"
                value="COMPLETED"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger
                className="hover:text-foreground min-w-[60px]"
                value="DRAFT"
              >
                Draft
              </TabsTrigger>
              <TabsTrigger
                className="hover:text-foreground min-w-[60px]"
                value="ALL"
              >
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex w-48 flex-wrap items-center justify-between gap-x-2 gap-y-4">
            <DocumentSearch
              initialValue={searchQuery}
              onSearch={setSearchQuery}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <DocumentsTable data={envelopes || []} isLoading={isLoading} />
      </div>
    </div>
  );
}

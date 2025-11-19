'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@doku-seal/ui/primitives/table';
import { Badge } from '@doku-seal/ui/primitives/badge';
import { Button } from '@doku-seal/ui/primitives/button';
import { Skeleton } from '@doku-seal/ui/primitives/skeleton';

type Envelope = {
  id: string;
  title: string;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED';
  createdAt: string;
  recipients: Array<{
    id: string;
    email: string;
    name: string;
  }>;
};

type DocumentsTableProps = {
  data: Envelope[];
  isLoading: boolean;
};

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
};

export function DocumentsTable({ data, isLoading }: DocumentsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-muted-foreground text-lg font-medium">No documents found</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Get started by creating your first document
        </p>
        <Button asChild className="mt-4">
          <Link href="/documents/new">Create Document</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((envelope) => (
            <TableRow key={envelope.id}>
              <TableCell className="font-medium">{envelope.title}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {envelope.recipients.slice(0, 2).map((recipient) => (
                    <span key={recipient.id} className="text-muted-foreground text-sm">
                      {recipient.name || recipient.email}
                    </span>
                  ))}
                  {envelope.recipients.length > 2 && (
                    <span className="text-muted-foreground text-xs">
                      +{envelope.recipients.length - 2} more
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[envelope.status]} variant="secondary">
                  {envelope.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(envelope.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/documents/${envelope.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

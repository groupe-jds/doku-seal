'use client';

import { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { Button } from '@doku-seal/ui/primitives/button';
import { Input } from '@doku-seal/ui/primitives/input';
import { Label } from '@doku-seal/ui/primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@doku-seal/ui/primitives/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@doku-seal/ui/primitives/dialog';

type Recipient = {
  id: string;
  email: string;
  name: string;
  role: 'SIGNER' | 'VIEWER' | 'APPROVER' | 'CC';
};

type RecipientsSidebarProps = {
  recipients: Recipient[];
  selectedRecipient: string | null;
  onSelectRecipient: (id: string | null) => void;
  onAddRecipient: (data: { email: string; name: string; role: Recipient['role'] }) => void;
  onRemoveRecipient: (id: string) => void;
};

const roleColors = {
  SIGNER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  VIEWER: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  APPROVER: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  CC: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
};

export function RecipientsSidebar({
  recipients,
  selectedRecipient,
  onSelectRecipient,
  onAddRecipient,
  onRemoveRecipient,
}: RecipientsSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    email: '',
    name: '',
    role: 'SIGNER' as Recipient['role'],
  });

  const handleAddRecipient = () => {
    if (newRecipient.email && newRecipient.name) {
      onAddRecipient(newRecipient);
      setNewRecipient({ email: '', name: '', role: 'SIGNER' });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="border-border flex w-80 flex-col border-r bg-gray-50 dark:bg-gray-900">
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-semibold">Recipients</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Recipient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newRecipient.name}
                  onChange={(e) =>
                    setNewRecipient({ ...newRecipient, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={newRecipient.email}
                  onChange={(e) =>
                    setNewRecipient({ ...newRecipient, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newRecipient.role}
                  onValueChange={(value) =>
                    setNewRecipient({ ...newRecipient, role: value as Recipient['role'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIGNER">Signer</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                    <SelectItem value="APPROVER">Approver</SelectItem>
                    <SelectItem value="CC">CC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddRecipient} className="w-full">
                Add Recipient
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {recipients.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center text-sm">
            <User className="mb-2 h-8 w-8 opacity-50" />
            <p>No recipients yet</p>
            <p className="mt-1">Add recipients to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className={`border-border group cursor-pointer rounded-lg border p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedRecipient === recipient.id
                    ? 'border-primary bg-primary/5'
                    : ''
                }`}
                onClick={() =>
                  onSelectRecipient(
                    selectedRecipient === recipient.id ? null : recipient.id,
                  )
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{recipient.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          roleColors[recipient.role]
                        }`}
                      >
                        {recipient.role}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {recipient.email}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRecipient(recipient.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

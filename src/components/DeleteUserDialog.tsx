import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { useDeleteUserData } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  isCurrentUser?: boolean;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
                                                             userId,
                                                             userName,
                                                             isOpen,
                                                             onClose,
                                                             isCurrentUser = false
                                                           }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteUserData = useDeleteUserData();
  const { signOut } = useAuth();
  const router = useRouter();

  const expectedText = `DELETE ${userName}`;
  const isConfirmValid = confirmText === expectedText;

  const handleDelete = async () => {
    if (!isConfirmValid) return;

    setIsDeleting(true);
    try {
      await deleteUserData.mutateAsync(userId);

      if (isCurrentUser) {
        await signOut();
        router.push('/'); // Use router.push for client-side navigation
      }

      onClose();
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete User Account
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                This action will permanently delete <strong>{userName}</strong>'s account and all associated data, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Profile information</li>
                <li>Job applications</li>
                <li>Uploaded CV and documents</li>
                <li>All personal data (GDPR compliant)</li>
              </ul>
              <p className="text-red-600 font-medium">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-text">
                Type <code className="bg-gray-100 px-1 rounded">{expectedText}</code> to confirm:
              </Label>
              <Input
                  id="confirm-text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={expectedText}
                  className={confirmText && !isConfirmValid ? 'border-red-500' : ''}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
            <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!isConfirmValid || isDeleting}
                className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
};

export default DeleteUserDialog;

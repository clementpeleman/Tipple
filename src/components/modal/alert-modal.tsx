import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  wineId: number | string; // ID van de wijn die verwijderd moet worden (can be string for UUID)
  onDeleteSuccess: () => void; // Callback om de UI te updaten na verwijderen
  loading: boolean; // Indicates if the deletion is in progress
  title?: string; // Optional custom title
  description?: string; // Optional custom description
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  wineId,
  onDeleteSuccess,
  loading,
  title = "Are you sure?",
  description = "This action cannot be undone."
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          onClick={onDeleteSuccess}
        >
          {loading ? "Deleting..." : "Continue"}
        </Button>
      </div>
    </Modal>
  );
};
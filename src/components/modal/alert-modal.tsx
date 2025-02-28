'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { wineService } from '@/constants/wineItem-service';
import { toast } from 'sonner';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  wineId: number; // ID van de wijn die verwijderd moet worden
  onDeleteSuccess: () => void; // Callback om de UI te updaten na verwijderen
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  wineId,
  onDeleteSuccess,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      const success = await wineService.deleteWine(wineId);
      if (success) {
        toast.success('Wine deleted successfully');
        onDeleteSuccess(); // UI verversen na succesvolle verwijdering
        onClose();
      } else {
        toast.error('Failed to delete wine');
      }
    } catch (error) {
      console.error('Error deleting wine:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title='Are you sure?'
      description='This action cannot be undone.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex w-full items-center justify-end space-x-2 pt-6'>
        <Button disabled={loading} variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant='destructive' onClick={handleDelete}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import AvailabilityForm from "./AvailabilityForm";

interface AvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvailabilityDialog({
  isOpen,
  onClose,
}: AvailabilityDialogProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleFormSubmissionSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Availability</DialogTitle>
          </DialogHeader>
          <AvailabilityForm onSubmissionSuccess={handleFormSubmissionSuccess} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

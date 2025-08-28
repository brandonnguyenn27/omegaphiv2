"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import AvailabilityForm from "./AvailabilityForm";
import { InferSelectModel } from "drizzle-orm";
import { interviewDates } from "@/db/schema";

type InterviewDates = InferSelectModel<typeof interviewDates>;

interface AvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  interviewDates: InterviewDates[];
}

export default function AvailabilityDialog({
  isOpen,
  onClose,
  interviewDates,
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
          <AvailabilityForm
            onSubmissionSuccess={handleFormSubmissionSuccess}
            interviewDates={interviewDates}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

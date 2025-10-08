"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { MdWarningAmber } from "react-icons/md";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  count = 1,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      classNames={{
        base: "bg-background-200/95 backdrop-blur-md border border-danger/30",
        header: "border-b border-danger/20",
        body: "py-6",
        footer: "border-t border-danger/20",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="p-2 bg-danger/20 rounded-lg">
            <MdWarningAmber className="text-danger" size={24} />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Confirm Deletion
          </h2>
        </ModalHeader>
        <ModalBody>
          <p className="text-foreground/80">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-danger">
              {count} member{count > 1 ? "s" : ""}
            </span>
            ? This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="flat"
            onPress={onClose}
            className="bg-foreground/10 text-foreground hover:bg-foreground/20"
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={() => {
              onConfirm();
              onClose();
            }}
            className="bg-danger text-white font-semibold hover:bg-danger/90"
          >
            Delete {count > 1 ? "All" : ""}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

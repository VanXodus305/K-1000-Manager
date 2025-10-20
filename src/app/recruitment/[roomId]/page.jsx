"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import {
  getRoom,
  updatePanelStatus,
  updatePanel,
  deletePanel,
} from "@/actions/recruitmentActions";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { MdEdit, MdClose } from "react-icons/md";
import { VERTICALS } from "@/constants/verticals";
import localFont from "next/font/local";

const conthrax = localFont({
  src: "../../../../public/fonts/Conthrax-SemiBold.otf",
  variable: "--font-conthrax",
  display: "swap",
});

export default function RoomPanel() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState({});
  const [editingPanel, setEditingPanel] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", branch: "" });
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Check authorization on mount
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (
      status === "authenticated" &&
      session?.user?.role !== "admin" &&
      session?.user?.role !== "rec-man"
    ) {
      router.push("/recruitment/status");
    }
  }, [status, session, router]);

  // Fetch room details
  const fetchRoom = useCallback(async () => {
    if (!roomId) return;

    try {
      const result = await getRoom(roomId);
      if (result.success) {
        setRoom(result.room);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error fetching room:", error);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Fetch room on mount and set up polling
  useEffect(() => {
    fetchRoom();

    // Poll for updates every 2 seconds
    const interval = setInterval(fetchRoom, 2000);

    return () => clearInterval(interval);
  }, [fetchRoom]);

  const handleToggleStatus = async (panelId) => {
    if (!room) return;

    const panel = room.panels.find((p) => p.id === panelId);
    if (!panel) return;

    const newStatus = panel.status === "free" ? "busy" : "free";

    setIsUpdating((prev) => ({ ...prev, [panelId]: true }));

    try {
      const result = await updatePanelStatus(roomId, panelId, newStatus);
      if (result.success) {
        setRoom(result.room);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update panel status");
    } finally {
      setIsUpdating((prev) => ({ ...prev, [panelId]: false }));
    }
  };

  const handleEditPanel = (panel) => {
    setEditingPanel(panel);
    setEditFormData({ name: panel.name, branch: panel.branch });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPanel || !editFormData.name || !editFormData.branch) {
      alert("Please fill in all fields");
      return;
    }

    setIsEditLoading(true);
    try {
      const result = await updatePanel(roomId, editingPanel.id, {
        name: editFormData.name,
        branch: editFormData.branch,
      });
      if (result.success) {
        setRoom(result.room);
        setIsEditModalOpen(false);
        setEditingPanel(null);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error updating panel:", error);
      alert("Failed to update panel");
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDeletePanel = async (panelId) => {
    if (!confirm("Are you sure you want to delete this panel?")) return;

    setIsUpdating((prev) => ({ ...prev, [panelId]: true }));
    try {
      const result = await deletePanel(roomId, panelId);
      if (result.success) {
        setRoom(result.room);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting panel:", error);
      alert("Failed to delete panel");
    } finally {
      setIsUpdating((prev) => ({ ...prev, [panelId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-100 via-background-200 to-background-100 flex items-center justify-center p-6">
        <Card className="bg-background-200/90 border border-primary/30 backdrop-blur-md">
          <CardBody className="p-8">
            <p className="text-foreground">Loading room details...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-100 via-background-200 to-background-100 flex items-center justify-center p-6">
        <Card className="bg-background-200/90 border border-primary/30 backdrop-blur-md">
          <CardBody className="p-8">
            <p className="text-foreground text-center mb-4">
              Room not found. Please try again.
            </p>
            <Link href="/recruitment">
              <Button
                color="primary"
                className="w-full bg-primary text-background-200 font-semibold"
              >
                Back to Recruitment
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const totalPanels = room.panels.length;
  const freePanels = room.panels.filter((p) => p.status === "free").length;
  const busyPanels = room.panels.filter((p) => p.status === "busy").length;
  const occupancyPercentage =
    totalPanels > 0 ? Math.round((busyPanels / totalPanels) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-100 via-background-200 to-background-100 p-4 sm:p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/recruitment/status">
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                className="bg-background-200/80 border border-primary/40 text-primary hover:border-primary/60 hover:bg-background-200/90"
              >
                <FiArrowLeft size={16} className="sm:block hidden" />
                <FiArrowLeft size={14} className="sm:hidden block" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1
                className={`${conthrax.className} text-lg sm:text-2xl md:text-3xl font-bold text-primary truncate`}
              >
                {room.name}
              </h1>
              <p className="text-foreground/70 text-xs sm:text-sm">
                {totalPanels} Panel{totalPanels !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Room Statistics Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Card className="bg-background-200/80 border border-primary/30 backdrop-blur-md">
            <CardBody className="p-2 sm:p-4 text-center">
              <p className="text-foreground/70 text-xs sm:text-xs mb-0.5 sm:mb-1">
                Total Panels
              </p>
              <p className="text-lg sm:text-2xl font-bold text-primary">
                {totalPanels}
              </p>
            </CardBody>
          </Card>
          <Card className="bg-background-200/80 border border-primary/30 backdrop-blur-md">
            <CardBody className="p-2 sm:p-4 text-center">
              <p className="text-foreground/70 text-xs sm:text-xs mb-0.5 sm:mb-1">
                Free Panels
              </p>
              <p className="text-lg sm:text-2xl font-bold text-secondary">
                {freePanels}
              </p>
            </CardBody>
          </Card>
          <Card className="bg-background-200/80 border border-primary/30 backdrop-blur-md">
            <CardBody className="p-2 sm:p-4 text-center">
              <p className="text-foreground/70 text-xs sm:text-xs mb-0.5 sm:mb-1">
                Busy Panels
              </p>
              <p className="text-lg sm:text-2xl font-bold text-primary">
                {busyPanels}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Occupancy Progress */}
        <Card className="mb-4 sm:mb-6 bg-background-200/80 border border-primary/30 backdrop-blur-md">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2 gap-2">
              <p className="text-foreground/70 text-xs sm:text-sm font-medium">
                Room Occupancy
              </p>
              <Chip
                size="sm"
                className="bg-primary/20 text-primary border border-primary/40 text-xs sm:text-sm"
              >
                {occupancyPercentage}%
              </Chip>
            </div>
            <div className="w-full h-2 bg-background-100/50 rounded-full overflow-hidden border border-primary/30">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </CardBody>
        </Card>

        {/* Panel Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
          {room.panels.map((panel) => {
            const isBusy = panel.status === "busy";
            const isUpdating_panel = isUpdating[panel.id];

            return (
              <Card
                key={panel.id}
                className={`border-2 backdrop-blur-md transition-all ${
                  isBusy
                    ? "bg-red-500/15 border-red-500/50 hover:border-red-500/70"
                    : "bg-cyan-500/15 border-cyan-500/50 hover:border-cyan-500/70"
                }`}
              >
                <CardBody className="p-3 sm:p-4 flex flex-col items-center justify-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground text-center line-clamp-2">
                    {panel.name}
                  </h3>

                  <Chip
                    size="xs"
                    variant="flat"
                    className="bg-background-100/60 text-foreground/80 text-xs px-2 truncate"
                  >
                    {panel.branch}
                  </Chip>

                  <Chip
                    variant="flat"
                    size="sm"
                    className={`text-xs font-bold ${
                      isBusy
                        ? "bg-red-500/40 text-red-100 border border-red-500/60"
                        : "bg-cyan-500/40 text-cyan-100 border border-cyan-500/60"
                    }`}
                  >
                    {isBusy ? "🔴 BUSY" : "🟢 FREE"}
                  </Chip>

                  <Button
                    size="sm"
                    fullWidth
                    variant="bordered"
                    onPress={() => handleToggleStatus(panel.id)}
                    isLoading={isUpdating_panel}
                    className={`mt-1 font-semibold text-xs ${
                      isBusy
                        ? "bg-red-500/20 text-red-100 border-red-500/40 hover:bg-red-500/30"
                        : "bg-cyan-500/20 text-cyan-100 border-cyan-500/40 hover:bg-cyan-500/30"
                    }`}
                  >
                    {isBusy ? "Mark Free" : "Mark Busy"}
                  </Button>

                  <div className="flex justify-center gap-1.5 sm:gap-2 w-full mt-2">
                    <Button
                      size="sm"
                      variant="bordered"
                      className="flex flex-1 bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 font-semibold text-xs"
                      startContent={<MdEdit size={14} />}
                      onPress={() => handleEditPanel(panel)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="bordered"
                      className="flex flex-1 bg-red-500/20 text-red-500 border border-red-500/40 hover:bg-red-500/30 font-semibold text-xs"
                      startContent={<MdClose size={14} />}
                      onPress={() => handleDeletePanel(panel.id)}
                      isLoading={isUpdating_panel}
                    >
                      Delete
                    </Button>
                  </div>

                  <p className="text-xs text-foreground/50 mt-1">
                    Last Updated: {new Date(panel.updatedAt).toLocaleTimeString()}
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit Panel Modal */}
      <Modal
        isOpen={isEditModalOpen}
        backdrop="blur"
        onClose={() => setIsEditModalOpen(false)}
        size="sm"
        className="max-w-md"
      >
        <ModalContent className="bg-background-200/95 backdrop-blur-md border border-primary/30 mx-4">
          <ModalHeader className="border-b border-primary/20">
            <h3
              className={`${conthrax.className} text-lg sm:text-xl font-bold text-primary`}
            >
              Edit Panel
            </h3>
          </ModalHeader>

          <ModalBody className="py-4 sm:py-6 gap-3 sm:gap-4">
            <Input
              label="Panel Name"
              placeholder="e.g., Panel A"
              size="sm"
              color="primary"
              value={editFormData.name}
              onValueChange={(value) =>
                setEditFormData({ ...editFormData, name: value })
              }
              classNames={{
                input: "text-foreground text-sm",
                label: "text-foreground/70 text-sm",
                inputWrapper: "bg-background-100/60 border border-primary/30",
              }}
            />

            <Select
              label="Branch"
              placeholder="Select branch"
              size="sm"
              selectedKeys={new Set([editFormData.branch])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setEditFormData({ ...editFormData, branch: selected });
              }}
              classNames={{
                label: "text-foreground/80",
                trigger:
                  "bg-background-200/60 border border-primary/20 hover:border-primary/40 data-[hover=true]:bg-background-200/80",
                value: "text-foreground",
                popoverContent:
                  "bg-background-200/95 backdrop-blur-md border border-primary/30",
              }}
            >
              {VERTICALS.map((branch) => (
                <SelectItem
                  key={branch}
                  color="primary"
                  variant="flat"
                  value={branch}
                  textValue={branch}
                >
                  {branch}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter className="border-t border-primary/20 gap-2">
            <Button
              size="sm"
              variant="light"
              onPress={() => setIsEditModalOpen(false)}
              className="text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-background-200 font-semibold text-xs sm:text-sm"
              onPress={handleSaveEdit}
              isLoading={isEditLoading}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Select,
  SelectItem,
  ScrollShadow,
  Chip,
} from "@heroui/react";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import Link from "next/link";
import {
  configureRooms,
  getAllRooms,
  updateRoomName,
  deleteRoom,
} from "@/actions/recruitmentActions";
import { VERTICALS } from "@/constants/verticals";
import localFont from "next/font/local";

const conthrax = localFont({
  src: "../../../public/fonts/Conthrax-SemiBold.otf",
  variable: "--font-conthrax",
  display: "swap",
});

export default function RecruitmentSetup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [numRooms, setNumRooms] = useState("");
  const [roomsConfig, setRoomsConfig] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedRooms, setSavedRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [editRoomName, setEditRoomName] = useState("");
  const [isEditRoomLoading, setIsEditRoomLoading] = useState(false);

  // Check authorization on mount and redirect if not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/recruitment/status");
    } else if (status === "authenticated" && session?.user?.role === "admin") {
      // Only fetch rooms if authenticated as admin
      fetchRooms();
    }
  }, [status, session, router]);

  const fetchRooms = async () => {
    try {
      const result = await getAllRooms();
      if (result.success) {
        setSavedRooms(result.rooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Generate room configuration form
  const handleNumRoomsChange = (value) => {
    setNumRooms(value);
    const num = parseInt(value) || 0;

    if (num > 0) {
      // Find the next available room number by checking existing rooms
      const existingRoomNumbers = savedRooms
        .map((room) => {
          const match = room.roomId.match(/^room-(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter((n) => n > 0);

      const maxExistingNumber =
        existingRoomNumbers.length > 0 ? Math.max(...existingRoomNumbers) : 0;

      const newConfig = Array(num)
        .fill(null)
        .map((_, idx) => ({
          roomId: `room-${maxExistingNumber + idx + 1}`,
          name: `Room ${maxExistingNumber + idx + 1}`,
          panels: [{ name: "Panel 1", branch: "" }],
        }));
      setRoomsConfig(newConfig);
    }
  };

  const updateRoomConfig = (roomIdx, field, value) => {
    const updated = [...roomsConfig];
    updated[roomIdx][field] = value;
    setRoomsConfig(updated);
  };

  const updatePanelConfig = (roomIdx, panelIdx, field, value) => {
    const updated = [...roomsConfig];
    if (!updated[roomIdx].panels) {
      updated[roomIdx].panels = [];
    }
    if (!updated[roomIdx].panels[panelIdx]) {
      updated[roomIdx].panels[panelIdx] = { name: "", branch: "" };
    }
    updated[roomIdx].panels[panelIdx][field] = value;
    setRoomsConfig(updated);
  };

  const addPanel = (roomIdx) => {
    const updated = [...roomsConfig];
    const panelCount = updated[roomIdx].panels.length;
    updated[roomIdx].panels.push({
      name: `Panel ${panelCount + 1}`,
      branch: "",
    });
    setRoomsConfig(updated);
  };

  const removePanel = (roomIdx, panelIdx) => {
    const updated = [...roomsConfig];
    updated[roomIdx].panels.splice(panelIdx, 1);
    setRoomsConfig(updated);
  };

  const handleSaveConfiguration = async () => {
    if (roomsConfig.some((room) => room.panels.length === 0)) {
      alert("Each room must have at least one panel");
      return;
    }

    if (
      roomsConfig.some((room) => room.panels.some((panel) => !panel.branch))
    ) {
      alert("Please select a branch for all panels");
      return;
    }

    setIsLoading(true);
    try {
      const result = await configureRooms(roomsConfig);
      if (result.success) {
        // Merge new rooms with existing rooms and sort by name
        const mergedRooms = [...savedRooms, ...result.rooms].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setSavedRooms(mergedRooms);
        setIsConfigModalOpen(false);
        setNumRooms("");
        setRoomsConfig([]);
        alert("Rooms configured successfully!");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      alert("Failed to save configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setEditRoomName(room.name);
    setIsEditRoomModalOpen(true);
  };

  const handleSaveRoomName = async () => {
    if (!editingRoom || !editRoomName.trim()) {
      alert("Please enter a room name");
      return;
    }

    setIsEditRoomLoading(true);
    try {
      const result = await updateRoomName(editingRoom.roomId, editRoomName);
      if (result.success) {
        const updatedRooms = savedRooms
          .map((room) =>
            room.roomId === editingRoom.roomId ? result.room : room
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setSavedRooms(updatedRooms);
        setIsEditRoomModalOpen(false);
        setEditingRoom(null);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room");
    } finally {
      setIsEditRoomLoading(false);
    }
  };

  const handleDeleteAllPanels = async (room) => {
    if (!confirm(`Delete the room "${room.name}" entirely?`)) {
      return;
    }

    try {
      const result = await deleteRoom(room.roomId);
      if (result.success) {
        setSavedRooms(savedRooms.filter((r) => r.roomId !== room.roomId));
        alert("Room deleted successfully!");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-100 via-background-200 to-background-100 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`${conthrax.className} text-3xl sm:text-4xl font-bold text-primary mb-2`}
          >
            Recruitment Management
          </h1>
          <p className="text-foreground/70 text-sm sm:text-base">
            Manage recruitment rooms and panels across different branches
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Setup Card */}
          <Card className="lg:col-span-3 bg-background-200/80 border border-primary/30 backdrop-blur-md">
            <CardHeader className="flex justify-between items-center border-b border-primary/20">
              <h2
                className={`${conthrax.className} text-xl font-bold text-primary`}
              >
                Room Configuration
              </h2>
              <Button
                startContent={<IoMdAdd size={20} />}
                color="primary"
                className="bg-primary text-background-200 font-semibold"
                onPress={() => setIsConfigModalOpen(true)}
              >
                Setup Rooms
              </Button>
            </CardHeader>
            <CardBody className="gap-4">
              {savedRooms.length === 0 ? (
                <p className="text-foreground/60 text-center py-8">
                  No rooms configured yet. Click "Setup Rooms" to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-foreground/70">
                    Total Rooms:{" "}
                    <span className="font-bold text-primary">
                      {savedRooms.length}
                    </span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedRooms.map((room) => (
                      <Card
                        key={room.roomId}
                        className="bg-background-200/80 border border-primary/30 hover:border-primary/50 transition-all"
                      >
                        <CardBody className="p-4 gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-primary truncate">
                                {room.name}
                              </h3>
                              <p className="text-xs text-foreground/70">
                                Panels: {room.panels.length}
                              </p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="text-primary hover:bg-primary/20"
                                onPress={() => handleEditRoom(room)}
                              >
                                <MdEdit size={16} />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="text-danger hover:bg-danger/20"
                                onPress={() => handleDeleteAllPanels(room)}
                              >
                                <IoMdClose size={16} />
                              </Button>
                            </div>
                          </div>

                          {/* Panel Chips */}
                          <ScrollShadow
                            size={0}
                            className="flex gap-2 pb-1 overflow-x-auto"
                          >
                            {room.panels.map((panel) => (
                              <Chip
                                key={panel.id}
                                size="sm"
                                className="bg-primary/20 text-primary border border-primary/40 flex-shrink-0 text-xs"
                                variant="bordered"
                              >
                                {panel.name}
                              </Chip>
                            ))}
                          </ScrollShadow>

                          <Link
                            href={`/recruitment/${room.roomId}`}
                            className="w-full"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 font-semibold"
                              variant="bordered"
                            >
                              Manage Panels
                            </Button>
                          </Link>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Quick View Card */}
          <Card className="lg:col-span-3 bg-background-200/80 border border-primary/30 backdrop-blur-md">
            <CardHeader className="border-b border-primary/20">
              <h2
                className={`${conthrax.className} text-xl font-bold text-primary`}
              >
                All Recruitment Rooms
              </h2>
            </CardHeader>
            <CardBody>
              <Link href="/recruitment/status">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full bg-primary text-background-200 font-semibold"
                >
                  View Live Status
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Configuration Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        backdrop="blur"
        onClose={() => setIsConfigModalOpen(false)}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-background-200/95 backdrop-blur-md border border-primary/30 max-h-[90vh]">
          <ModalHeader className="border-b border-primary/20">
            <h3
              className={`${conthrax.className} text-2xl font-bold text-primary`}
            >
              Configure Recruitment Rooms
            </h3>
          </ModalHeader>

          <ModalBody className="py-6 flex-1 overflow-hidden">
            {!numRooms ? (
              <div className="flex flex-col gap-4">
                <p className="text-foreground/70">
                  How many rooms will be used for recruitment?
                </p>
                <Input
                  type="number"
                  label="Number of Rooms"
                  color="primary"
                  placeholder="Enter number of rooms (1-20)"
                  min="1"
                  max="20"
                  value={numRooms}
                  onValueChange={handleNumRoomsChange}
                  classNames={{
                    input: "text-foreground",
                    label: "text-foreground/70",
                    mainWrapper: "h-full",
                    inputWrapper:
                      "bg-background-100/60 border border-primary/30 hover:border-primary/50",
                  }}
                />
              </div>
            ) : (
              <div className="w-full">
                <ScrollShadow className="flex flex-col gap-6 max-h-[60vh] pr-4">
                  {roomsConfig.map((room, roomIdx) => (
                    <Card
                      key={roomIdx}
                      className="bg-background-100/60 border border-primary/20 flex-shrink-0"
                    >
                      <CardBody className="gap-4 p-4">
                        <h4 className="font-semibold text-primary">
                          Room {roomIdx + 1}
                        </h4>

                        <Input
                          label="Room Name"
                          color="primary"
                          placeholder="e.g., Tech Interview Room"
                          value={room.name}
                          onValueChange={(value) =>
                            updateRoomConfig(roomIdx, "name", value)
                          }
                          classNames={{
                            input: "text-foreground",
                            label: "text-foreground/70",
                            inputWrapper:
                              "bg-background-100/60 border border-primary/30",
                          }}
                        />

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-foreground">
                              Panels ({room.panels.length})
                            </p>
                            <Button
                              size="sm"
                              variant="light"
                              startContent={<IoMdAdd size={16} />}
                              onPress={() => addPanel(roomIdx)}
                              className="text-primary"
                            >
                              Add Panel
                            </Button>
                          </div>

                          {room.panels.map((panel, panelIdx) => (
                            <Card
                              key={panelIdx}
                              className="bg-background-200/60 border border-primary/20 p-3"
                            >
                              <div className="flex flex-col gap-2">
                                <Input
                                  label={`Panel ${panelIdx + 1} Name`}
                                  color="primary"
                                  placeholder="e.g., Panel A"
                                  value={panel.name}
                                  onValueChange={(value) =>
                                    updatePanelConfig(
                                      roomIdx,
                                      panelIdx,
                                      "name",
                                      value
                                    )
                                  }
                                  classNames={{
                                    input: "text-foreground text-sm",
                                    label: "text-foreground/70 text-xs",
                                    inputWrapper:
                                      "bg-background-100/60 border border-primary/30",
                                  }}
                                />

                                <Select
                                  label={`Branch for Panel ${panelIdx + 1}`}
                                  placeholder="Select branch"
                                  value={panel.branch}
                                  onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0];
                                    updatePanelConfig(
                                      roomIdx,
                                      panelIdx,
                                      "branch",
                                      selected
                                    );
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
                                  {VERTICALS.map((vertical) => (
                                    <SelectItem
                                      key={vertical}
                                      color="primary"
                                      variant="flat"
                                      value={vertical}
                                    >
                                      {vertical}
                                    </SelectItem>
                                  ))}
                                </Select>

                                {room.panels.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="light"
                                    color="danger"
                                    onPress={() =>
                                      removePanel(roomIdx, panelIdx)
                                    }
                                    className="justify-start"
                                  >
                                    <IoMdClose size={18} /> Remove Panel
                                  </Button>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </ScrollShadow>
              </div>
            )}
          </ModalBody>

          <ModalFooter className="border-t border-primary/20">
            {numRooms && (
              <Button
                variant="light"
                onPress={() => {
                  setNumRooms("");
                  setRoomsConfig([]);
                }}
              >
                Back
              </Button>
            )}
            {numRooms && (
              <Button
                className="bg-primary text-background-200 font-semibold"
                onPress={handleSaveConfiguration}
                isLoading={isLoading}
              >
                Save Configuration
              </Button>
            )}
            {!numRooms && (
              <Button
                color="danger"
                variant="light"
                onPress={() => setIsConfigModalOpen(false)}
              >
                Close
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Room Modal */}
      <Modal
        isOpen={isEditRoomModalOpen}
        backdrop="blur"
        onClose={() => setIsEditRoomModalOpen(false)}
        size="sm"
      >
        <ModalContent className="bg-background-200/95 backdrop-blur-md border border-primary/30">
          <ModalHeader className="border-b border-primary/20">
            <h3
              className={`${conthrax.className} text-lg font-bold text-primary`}
            >
              Edit Room Name
            </h3>
          </ModalHeader>

          <ModalBody className="py-4 gap-4">
            <Input
              label="Room Name"
              color="primary"
              placeholder="Enter room name"
              value={editRoomName}
              onValueChange={setEditRoomName}
              classNames={{
                input: "text-foreground",
                label: "text-foreground/70",
                inputWrapper: "bg-background-100/60 border border-primary/30",
              }}
            />
          </ModalBody>

          <ModalFooter className="border-t border-primary/20">
            <Button
              variant="light"
              onPress={() => setIsEditRoomModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-background-200 font-semibold"
              onPress={handleSaveRoomName}
              isLoading={isEditRoomLoading}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Progress,
  ScrollShadow,
} from "@heroui/react";
import { getAllRooms } from "@/actions/recruitmentActions";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import localFont from "next/font/local";

const conthrax = localFont({
  src: "../../../../public/fonts/Conthrax-SemiBold.otf",
  variable: "--font-conthrax",
  display: "swap",
});

export default function RecruitmentStatus() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchRooms = useCallback(async () => {
    try {
      const result = await getAllRooms();
      if (result.success) {
        setRooms(result.rooms);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, []);

  // Fetch on mount and set up polling
  useEffect(() => {
    fetchRooms();
    setLoading(false);

    // Poll for updates every 1 second for real-time feel
    const interval = setInterval(fetchRooms, 1000);

    return () => clearInterval(interval);
  }, [fetchRooms]);

  const getOverallStats = () => {
    let totalPanels = 0;
    let busyPanels = 0;

    rooms.forEach((room) => {
      room.panels.forEach((panel) => {
        totalPanels++;
        if (panel.status === "busy") busyPanels++;
      });
    });

    return { totalPanels, busyPanels, freePanels: totalPanels - busyPanels };
  };

  const stats = getOverallStats();
  const occupancyPercentage =
    stats.totalPanels > 0
      ? Math.round((stats.busyPanels / stats.totalPanels) * 100)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-100 via-background-200 to-background-100 flex items-center justify-center p-6">
        <Card className="bg-background-200/90 border border-primary/30 backdrop-blur-md">
          <CardBody className="p-8">
            <p className="text-foreground">Loading recruitment status...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-100 via-background-200 to-background-100 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link href="/recruitment">
              <Button
                isIconOnly
                variant="flat"
                className="bg-background-200/80 border border-primary/40 text-primary hover:border-primary/60 hover:bg-background-200/90 flex-shrink-0"
              >
                <FiArrowLeft size={20} />
              </Button>
            </Link>
            <div className="flex-1 sm:flex-none">
              <h1
                className={`${conthrax.className} text-2xl sm:text-3xl font-bold text-primary line-clamp-2`}
              >
                Live Recruitment Status
              </h1>
              <p className="text-foreground/70 text-xs sm:text-sm">
                Real-time panel status across all rooms
              </p>
            </div>
          </div>
          <Chip
            color="primary"
            variant="flat"
            size="sm"
            className="bg-primary/20 text-primary border border-primary/40 text-xs sm:text-sm"
          >
            Updated: {lastUpdate.toLocaleTimeString()}
          </Chip>
        </div>

        {/* Overall Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
          <Card className="bg-background-200/80 border border-primary/30 backdrop-blur-md">
            <CardBody className="p-3 sm:p-5 text-center">
              <p className="text-foreground/70 text-xs mb-2">Total Panels</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {stats.totalPanels}
              </p>
            </CardBody>
          </Card>

          <Card className="bg-background-200/80 border border-primary/30 backdrop-blur-md">
            <CardBody className="p-3 sm:p-5 text-center">
              <p className="text-foreground/70 text-xs mb-2">Free Panels</p>
              <p className="text-2xl sm:text-3xl font-bold text-secondary">
                {stats.freePanels}
              </p>
            </CardBody>
          </Card>

          <Card className="bg-background-200/80 border border-primary/30 backdrop-blur-md">
            <CardBody className="p-3 sm:p-5 text-center">
              <p className="text-foreground/70 text-xs mb-2">Busy Panels</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {stats.busyPanels}
              </p>
            </CardBody>
          </Card>

          <Card className="bg-background-200/80 border border-primary/30 backdrop-blur-md">
            <CardBody className="p-3 sm:p-5 text-center">
              <p className="text-foreground/70 text-xs mb-2">Total Rooms</p>
              <p className="text-2xl sm:text-3xl font-bold text-secondary">
                {rooms.length}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Occupancy Bar */}
        <Card className="bg-background-200/80 border border-primary/30 backdrop-blur-md mb-6">
          <CardBody className="p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
              <p className="text-foreground/70 text-xs sm:text-sm font-medium">
                Overall Occupancy
              </p>
              <Chip
                size="sm"
                className="bg-primary/20 text-primary border border-primary/40 text-xs"
              >
                {occupancyPercentage}%
              </Chip>
            </div>
            <Progress value={occupancyPercentage} color="primary" />
          </CardBody>
        </Card>

        {/* Rooms Grid Layout */}
        {rooms.length === 0 ? (
          <Card className="bg-background-200/80 border border-primary/30 backdrop-blur-md">
            <CardBody className="p-12 text-center">
              <p className="text-foreground/60 mb-4">
                No rooms configured yet.
              </p>
              <Link href="/recruitment" className="inline-block">
                <Button
                  color="primary"
                  className="bg-primary text-background-200 font-semibold"
                >
                  Configure Rooms
                </Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => {
              const roomBusyPanels = room.panels.filter(
                (p) => p.status === "busy"
              ).length;
              const roomFreePanels = room.panels.length - roomBusyPanels;
              const roomOccupancy =
                room.panels.length > 0
                  ? Math.round((roomBusyPanels / room.panels.length) * 100)
                  : 0;

              return (
                <Card
                  key={room.roomId}
                  className="bg-background-200/80 border border-primary/30 backdrop-blur-md hover:border-primary/50 transition-all"
                >
                  <CardHeader className="flex justify-between items-start border-b border-primary/20 pb-2 sm:pb-3">
                    <div className="flex-1">
                      <h2
                        className={`${conthrax.className} text-lg sm:text-xl font-bold text-primary mb-1`}
                      >
                        {room.name}
                      </h2>
                      <p className="text-foreground/60 text-xs">
                        {room.panels.length} Panel
                        {room.panels.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </CardHeader>

                  <CardBody className="p-3 sm:p-4">
                    {/* Room Stats Bar */}
                    <div className="mb-3 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-foreground/70">Occupancy</span>
                        <span className="text-primary font-semibold">
                          {roomOccupancy}%
                        </span>
                      </div>
                      <Progress
                        value={roomOccupancy}
                        color="primary"
                        size="sm"
                      />
                      <div className="flex gap-1.5 sm:gap-2">
                        <Chip
                          size="sm"
                          className="flex-1 text-center bg-background-100/60 text-secondary border border-secondary/30 text-xs"
                        >
                          Free: {roomFreePanels}
                        </Chip>
                        <Chip
                          size="sm"
                          className="flex-1 text-center bg-background-100/60 text-primary border border-primary/30 text-xs"
                        >
                          Busy: {roomBusyPanels}
                        </Chip>
                      </div>
                    </div>

                    {/* Panels Grid */}
                    <ScrollShadow
                      hideScrollBar
                      className="w-full overflow-x-auto mb-3"
                      orientation="horizontal"
                      size={0}
                    >
                      <div className="flex justify-start items-start gap-4 pb-2">
                        {room.panels.map((panel) => {
                          const isBusy = panel.status === "busy";
                          const branchName = panel.branch;
                          const truncatedBranch =
                            branchName.length > 12
                              ? branchName.substring(0, 12) + "..."
                              : branchName;

                          return (
                            <Link
                              key={panel.id}
                              href={`/recruitment/${room.roomId}`}
                            >
                              <Card
                                className={`border-2 backdrop-blur-md transition-all cursor-pointer h-20 flex-shrink-0 min-w-fit ${
                                  isBusy
                                    ? "bg-red-500/20 border-red-500/50 hover:border-red-500/70"
                                    : "bg-cyan-500/20 border-cyan-500/50 hover:border-cyan-500/70"
                                }`}
                                isPressable
                              >
                                <CardBody className="p-3 flex flex-col items-center justify-center gap-2 h-full w-auto">
                                  <h4 className="font-bold text-foreground text-center text-xs leading-tight whitespace-nowrap">
                                    {panel.name}
                                  </h4>
                                  <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                    <Chip
                                      size="xs"
                                      variant="flat"
                                      className="bg-background-100/60 text-foreground/80 text-xs px-2 truncate"
                                    >
                                      {truncatedBranch}
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
                                  </div>
                                </CardBody>
                              </Card>
                            </Link>
                          );
                        })}
                      </div>
                    </ScrollShadow>

                    {/* Room Navigation */}
                    <Link
                      href={`/recruitment/${room.roomId}`}
                      className="block"
                    >
                      <Button
                        size="sm"
                        fullWidth
                        className="bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 font-semibold text-xs sm:text-sm"
                        variant="bordered"
                      >
                        Manage Room
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

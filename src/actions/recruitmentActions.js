"use server";

import Recruitment from "@/models/recruitmentModel";
import { connectDB } from "@/utils/db";

// Create or update rooms configuration
export async function configureRooms(roomsData) {
  try {
    await connectDB();

    // Delete existing rooms
    await Recruitment.deleteMany({});

    // Create new rooms with their panels
    const createdRooms = await Promise.all(
      roomsData.map(async (room) => {
        const newRoom = new Recruitment({
          roomId: room.roomId,
          name: room.name,
          branchOrTeam: room.branchOrTeam,
          panels: room.panels.map((panel, idx) => ({
            id: `panel-${idx + 1}`,
            name: panel.name,
            branch: panel.branch,
            status: "free",
          })),
        });
        return newRoom.save();
      })
    );

    return {
      success: true,
      rooms: createdRooms,
    };
  } catch (error) {
    console.error("Error configuring rooms:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Get all rooms with their panels
export async function getAllRooms() {
  try {
    await connectDB();
    const rooms = await Recruitment.find({}).sort({ createdAt: 1 });
    return {
      success: true,
      rooms: JSON.parse(JSON.stringify(rooms)),
    };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Get a specific room
export async function getRoom(roomId) {
  try {
    await connectDB();
    const room = await Recruitment.findOne({ roomId });

    if (!room) {
      return {
        success: false,
        error: "Room not found",
      };
    }

    return {
      success: true,
      room: JSON.parse(JSON.stringify(room)),
    };
  } catch (error) {
    console.error("Error fetching room:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Update panel status
export async function updatePanelStatus(roomId, panelId, status) {
  try {
    await connectDB();

    const room = await Recruitment.findOne({ roomId });

    if (!room) {
      return {
        success: false,
        error: "Room not found",
      };
    }

    const panel = room.panels.find((p) => p.id === panelId);

    if (!panel) {
      return {
        success: false,
        error: "Panel not found",
      };
    }

    panel.status = status;
    panel.updatedAt = new Date();
    room.updatedAt = new Date();

    await room.save();

    return {
      success: true,
      room: JSON.parse(JSON.stringify(room)),
    };
  } catch (error) {
    console.error("Error updating panel status:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Delete a room
export async function deleteRoom(roomId) {
  try {
    await connectDB();

    const result = await Recruitment.deleteOne({ roomId });

    if (result.deletedCount === 0) {
      return {
        success: false,
        error: "Room not found",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting room:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Update a panel
export async function updatePanel(roomId, panelId, panelData) {
  try {
    await connectDB();

    const room = await Recruitment.findOne({ roomId });

    if (!room) {
      return {
        success: false,
        error: "Room not found",
      };
    }

    const panel = room.panels.find((p) => p.id === panelId);

    if (!panel) {
      return {
        success: false,
        error: "Panel not found",
      };
    }

    panel.name = panelData.name || panel.name;
    panel.branch = panelData.branch || panel.branch;
    panel.updatedAt = new Date();
    room.updatedAt = new Date();

    await room.save();

    return {
      success: true,
      room: JSON.parse(JSON.stringify(room)),
    };
  } catch (error) {
    console.error("Error updating panel:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Delete a panel
export async function deletePanel(roomId, panelId) {
  try {
    await connectDB();

    const room = await Recruitment.findOne({ roomId });

    if (!room) {
      return {
        success: false,
        error: "Room not found",
      };
    }

    const panelIndex = room.panels.findIndex((p) => p.id === panelId);

    if (panelIndex === -1) {
      return {
        success: false,
        error: "Panel not found",
      };
    }

    if (room.panels.length <= 1) {
      return {
        success: false,
        error: "Cannot delete the last panel in a room",
      };
    }

    room.panels.splice(panelIndex, 1);
    room.updatedAt = new Date();

    await room.save();

    return {
      success: true,
      room: JSON.parse(JSON.stringify(room)),
    };
  } catch (error) {
    console.error("Error deleting panel:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Update room name
export async function updateRoomName(roomId, newName) {
  try {
    await connectDB();

    const room = await Recruitment.findOne({ roomId });

    if (!room) {
      return {
        success: false,
        error: "Room not found",
      };
    }

    room.name = newName;
    room.updatedAt = new Date();

    await room.save();

    return {
      success: true,
      room: JSON.parse(JSON.stringify(room)),
    };
  } catch (error) {
    console.error("Error updating room name:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

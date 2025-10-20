# Recruitment Management System

A comprehensive real-time recruitment management system built with Next.js and MongoDB to track the status of recruitment panels across multiple rooms and branches.

## Features

### 1. **Room Configuration** (`/recruitment`)

- Set up the number of recruitment rooms for each branch/team
- Configure room names and assign branches/teams (room-level)
- Add multiple panels per room
- **Assign a branch to each individual panel** - panels in the same room can belong to different branches!
- Edit panel names and branches
- Save configuration to MongoDB (replaces previous configuration)

### 2. **Individual Room Management** (`/recruitment/[roomId]`)

- View all panels in a specific room with their assigned branches
- Toggle panel status between **FREE** and **BUSY**
- Real-time polling (updates every 2 seconds)
- Color-coded status indicators:
  - 🟢 **GREEN** = FREE
  - 🔴 **RED** = BUSY
- Displays branch information for each panel
- Room statistics showing total, free, and busy panels
- Easy-to-use toggle buttons for quick status updates

### 3. **Live Status Dashboard** (`/recruitment/status`)

- View all rooms and panels in a single dashboard
- Display branch for each panel
- Real-time updates (polling every 1 second)
- Overall statistics for all panels
- Room-level statistics (free/busy counts)
- Last updated timestamp
- Click on any panel to navigate to its room's management page

## System Architecture

### Database Schema

#### **Recruitment Model**

```javascript
{
  roomId: String (unique),
  name: String,
  branchOrTeam: String, // Room-level branch (for reference)
  panels: [
    {
      id: String,
      name: String,
      branch: String, // Each panel has its own branch
      status: "free" | "busy",
      updatedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Server Actions (`src/actions/recruitmentActions.js`)

1. **configureRooms(roomsData)**

   - Creates new rooms with their panels
   - Deletes existing configuration before creating new ones
   - Returns: `{ success: boolean, rooms: Array, error?: string }`

2. **getAllRooms()**

   - Fetches all configured rooms with their panels
   - Returns: `{ success: boolean, rooms: Array, error?: string }`

3. **getRoom(roomId)**

   - Fetches a specific room by ID
   - Returns: `{ success: boolean, room: Object, error?: string }`

4. **updatePanelStatus(roomId, panelId, status)**

   - Updates a panel's status to "free" or "busy"
   - Returns: `{ success: boolean, room: Object, error?: string }`

5. **deleteRoom(roomId)**
   - Deletes a specific room
   - Returns: `{ success: boolean, error?: string }`

## Usage Flow

### Step 1: Initial Setup

1. Navigate to `/recruitment`
2. Click "Setup Rooms"
3. Enter the number of rooms needed (1-20)
4. For each room:
   - Enter a room name (e.g., "Tech Interview Room")
   - Select the branch/team (CSE, ECE, ME, CE, General)
   - Add panels (e.g., Panel A, Panel B, Panel C)
5. Click "Save Configuration"

### Step 2: Manage Individual Rooms

1. From `/recruitment`, click "Manage Panels" on a room card
2. Or navigate directly to `/recruitment/[roomId]`
3. View all panels in the room
4. Click "Mark Busy" or "Mark Free" to toggle status
5. Changes are synced in real-time

### Step 3: Monitor Live Status

1. Navigate to `/recruitment/status`
2. View all rooms and panels on a single page
3. See real-time statistics
4. Click on any panel to jump to its room's management page

## Real-Time Features

### Polling Strategy

- **Room Management**: Polls every 2 seconds for updates
- **Status Dashboard**: Polls every 1 second for fresher updates
- Updates triggered when:
  - User manually changes panel status
  - Another user updates a panel in the same room
  - Configuration is saved

### Automatic Synchronization

- All changes are immediately saved to MongoDB
- Every connected client polls the database for updates
- No manual refresh needed

## Component Locations

```
src/
├── app/
│   └── recruitment/
│       ├── page.jsx              # Main setup page
│       ├── status/
│       │   └── page.jsx          # Live status dashboard
│       └── [roomId]/
│           └── page.jsx          # Individual room management
├── models/
│   └── recruitmentModel.js       # MongoDB schema
└── actions/
    └── recruitmentActions.js     # Server actions
```

## Technology Stack

- **Frontend**: Next.js 15.4.5, React, HeroUI
- **Backend**: Next.js Server Actions
- **Database**: MongoDB with Mongoose
- **Real-Time**: Client-side polling mechanism
- **Styling**: Tailwind CSS

## Future Enhancements

1. **WebSocket Integration**: Replace polling with WebSocket for true real-time updates
2. **Panel History**: Track history of panel status changes
3. **Timer**: Add interview duration tracking
4. **Notes**: Add notes/comments for each panel
5. **Notifications**: Toast notifications when panel status changes
6. **Export**: Export recruitment data and statistics
7. **Mobile App**: Dedicated mobile app for easy status updates
8. **User Roles**: Different permissions for admins vs. interviewers

## Environment Setup

1. Ensure MongoDB is connected in `src/lib/db.js`
2. Add the Recruitment model to your database
3. The system is ready to use at `/recruitment` route

## Notes

- Configuration replacement: When you save a new configuration, the old one is deleted
- Panel IDs are auto-generated as `panel-1`, `panel-2`, etc.
- Room IDs should be unique (handled automatically with format `room-1`, `room-2`, etc.)
- Status updates are transactional and saved to MongoDB immediately

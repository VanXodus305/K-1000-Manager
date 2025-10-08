"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import TableHeader from "./TableHeader";
import MembersTable from "./MembersTable";
import MemberFormModal from "./MemberFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ViewMemberModal from "./ViewMemberModal";
import {
  addMember,
  updateMember,
  deleteMembers,
} from "@/actions/memberActions";

export default function DashboardContent({ initialMembers = [] }) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState({
    column: null,
    direction: null,
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and search members
  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter(
        (member) =>
          member.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          member.rollNo
            ?.toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          member.branch?.toLowerCase().includes(searchValue.toLowerCase()) ||
          member.subdomain?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply vertical filter (multiselect)
    if (filterBy.size > 0 && filterBy !== "all") {
      const filterArray = Array.from(filterBy);
      filtered = filtered.filter((member) =>
        filterArray.some(
          (filter) => member.vertical?.toLowerCase() === filter.toLowerCase()
        )
      );
    }

    return filtered;
  }, [members, searchValue, filterBy]);

  // Handle add member
  const handleAddMember = async (newMemberData) => {
    setIsLoading(true);
    try {
      const result = await addMember(newMemberData);
      if (result.success) {
        router.refresh();
        // Optimistically update UI
        setMembers([...members, result.member]);
      } else {
        console.error("Error adding member:", result.error);
        alert("Failed to add member: " + result.error);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit member
  const handleEditMember = async (updatedMemberData) => {
    setIsLoading(true);
    try {
      const result = await updateMember(
        updatedMemberData.id,
        updatedMemberData
      );
      if (result.success) {
        router.refresh();
        // Optimistically update UI
        setMembers(
          members.map((member) =>
            member.id === updatedMemberData.id ? result.member : member
          )
        );
      } else {
        console.error("Error updating member:", result.error);
        alert("Failed to update member: " + result.error);
      }
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Failed to update member");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete selected members
  const handleDeleteSelected = async () => {
    setIsLoading(true);
    try {
      const selectedArray = Array.from(selectedKeys);
      const result = await deleteMembers(selectedArray);
      if (result.success) {
        router.refresh();
        // Optimistically update UI
        setMembers(
          members.filter((member) => !selectedArray.includes(member.id))
        );
        setSelectedKeys(new Set([]));
      } else {
        console.error("Error deleting members:", result.error);
        alert("Failed to delete members: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting members:", error);
      alert("Failed to delete members");
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Open edit modal with member data
  const openEditModal = (member) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  // Open view modal with member data
  const openViewModal = (member) => {
    setViewingMember(member);
    setIsViewModalOpen(true);
  };

  const selectedCount =
    selectedKeys === "all" ? members.length : selectedKeys.size;

  return (
    <div className="container mx-auto px-6 py-8">
      <TableHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        selectedCount={selectedCount}
        onDeleteSelected={() => setIsDeleteModalOpen(true)}
        onAddMember={() => setIsAddModalOpen(true)}
      />

      <MembersTable
        members={filteredMembers}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        onEdit={openEditModal}
        onView={openViewModal}
      />

      {/* Add Member Modal */}
      <MemberFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMember}
        mode="add"
        isLoading={isLoading}
      />

      {/* Edit Member Modal */}
      <MemberFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleEditMember}
        member={editingMember}
        mode="edit"
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSelected}
        count={selectedCount}
        isLoading={isLoading}
      />

      {/* View Member Modal */}
      <ViewMemberModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingMember(null);
        }}
        member={viewingMember}
      />
    </div>
  );
}

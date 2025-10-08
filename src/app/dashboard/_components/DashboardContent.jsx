"use client";

import { useState, useMemo } from "react";
import TableHeader from "./TableHeader";
import MembersTable from "./MembersTable";
import MemberFormModal from "./MemberFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { dummyMembers } from "@/lib/dummyData";

export default function DashboardContent() {
  const [members, setMembers] = useState(dummyMembers);
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
  const [editingMember, setEditingMember] = useState(null);

  // Filter and search members
  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          member.rollNo.toLowerCase().includes(searchValue.toLowerCase()) ||
          member.branch.toLowerCase().includes(searchValue.toLowerCase()) ||
          member.subdomain.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply vertical filter (multiselect)
    if (filterBy.size > 0 && filterBy !== "all") {
      const filterArray = Array.from(filterBy);
      filtered = filtered.filter((member) =>
        filterArray.some(
          (filter) => member.vertical.toLowerCase() === filter.toLowerCase()
        )
      );
    }

    return filtered;
  }, [members, searchValue, filterBy]);

  // Handle add member
  const handleAddMember = (newMember) => {
    const memberWithId = {
      ...newMember,
      id: (members.length + 1).toString(),
    };
    setMembers([...members, memberWithId]);
  };

  // Handle edit member
  const handleEditMember = (updatedMember) => {
    setMembers(
      members.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  // Handle delete selected members
  const handleDeleteSelected = () => {
    const selectedArray = Array.from(selectedKeys);
    setMembers(members.filter((member) => !selectedArray.includes(member.id)));
    setSelectedKeys(new Set([]));
  };

  // Open edit modal with member data
  const openEditModal = (member) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
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
      />

      {/* Add Member Modal */}
      <MemberFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMember}
        mode="add"
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
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSelected}
        count={selectedCount}
      />
    </div>
  );
}

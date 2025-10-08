"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Chip,
  Pagination,
} from "@heroui/react";
import { FiEdit2, FiEye } from "react-icons/fi";
import localFont from "next/font/local";

const conthrax = localFont({
  src: "../../../../public/fonts/Conthrax-SemiBold.otf",
  variable: "--font-conthrax",
  display: "swap",
});

export default function MembersTable({
  members,
  selectedKeys,
  setSelectedKeys,
  sortDescriptor,
  setSortDescriptor,
  onEdit,
  onView,
}) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "year", label: "Year", sortable: true },
    { key: "branch", label: "Branch", sortable: true },
    { key: "rollNo", label: "Roll no.", sortable: true },
    { key: "vertical", label: "Vertical / Team", sortable: false },
    { key: "subdomain", label: "Sub Domain", sortable: false },
    { key: "actions", label: "", sortable: false },
  ];

  const renderCell = (member, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col gap-1">
            <span className="text-foreground font-medium">{member.name}</span>
            <span className="text-secondary/80 text-xs">
              {member.rollNo}@kiit.ac.in
            </span>
          </div>
        );
      case "year":
        return <span className="text-foreground/80">{member.year}</span>;
      case "branch":
        return <span className="text-foreground/80">{member.branch}</span>;
      case "rollNo":
        return <span className="text-foreground/80">{member.rollNo}</span>;
      case "vertical":
        return (
          <Chip
            size="sm"
            variant="flat"
            className="bg-primary/20 text-primary border border-primary/30"
          >
            {member.vertical}
          </Chip>
        );
      case "subdomain":
        return <span className="text-foreground/80">{member.subdomain}</span>;
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onView(member)}
              className="text-foreground/60 hover:text-primary hover:bg-primary/10"
            >
              <FiEye size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onEdit(member)}
              className="text-foreground/60 hover:text-primary hover:bg-primary/10"
            >
              <FiEdit2 size={16} />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const sortedMembers = React.useMemo(() => {
    if (!sortDescriptor.column) return members;

    return [...members].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [members, sortDescriptor]);

  // Pagination logic
  const pages = Math.ceil(sortedMembers.length / rowsPerPage);

  const paginatedMembers = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedMembers.slice(start, end);
  }, [page, sortedMembers, rowsPerPage]);

  return (
    <Table
      aria-label="Members table"
      selectionMode="multiple"
      color="primary"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      bottomContent={
        pages > 1 ? (
          <div className="flex w-full justify-center">
            <Pagination
              showControls
              loop
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
              classNames={{
                base: "mt-2 pb-5",
                item: "bg-background-200/60 backdrop-blur-md border border-primary/20 text-foreground",
                cursor:
                  "bg-primary text-background-200 font-semibold shadow-lg",
                prev: "bg-background-200/60 backdrop-blur-md border border-primary/20 text-foreground hover:bg-primary/20",
                next: "bg-background-200/60 backdrop-blur-md border border-primary/20 text-foreground hover:bg-primary/20",
              }}
            />
          </div>
        ) : null
      }
      classNames={{
        base: "max-h-[calc(100vh-150px)]",
        wrapper:
          "bg-background-200/60 backdrop-blur-md border border-primary/20 rounded-xl shadow-lg",
        th: "bg-primary/80 text-background-200 font-semibold text-sm first:rounded-tl-lg last:rounded-tr-lg data-[hover=true]:text-secondary",
        td: "text-foreground/90",
        tr: "data-[selected=true]:bg-transparent data-[odd=true]:bg-secondary/10 transition-colors border-b border-primary/10 last:border-b-0",
      }}
      checkboxesProps={{
        classNames: {
          wrapper:
            "after:bg-primary after:border-background-200 before:border-primary group-data-[selected=true]:border-background-200",
        },
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            allowsSorting={column.sortable}
            className={`text-left ${conthrax.className} text-[13px]`}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={paginatedMembers} emptyContent="No members found">
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

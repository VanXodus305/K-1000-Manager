"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Pagination,
  Avatar,
  Tooltip,
} from "@heroui/react";
import { FiEdit2, FiEye } from "react-icons/fi";
import {
  FaCrown,
  FaUserTie,
  FaUserShield,
  FaUsersCog,
  FaChartLine,
  FaStar,
  FaCode,
  FaShieldAlt,
  FaAward,
  FaUser,
} from "react-icons/fa";
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
  const rowsPerPage = 10;

  // Reset page to 1 when members array changes (search/filter applied)
  React.useEffect(() => {
    setPage(1);
  }, [members]);

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "year", label: "Year", sortable: true },
    { key: "branch", label: "Branch", sortable: true },
    { key: "rollNo", label: "Roll no.", sortable: true },
    { key: "vertical", label: "Vertical / Team", sortable: false },
    { key: "subdomain", label: "Domain", sortable: false },
    { key: "actions", label: "", sortable: false },
  ];

  // Helper function to get full form of vertical abbreviations
  const getVerticalTooltip = (vertical) => {
    const tooltips = {
      OTI: "Office of Technology & Innovation",
      OSG: "Office of Strategy & Growth",
      OCD: "Office of Creativity & Design",
    };
    return tooltips[vertical] || null;
  };

  // Helper function to get full form of role abbreviations
  const getRoleTooltip = (role) => {
    const tooltips = {
      CTO: "Chief Technology Officer",
      CCO: "Chief Creative Officer",
      CSO: "Chief Strategy Officer",
    };
    return tooltips[role] || null;
  };

  // Helper function to format year number to ordinal string
  const formatYear = (year) => {
    if (!year) return "-";

    const suffixes = {
      1: "st",
      2: "nd",
      3: "rd",
      4: "th",
      5: "th",
    };

    return `${year}${suffixes[year] || "th"}`;
  };

  // Helper function to format special role
  const formatSpecialRole = (role) => {
    if (!role) return null;

    // Handle special cases for acronyms
    const formatted = role
      .split("-")
      .map((word) => {
        // Keep CTO, CCO, CSO as all caps
        if (
          word.toLowerCase() === "cto" ||
          word.toLowerCase() === "cco" ||
          word.toLowerCase() === "cso"
        ) {
          return word.toUpperCase();
        }
        // Title case for other words
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

    return formatted;
  };

  // Helper function to get role-specific styling and icon
  const getRoleConfig = (role) => {
    const configs = {
      president: {
        icon: FaCrown,
        bgColor: "bg-amber-500/20",
        textColor: "text-amber-500",
        borderColor: "border-amber-500/40",
      },
      "vice-president": {
        icon: FaCrown,
        bgColor: "bg-amber-400/20",
        textColor: "text-amber-400",
        borderColor: "border-amber-400/40",
      },
      "general-secretary": {
        icon: FaUserTie,
        bgColor: "bg-blue-500/20",
        textColor: "text-blue-500",
        borderColor: "border-blue-500/40",
      },
      "joint-secretary": {
        icon: FaUserTie,
        bgColor: "bg-blue-400/20",
        textColor: "text-blue-400",
        borderColor: "border-blue-400/40",
      },
      director: {
        icon: FaUserShield,
        bgColor: "bg-purple-500/20",
        textColor: "text-purple-500",
        borderColor: "border-purple-500/40",
      },
      "deputy-director": {
        icon: FaUserShield,
        bgColor: "bg-purple-400/20",
        textColor: "text-purple-400",
        borderColor: "border-purple-400/40",
      },
      cto: {
        icon: FaCode,
        bgColor: "bg-green-500/20",
        textColor: "text-green-500",
        borderColor: "border-green-500/40",
      },
      "deputy-cto": {
        icon: FaCode,
        bgColor: "bg-green-400/20",
        textColor: "text-green-400",
        borderColor: "border-green-400/40",
      },
      cso: {
        icon: FaShieldAlt,
        bgColor: "bg-red-500/20",
        textColor: "text-red-500",
        borderColor: "border-red-500/40",
      },
      "deputy-cso": {
        icon: FaShieldAlt,
        bgColor: "bg-red-400/20",
        textColor: "text-red-400",
        borderColor: "border-red-400/40",
      },
      cco: {
        icon: FaUsersCog,
        bgColor: "bg-indigo-500/20",
        textColor: "text-indigo-500",
        borderColor: "border-indigo-500/40",
      },
      "deputy-cco": {
        icon: FaUsersCog,
        bgColor: "bg-indigo-400/20",
        textColor: "text-indigo-400",
        borderColor: "border-indigo-400/40",
      },
      lead: {
        icon: FaStar,
        bgColor: "bg-pink-500/20",
        textColor: "text-pink-500",
        borderColor: "border-pink-500/40",
      },
    };

    return (
      configs[role] || {
        icon: FaAward,
        bgColor: "bg-secondary/20",
        textColor: "text-secondary",
        borderColor: "border-secondary/40",
      }
    );
  };

  const renderCell = (member, columnKey) => {
    switch (columnKey) {
      case "name":
        const roleConfig = member.specialRole
          ? getRoleConfig(member.specialRole)
          : null;
        const RoleIcon = roleConfig?.icon;

        return (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <Avatar
              src={member.profileImage}
              icon={<FaUser size={20} />}
              name={member.name}
              size="md"
              color="primary"
              classNames={{
                base: "shrink-0 border-2 border-primary/30",
                icon: "text-foreground/30",
              }}
            />

            {/* Name and Role */}
            <div className="flex flex-col gap-1">
              <span className="text-foreground font-medium">
                {member.name || "-"}
              </span>
              {member.specialRole &&
                roleConfig &&
                (() => {
                  const formattedRole = formatSpecialRole(member.specialRole);
                  const roleWords = formattedRole.split(" ");
                  const hasAcronym = roleWords.some(
                    (word) => word === "CTO" || word === "CCO" || word === "CSO"
                  );
                  const acronym = roleWords.find(
                    (word) => word === "CTO" || word === "CCO" || word === "CSO"
                  );
                  const roleTooltip = acronym ? getRoleTooltip(acronym) : null;

                  return roleTooltip ? (
                    <Tooltip content={roleTooltip} delay={300}>
                      <Chip
                        size="sm"
                        variant="flat"
                        startContent={
                          RoleIcon && <RoleIcon className="ml-1" size={12} />
                        }
                        className={`${roleConfig.bgColor} ${roleConfig.textColor} border ${roleConfig.borderColor} font-semibold w-fit cursor-help`}
                      >
                        {formattedRole}
                      </Chip>
                    </Tooltip>
                  ) : (
                    <Chip
                      size="sm"
                      variant="flat"
                      startContent={
                        RoleIcon && <RoleIcon className="ml-1" size={12} />
                      }
                      className={`${roleConfig.bgColor} ${roleConfig.textColor} border ${roleConfig.borderColor} font-semibold w-fit`}
                    >
                      {formattedRole}
                    </Chip>
                  );
                })()}
            </div>
          </div>
        );
      case "year":
        return (
          <span className="text-foreground/80">{formatYear(member.year)}</span>
        );
      case "branch":
        return (
          <span className="text-foreground/80">{member.branch || "-"}</span>
        );
      case "rollNo":
        return (
          <span className="text-foreground/80">{member.rollNo || "-"}</span>
        );
      case "vertical":
        const verticalTooltip = member.vertical
          ? getVerticalTooltip(member.vertical)
          : null;

        return member.vertical ? (
          verticalTooltip ? (
            <Tooltip content={verticalTooltip} delay={300}>
              <Chip
                size="sm"
                variant="flat"
                className="bg-primary/20 text-primary border border-primary/30 cursor-help"
              >
                {member.vertical}
              </Chip>
            </Tooltip>
          ) : (
            <Chip
              size="sm"
              variant="flat"
              className="bg-primary/20 text-primary border border-primary/30"
            >
              {member.vertical}
            </Chip>
          )
        ) : (
          <span className="text-foreground/40">-</span>
        );
      case "subdomain":
        return (
          <span className="text-foreground/80">{member.subdomain || "-"}</span>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="View Details" showArrow delay={500}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onView(member)}
                className="text-foreground/60 hover:text-primary hover:bg-primary/10"
              >
                <FiEye size={16} />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Member" showArrow delay={500}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onEdit(member)}
                className="text-foreground/60 hover:text-primary hover:bg-primary/10"
              >
                <FiEdit2 size={16} />
              </Button>
            </Tooltip>
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
    <>
      <Table
        aria-label="Members table"
        selectionMode="multiple"
        color="primary"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
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

      {/* Pagination outside table */}
      {pages > 1 && (
        <div className="flex w-full justify-center mt-4">
          <Pagination
            showControls
            loop
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
            classNames={{
              item: "bg-background-200/60 backdrop-blur-md border border-primary/20 text-foreground",
              cursor: "bg-primary text-background-200 font-semibold shadow-lg",
              prev: "bg-background-200/60 backdrop-blur-md border border-primary/20 text-foreground hover:bg-primary/20",
              next: "bg-background-200/60 backdrop-blur-md border border-primary/20 text-foreground hover:bg-primary/20",
              base: "pb-5",
            }}
          />
        </div>
      )}
    </>
  );
}

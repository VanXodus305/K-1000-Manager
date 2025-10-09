"use client";

import { Input, Select, SelectItem, Button } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import localFont from "next/font/local";

const conthrax = localFont({
  src: "../../../../public/fonts/Conthrax-SemiBold.otf",
  variable: "--font-conthrax",
  display: "swap",
});

export default function TableHeader({
  searchValue,
  onSearchChange,
  filterBy,
  onFilterChange,
  selectedCount,
  onDeleteSelected,
  onAddMember,
}) {
  const filterOptions = [
    { key: "operations", label: "Operations" },
    { key: "oti", label: "OTI" },
    { key: "osg", label: "OSG" },
    { key: "ocd", label: "OCD" },
    { key: "public relations", label: "Public Relations" },
    { key: "campus ambassadors", label: "Campus Ambassadors" },
    {
      key: "academic & internship guidance",
      label: "Academic & Internship Guidance",
    },
    { key: "research & publications", label: "Research & Publications" },
    { key: "training program", label: "Training Program" },
    { key: "higher studies", label: "Higher Studies" },
    { key: "project wing", label: "Project Wing" },
    { key: "event management", label: "Event Management" },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1
            className={`${conthrax.className} text-2xl sm:text-3xl font-bold text-foreground/90`}
          >
            Details of Members
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {selectedCount > 0 ? (
            <Button
              color="danger"
              variant="flat"
              startContent={<MdDeleteOutline size={20} />}
              onPress={onDeleteSelected}
              className="bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30"
            >
              Delete {selectedCount > 1 ? "All" : ""}
            </Button>
          ) : (
            <Button
              color="primary"
              startContent={<IoMdAdd size={20} />}
              onPress={onAddMember}
              className="bg-primary text-background-200 font-semibold hover:bg-primary/90"
            >
              Add Member
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-96">
          <Input
            placeholder="Search in table"
            isClearable
            value={searchValue}
            onValueChange={onSearchChange}
            startContent={<FiSearch className="text-foreground/50" size={18} />}
            classNames={{
              base: "w-full",
              mainWrapper: "h-full",
              input: "text-foreground",
              inputWrapper:
                "h-12 bg-background-200/60 backdrop-blur-md border border-primary/20 hover:border-primary/40 focus-within:border-primary data-[hover=true]:bg-background-200/80",
            }}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Select
            label="Filter By Vertical / Team"
            // placeholder="Select vertical / team"
            selectionMode="multiple"
            selectedKeys={filterBy}
            isClearable
            color="primary"
            onSelectionChange={onFilterChange}
            classNames={{
              base: "w-full md:w-56",
              trigger:
                "h-12 bg-background-200/60 backdrop-blur-sm border border-primary/20 hover:border-primary/40 data-[hover=true]:bg-background-200/80",
              label: "text-foreground/70 text-sm",
              value: "text-foreground text-sm",
              popoverContent:
                "bg-background-200/95 backdrop-blur-sm border border-primary/30",
            }}
          >
            {filterOptions.map((option) => (
              <SelectItem
                key={option.key}
                value={option.key}
                color="primary"
                variant="flat"
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

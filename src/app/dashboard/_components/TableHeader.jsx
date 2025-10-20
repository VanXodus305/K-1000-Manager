"use client";

import {
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
  Chip,
} from "@heroui/react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { MdDeleteOutline, MdClose } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import { VERTICALS } from "@/constants/verticals";
import localFont from "next/font/local";

const conthrax = localFont({
  src: "../../../../public/fonts/Conthrax-SemiBold.otf",
  variable: "--font-conthrax",
  display: "swap",
});

export default function TableHeader({
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  selectedCount,
  onDeleteSelected,
  onAddMember,
  allMembers = [],
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique values from all members
  const yearOptions = [
    { value: "1st", label: "1st Year" },
    { value: "2nd", label: "2nd Year" },
    { value: "3rd", label: "3rd Year" },
    { value: "4th", label: "4th Year" },
    { value: "5th", label: "5th Year" },
  ];

  const branchOptions = [
    ...new Set(allMembers.map((m) => m.branch).filter(Boolean)),
  ]
    .sort()
    .map((branch) => ({
      value: branch.toLowerCase(),
      label: branch,
    }));

  const verticalOptions = VERTICALS.map((vertical) => ({
    value: vertical.toLowerCase(),
    label: vertical,
  }));

  const subdomainOptions = [
    ...new Set(allMembers.map((m) => m.subdomain).filter(Boolean)),
  ]
    .sort()
    .map((subdomain) => ({
      value: subdomain.toLowerCase(),
      label: subdomain,
    }));

  // Count active filters
  const activeFilterCount =
    (filters.years?.size || 0) +
    (filters.branches?.size || 0) +
    (filters.verticals?.size || 0) +
    (filters.subdomains?.size || 0);

  const clearAllFilters = () => {
    onFilterChange({
      years: new Set([]),
      branches: new Set([]),
      verticals: new Set([]),
      subdomains: new Set([]),
    });
  };

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

        <div className="flex gap-3 w-full md:w-auto items-center">
          <Popover
            isOpen={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            placement="bottom-end"
            classNames={{
              content:
                "bg-background-200/95 backdrop-blur-md border border-primary/30 p-0",
            }}
          >
            <PopoverTrigger>
              <Button
                variant="flat"
                startContent={<FiFilter size={18} />}
                endContent={
                  activeFilterCount > 0 ? (
                    <Chip
                      size="sm"
                      color="primary"
                      variant="flat"
                      className="h-5 min-w-5 px-1"
                    >
                      {activeFilterCount}
                    </Chip>
                  ) : null
                }
                className="h-12 bg-background-200/60 border border-primary/20 hover:border-primary/40 text-foreground"
              >
                Filter Members
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 min-w-72 max-w-72 p-0">
              <div className="flex flex-col w-full min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-primary/20 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate flex-shrink">
                    Filter Options
                  </h3>
                  {activeFilterCount > 0 && (
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={clearAllFilters}
                      startContent={<MdClose size={16} />}
                      className="h-7 min-w-0 px-2 flex-shrink-0"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Accordion Sections */}
                <div className="max-h-96 overflow-y-auto overflow-x-hidden w-full">
                  <Accordion
                    variant="light"
                    selectionMode="multiple"
                    className="px-3 py-1 w-full"
                  >
                    {/* Year Section */}
                    <AccordionItem
                      key="year"
                      title={
                        <div className="flex items-center justify-between w-full min-w-0 px-3">
                          <span className="text-sm font-medium text-foreground truncate flex-shrink mr-2">
                            Year
                          </span>
                          {filters.years.size > 0 && (
                            <Chip
                              size="sm"
                              color="primary"
                              variant="flat"
                              className="h-5 min-w-5 px-1 flex-shrink-0"
                            >
                              {filters.years.size}
                            </Chip>
                          )}
                        </div>
                      }
                      classNames={{
                        title: "text-sm w-full px-0",
                        content: "pb-3 pt-1 px-3",
                        base: "w-full",
                      }}
                    >
                      <CheckboxGroup
                        value={Array.from(filters.years)}
                        onValueChange={(values) =>
                          onFilterChange({
                            ...filters,
                            years: new Set(values),
                          })
                        }
                        classNames={{
                          wrapper: "gap-1.5 w-full",
                        }}
                      >
                        {yearOptions.map((option) => (
                          <Checkbox
                            key={option.value}
                            value={option.value}
                            size="sm"
                            classNames={{
                              base: "w-full max-w-full",
                              wrapper: "flex-shrink-0 before:border-primary",
                              label:
                                "text-sm text-foreground truncate flex-1 min-w-0",
                            }}
                          >
                            {option.label}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </AccordionItem>

                    {/* Branch Section */}
                    {branchOptions.length > 0 && (
                      <AccordionItem
                        key="branch"
                        title={
                          <div className="flex items-center justify-between w-full min-w-0 px-3">
                            <span className="text-sm font-medium text-foreground truncate flex-shrink mr-2">
                              Branch
                            </span>
                            {filters.branches.size > 0 && (
                              <Chip
                                size="sm"
                                color="primary"
                                variant="flat"
                                className="h-5 min-w-5 px-1 flex-shrink-0"
                              >
                                {filters.branches.size}
                              </Chip>
                            )}
                          </div>
                        }
                        classNames={{
                          title: "text-sm w-full px-0",
                          content: "pb-3 pt-1 px-3",
                          base: "w-full",
                        }}
                      >
                        <CheckboxGroup
                          value={Array.from(filters.branches)}
                          onValueChange={(values) =>
                            onFilterChange({
                              ...filters,
                              branches: new Set(values),
                            })
                          }
                          classNames={{
                            wrapper: "gap-1.5 w-full",
                          }}
                        >
                          {branchOptions.map((option) => (
                            <Checkbox
                              key={option.value}
                              value={option.value}
                              size="sm"
                              classNames={{
                                base: "w-full max-w-full",
                                wrapper: "flex-shrink-0 before:border-primary",
                                label:
                                  "text-sm text-foreground truncate flex-1 min-w-0",
                              }}
                            >
                              {option.label}
                            </Checkbox>
                          ))}
                        </CheckboxGroup>
                      </AccordionItem>
                    )}

                    {/* Vertical Section */}
                    <AccordionItem
                      key="vertical"
                      title={
                        <div className="flex items-center justify-between w-full min-w-0 px-3">
                          <span className="text-sm font-medium text-foreground truncate flex-shrink mr-2">
                            Vertical / Team
                          </span>
                          {filters.verticals.size > 0 && (
                            <Chip
                              size="sm"
                              color="primary"
                              variant="flat"
                              className="h-5 min-w-5 px-1 flex-shrink-0"
                            >
                              {filters.verticals.size}
                            </Chip>
                          )}
                        </div>
                      }
                      classNames={{
                        title: "text-sm w-full px-0",
                        content: "pb-3 pt-1 px-3",
                        base: "w-full",
                      }}
                    >
                      <CheckboxGroup
                        value={Array.from(filters.verticals)}
                        onValueChange={(values) =>
                          onFilterChange({
                            ...filters,
                            verticals: new Set(values),
                          })
                        }
                        classNames={{
                          wrapper: "gap-1.5 w-full",
                        }}
                      >
                        {verticalOptions.map((option) => (
                          <Checkbox
                            key={option.value}
                            value={option.value}
                            size="sm"
                            classNames={{
                              base: "w-full max-w-full",
                              wrapper: "flex-shrink-0 before:border-primary",
                              label:
                                "text-sm text-foreground truncate flex-1 min-w-0",
                            }}
                          >
                            {option.label}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </AccordionItem>

                    {/* Domain Section */}
                    {subdomainOptions.length > 0 && (
                      <AccordionItem
                        key="domain"
                        title={
                          <div className="flex items-center justify-between w-full min-w-0 px-3">
                            <span className="text-sm font-medium text-foreground truncate flex-shrink mr-2">
                              Domain
                            </span>
                            {filters.subdomains.size > 0 && (
                              <Chip
                                size="sm"
                                color="primary"
                                variant="flat"
                                className="h-5 min-w-5 px-1 flex-shrink-0"
                              >
                                {filters.subdomains.size}
                              </Chip>
                            )}
                          </div>
                        }
                        classNames={{
                          title: "text-sm w-full px-0",
                          content: "pb-3 pt-1 px-3",
                          base: "w-full",
                        }}
                      >
                        <CheckboxGroup
                          value={Array.from(filters.subdomains)}
                          onValueChange={(values) =>
                            onFilterChange({
                              ...filters,
                              subdomains: new Set(values),
                            })
                          }
                          classNames={{
                            wrapper: "gap-1.5 w-full",
                          }}
                        >
                          {subdomainOptions.map((option) => (
                            <Checkbox
                              key={option.value}
                              value={option.value}
                              size="sm"
                              classNames={{
                                base: "w-full max-w-full",
                                wrapper: "flex-shrink-0 before:border-primary",
                                label:
                                  "text-sm text-foreground truncate flex-1 min-w-0",
                              }}
                            >
                              {option.label}
                            </Checkbox>
                          ))}
                        </CheckboxGroup>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {selectedCount > 0 ? (
            <Button
              color="danger"
              variant="flat"
              startContent={<MdDeleteOutline size={20} />}
              onPress={onDeleteSelected}
              className="h-12 bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30"
            >
              Delete {selectedCount > 1 ? "All" : ""}
            </Button>
          ) : (
            <Button
              color="primary"
              startContent={<IoMdAdd size={20} />}
              onPress={onAddMember}
              className="h-12 bg-primary text-background-200 font-semibold hover:bg-primary/90"
            >
              Add Member
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

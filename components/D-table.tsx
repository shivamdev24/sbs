/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Columns3Icon,
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react";

// ---------------- SCHEMA ----------------
export const schema = z.object({
  id: z.number(),
  name: z.string(),
  contact: z.string(),
  service: z.string(),
  date: z.string(),
  time: z.string(),
  amount: z.string(),
});

type DataType = z.infer<typeof schema>;

// ---------------- DEFAULT COLUMNS ----------------

// ---------------- COMPONENT ----------------
export function DataTableA({
  data,
  columns,

  TableName,
}: {
  data: DataType[];
  columns?: ColumnDef<DataType>[];
  TableName: string;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // const defaultColumns: ColumnDef<DataType>[] = [
  //   // {
  //   //   accessorKey: "header",
  //   //   header: "Header",
  //   //   cell: ({ row }) => (
  //   //     <div className="font-medium">{row.original.header}</div>
  //   //   ),
  //   // },
  //   // {
  //   //   accessorKey: "type",
  //   //   header: "Type",
  //   // },
  //   // {
  //   //   accessorKey: "status",
  //   //   header: "Status",
  //   //   cell: ({ row }) => (
  //   //     <span className="capitalize text-sm">{row.original.status}</span>
  //   //   ),
  //   // },
  //   // {
  //   //   accessorKey: "target",
  //   //   header: "Target",
  //   // },
  //   // {
  //   //   accessorKey: "limit",
  //   //   header: "Limit",
  //   // },
  //   // {
  //   //   accessorKey: "reviewer",
  //   //   header: "Reviewer",
  //   // },
  //   {columns  },
  //   {
  //     accessorKey: "actions",
  //     header: "Actions",
  //     cell: ({ row }) => (
  //       <div>
  //         <Button variant="link" size="sm">
  //           View
  //         </Button>
  //         <Button variant="link" size="sm">
  //           Delete
  //         </Button>
  //         <Button variant="link" size="sm" className="text-destructive">
  //           Delete
  //         </Button>
  //       </div>
  //     ),
  //   },
  // ];

  const finalColumns = React.useMemo(() => {
    const mapped = (columns || []).map((col: any) => ({
      accessorKey: col.accessorKey,
      header: col.header,
      cell: ({ row }: any) =>
        renderCell(col.type, row.original[col.accessorKey]),
    }));

    return [
      ...mapped,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: any) => {
          const data = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {/* Edit */}
                <DropdownMenuCheckboxItem
                  onClick={() => console.log("Edit", data)}
                >
                  Edit
                </DropdownMenuCheckboxItem>

                {/* Delete */}
                <DropdownMenuCheckboxItem
                  onClick={() => console.log("Delete", data)}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, [columns]);

  const table = useReactTable({
    data: data.length ? data : [], // handles empty safely
    columns: finalColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Tabs defaultValue="table" className="w-full flex-col gap-6">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label className="text-lg">{TableName}</Label>

        <div className="flex items-center gap-2">
          {/* COLUMN TOGGLE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3Icon className="mr-2 h-4 w-4" />
                Columns
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className=" w-56">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* TABLE */}
      <TabsContent value="table" className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={finalColumns.length}
                    className="h-24 text-center"
                  >
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} rows total
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {[10, 20, 30, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="text-sm">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>

            <div className="flex gap-1">
              <Button
                size="icon"
                variant="outline"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeftIcon />
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon />
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon />
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function renderCell(type: string, value: any) {
  switch (type) {
    case "badge":
      return (
        <span className="text-xs px-2 py-1 rounded bg-muted capitalize">
          {value}
        </span>
      );

    case "currency":
      return <span>₹{value}</span>;

    case "number":
      return <span>{Number(value)}</span>;

    case "text":
    default:
      return <span>{value}</span>;
  }
}

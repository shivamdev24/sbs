/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Phone,
  Search,
  Star,
  Trash2,
  User2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  MessageCircle,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

// import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";

import {
  getLeads,
  updateLead,
  deleteLead,
  bulkUpdateLeads,
} from "@/actions/leadAction";

// ============================================================================
// TYPES
// ============================================================================

type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "UNQUALIFIED"
  | "CONVERTED"
  | "CLOSED";

type Inquiry = {
  id: string;

  name?: string | null;

  contact?: string | null;

  service?: string | null;

  source?: string | null;

  status: LeadStatus;

  contacted?: boolean;

  starred?: boolean;

  assignedTo?: string | null;
};
// ============================================================================
// PAGE
// ============================================================================

export default function Page() {
  // ============================================================================
  // STATE
  // ============================================================================

  const [search, setSearch] = useState("");

  const [service, setService] = useState("");

  const [status, setStatus] = useState("");

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [isPending, startTransition] = useTransition();

  const [inquiryData, setInquiryData] = useState<Inquiry[]>([]);

  // ============================================================================
  // FILTERS
  // ============================================================================

  const filteredData = useMemo(() => {
    return inquiryData.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        (item.name ?? "").toLowerCase().includes(searchValue) ||
        (item.contact ?? "").toLowerCase().includes(searchValue);

      const matchesService = service ? item.service === service : true;

      const matchesStatus = status ? item.status === status : true;

      return matchesSearch && matchesService && matchesStatus;
    });
  }, [search, service, status, inquiryData]);

  const services = [
    ...new Set(
      inquiryData
        .map((d) => d.service)
        .filter((service): service is string => Boolean(service)),
    ),
  ];

  // ============================================================================
  // STATS
  // ============================================================================

  const totalLeads = filteredData.length;

  const newLeads = filteredData.filter((i) => i.status === "NEW").length;

  const contactedLeads = filteredData.filter(
    (i) => i.status === "CONTACTED",
  ).length;

  const closedLeads = filteredData.filter((i) => i.status === "CLOSED").length;

  // ============================================================================
  // FETCH LEADS
  // ============================================================================

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);

      try {
        const response = await getLeads();

        if (Array.isArray(response)) {
          setInquiryData(response);
        } else if (response.success && response.data) {
          setInquiryData(response.data);
        } else {
          throw new Error(response.error ?? "Invalid lead response");
        }
      } catch (error) {
        console.error(error);

        toast.error("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // ============================================================================
  // UPDATE LOCAL STATE
  // ============================================================================

  const updateInquiryState = (id: string, updates: Partial<Inquiry>) => {
    setInquiryData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item,
      ),
    );
  };

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const toggleSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleStar = (id: string) => {
    const inquiry = inquiryData.find((i) => i.id === id);

    if (!inquiry) return;

    startTransition(async () => {
      const previousStarred = inquiry.starred;

      updateInquiryState(id, {
        starred: !previousStarred,
      });

      try {
        const response = await updateLead({
          id,
          starred: !previousStarred,
        });

        if (!response.success) {
          updateInquiryState(id, {
            starred: previousStarred,
          });

          toast.error(response.error);

          return;
        }
      } catch {
        updateInquiryState(id, {
          starred: previousStarred,
        });
      }
    });
  };

  const markAsContacted = (id: string) => {
    startTransition(async () => {
      updateInquiryState(id, {
        contacted: true,
        status: "CONTACTED",
      });

      try {
        const response = await updateLead({
          id,
          contacted: true,
          status: "CONTACTED",
        });

        if (!response.success) {
          toast.error(response.error);
          return;
        }

        toast.success("Marked as contacted");
      } catch (error) {
        console.error(error);

        toast.error("Failed to update lead");
      }
    });
  };

  const markAsClosed = (id: string) => {
    startTransition(async () => {
      updateInquiryState(id, {
        status: "CLOSED",
      });

      try {
        const response = await updateLead({
          id,
          status: "CLOSED",
        });

        if (!response.success) {
          toast.error(response.error);
          return;
        }

        toast.success("Lead closed");
      } catch (error) {
        console.error(error);

        toast.error("Failed to close lead");
      }
    });
  };

  const resetLeadStatus = (id: string) => {
    startTransition(async () => {
      updateInquiryState(id, {
        status: "NEW",
        contacted: false,
      });

      try {
        const response = await updateLead({
          id,
          status: "NEW",
          contacted: false,
        });

        if (!response.success) {
          toast.error(response.error);
          return;
        }

        toast.success("Lead reset");
      } catch (error) {
        console.error(error);

        toast.error("Failed to reset lead");
      }
    });
  };

  const deleteInquiryHandler = (id: string) => {
    startTransition(async () => {
      const oldData = inquiryData;

      setInquiryData((prev) => prev.filter((item) => item.id !== id));

      try {
        const response = await deleteLead(id);

        if (!response.success) {
          setInquiryData(oldData);

          toast.error(response.error);

          return;
        }

        toast.success("Lead deleted");
      } catch (error) {
        console.error(error);

        setInquiryData(oldData);

        toast.error("Failed to delete lead");
      }
    });
  };

  // ============================================================================
  // BULK ACTIONS
  // ============================================================================

  const bulkMarkContacted = () => {
    startTransition(async () => {
      setInquiryData((prev) =>
        prev.map((item) =>
          selectedRows.includes(item.id)
            ? {
                ...item,

                contacted: true,

                status: "CONTACTED",
              }
            : item,
        ),
      );

      try {
        const response = await bulkUpdateLeads(selectedRows, {
          contacted: true,
          status: "CONTACTED",
        });

        if (!response.success) {
          toast.error(response.error);
          return;
        }
        toast.success("Selected leads updated");
      } catch (error) {
        console.error(error);

        toast.error("Bulk update failed");
      }
    });
  };

  const bulkDelete = async () => {
    startTransition(async () => {
      const oldData = inquiryData;

      setInquiryData((prev) =>
        prev.filter((item) => !selectedRows.includes(item.id)),
      );

      try {
        const responses = await Promise.all(
          selectedRows.map((id) => deleteLead(id)),
        );

        const hasError = responses.some((r) => !r.success);

        if (hasError) {
          setInquiryData(oldData);

          toast.error("Some leads failed to delete");

          return;
        }

        setSelectedRows([]);
      } catch (error) {
        console.error(error);

        setInquiryData(oldData);

        toast.error("Bulk delete failed");
      }
    });
  };

  // ============================================================================
  // WHATSAPP
  // ============================================================================

  const openWhatsApp = async (item: Inquiry) => {
    if (!item.contact) return;

    const phone = item.contact.replace(/\D/g, "");

    const message = encodeURIComponent(
      `Hi ${item.name}, thanks for contacting us regarding ${item.service}.`,
    );

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    window.open(whatsappUrl, "_blank");

    updateInquiryState(item.id, {
      contacted: true,

      status: "CONTACTED",
    });

    try {
      await updateLead({
        id: item.id,
        contacted: true,
        status: "CONTACTED",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // ============================================================================
  // EXPORT CSV
  // ============================================================================

  // const exportToCSV = () => {
  //   if (!filteredData.length) {
  //     toast.error("No data available");

  //     return;
  //   }

  //   const headers = ["Name", "Contact", "Service", "Status", "Starred"];

  //   const csvRows = [
  //     headers.join(","),

  //     ...filteredData.map((row) =>
  //       [
  //         row.name,
  //         row.contact,
  //         row.service,
  //         row.status,
  //         row.starred ? "Yes" : "No",
  //       ]
  //         .map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`)
  //         .join(","),
  //     ),
  //   ];

  //   const csvContent = csvRows.join("\n");

  //   const blob = new Blob([csvContent], {
  //     type: "text/csv;charset=utf-8;",
  //   });

  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");

  //   link.href = url;

  //   link.download = `leads-${Date.now()}.csv`;

  //   document.body.appendChild(link);

  //   link.click();

  //   document.body.removeChild(link);

  //   URL.revokeObjectURL(url);

  //   toast.success("CSV exported");
  // };

  const exportToExcel = () => {
    if (!filteredData.length) {
      toast.error("No data available");

      return;
    }

    const excelData = filteredData.map((row) => ({
      Name: row.name,
      Contact: row.contact,
      Service: row.service,
      Status: row.status,
      Starred: row.starred ? "Yes" : "No",
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `leads-${Date.now()}.xlsx`);

    toast.success("Excel exported");
  };

  // ============================================================================
  // LOADING
  // ============================================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  // ============================================================================
  // UI
  // ============================================================================

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Inquiry Management
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Track salon inquiries, follow-ups, and customer conversion.
            </p>
          </div>

          <Button onClick={exportToExcel} className="rounded-xl">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* STATS */}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                Total Appointment Inquery
              </p>

              <h3 className="mt-2 text-3xl font-bold">{totalLeads}</h3>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">New</p>

              <h3 className="mt-2 text-3xl font-bold text-orange-500">
                {newLeads}
              </h3>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Contacted</p>

              <h3 className="mt-2 text-3xl font-bold text-blue-500">
                {contactedLeads}
              </h3>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Closed</p>

              <h3 className="mt-2 text-3xl font-bold text-green-500">
                {closedLeads}
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* FILTERS */}

        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 flex-wrap gap-3">
                <div className="relative w-full xl:w-80 border rounded-lg">
                  <Search className="absolute left-3 top-3 h-6 w-6 " />

                  <Input
                    placeholder="Search customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-6 outline-none border-none  h-11 pl-10 text-blue-500"
                  />
                </div>

                <select
                  className="h-11 rounded-xl border bg-background px-4 text-sm"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="">All Services</option>

                  {services.map(
                    (s: string | null | undefined) =>
                      s && (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ),
                  )}
                </select>

                <select
                  className="h-11 rounded-xl border bg-background px-4 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>

                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="UNQUALIFIED">Unqualified</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setSearch("");

                  setService("");

                  setStatus("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* BULK ACTIONS */}

        {selectedRows.length > 0 && (
          <Card className="rounded-2xl border-primary/20 bg-primary/5">
            <CardContent className="flex flex-wrap items-center gap-3 p-4">
              <p className="text-sm font-medium">
                {selectedRows.length} selected
              </p>

              <Button
                size="sm"
                className="rounded-xl"
                onClick={bulkMarkContacted}
              >
                Mark Contacted
              </Button>

              <Button
                size="sm"
                variant="destructive"
                className="rounded-xl"
                onClick={bulkDelete}
              >
                Delete Selected
              </Button>
            </CardContent>
          </Card>
        )}

        {/* LEADS */}

        <div className="grid gap-4">
          {filteredData.map((item) => (
            <Card
              key={item.id}
              className="rounded-2xl transition hover:border-primary/30"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  {/* LEFT */}

                  <div className="flex gap-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="mt-1"
                    />

                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10">
                          <User2 className="h-5 w-5 text-blue-500" />
                        </div>

                        <div>
                          <h3 className="font-semibold">{item.name}</h3>

                          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {item.contact}
                            </span>

                            {item.service ? (
                              <span className="bg-blue-500/20 text-blue-500 rounded-full px-3 py-1 text-xs font-medium">
                                {item.service}
                              </span>
                            ) : (
                              ""
                            )}
                            {item.source ? (
                              <span className="bg-blue-500/20 text-blue-500 rounded-full px-3 py-1 text-xs font-medium">
                                {item.source}
                              </span>
                            ) : (
                              ""
                            )}
                            {item.assignedTo ? (
                              <span className="bg-blue-500/20 text-blue-500 rounded-full px-3 py-1 text-xs font-medium">
                                {item.assignedTo}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {item.starred && (
                          <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600">
                            Starred
                          </span>
                        )}

                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",

                            item.status === "CONTACTED" &&
                              "bg-blue-500/10 text-blue-500",

                            item.status === "QUALIFIED" &&
                              "bg-purple-500/10 text-purple-500",

                            item.status === "UNQUALIFIED" &&
                              "bg-gray-500/10 text-gray-500",

                            item.status === "CONVERTED" &&
                              "bg-green-500/10 text-green-500",

                            item.status === "CLOSED" &&
                              "bg-red-500/10 text-red-500",
                          )}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={isPending}
                      onClick={() => toggleStar(item.id)}
                    >
                      <Star
                        className={cn(
                          "mr-2 h-4 w-4",

                          item.starred && "fill-yellow-400 text-yellow-400",
                        )}
                      />

                      {item.starred ? "Unstar" : "Star"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl bg-green-700/80 text-white hover:bg-green-600 hover:text-white"
                      onClick={() => openWhatsApp(item)}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={isPending}
                      onClick={() => markAsContacted(item.id)}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Contacted
                    </Button>

                    <Button
                      size="sm"
                      className="rounded-xl"
                      disabled={isPending}
                      onClick={() => markAsClosed(item.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Close
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={isPending}
                      onClick={() => resetLeadStatus(item.id)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-xl"
                      disabled={isPending}
                      onClick={() => deleteInquiryHandler(item.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* EMPTY */}

        {!filteredData.length && (
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-lg font-semibold">No inquiries found</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Try changing filters or search query.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

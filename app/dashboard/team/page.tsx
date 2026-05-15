/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import {
  CalendarDays,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  User2,
  X,
  Save,
} from "lucide-react";

import { toast } from "sonner";

import {
  createStaff,
  deleteStaff,
  getStaffs,
  updateStaff,
} from "@/actions/teamAction";

import { getServices } from "@/actions/serviceAction";

import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

// ============================================================================
// TYPES
// ============================================================================

type Service = {
  id: string;
  name: string;
};

type Availability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type Leave = {
  startDate: string;
  endDate?: string;
  reason?: string;
};

type Staff = {
  id: string;

  name: string;

  phone?: string | null;

  email?: string | null;

  address?: string | null;

  services: {
    service: Service;
  }[];

  availability: Availability[];

  leaves: Leave[];
};

// ============================================================================
// DAYS
// ============================================================================

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ============================================================================
// PAGE
// ============================================================================

export default function StaffPage() {
  const business = useBusinessStore((state) => state.business);

  const businessProfileId = business?.id;

  const [staffs, setStaffs] = useState<Staff[]>([]);

  const [services, setServices] = useState<Service[]>([]);

  const [search, setSearch] = useState("");

  const [isPending, startTransition] = useTransition();

  const [editingId, setEditingId] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const defaultLeave = {
    startDate: "",
    endDate: "",
    reason: "",
  };

  // ============================================================================
  // FORM
  // ============================================================================

  const defaultAvailability = DAYS.map((_, index) => ({
    dayOfWeek: index,
    startTime: "09:00",
    endTime: "18:00",
  }));

  type StaffForm = {
    name: string;
    phone: string;
    email: string;
    address: string;
    serviceIds: string[];
    availability: Availability[];
    leaves: Leave[];
  };

  const [form, setForm] = useState<StaffForm>({
    name: "",

    phone: "",

    email: "",

    address: "",

    serviceIds: [] as string[],

    availability: defaultAvailability,

    leaves: [defaultLeave],
  });

  // ============================================================================
  // FETCH
  // ============================================================================

  const fetchStaffs = async () => {
    if (!businessProfileId) return;

    const response = await getStaffs(businessProfileId);

    console.log("Staffs response:", response);

    if (response.success) {
      setStaffs((response.data as Staff[]) || []);
    }
  };

  const fetchServices = async () => {
    if (!businessProfileId) return;

    const response = await getServices(businessProfileId);

    if (response.success) {
      setServices(response.data || []);
    }
  };

  useEffect(() => {
    if (businessProfileId) {
      fetchStaffs();

      fetchServices();
    }
  }, [businessProfileId]);

  // ============================================================================
  // CREATE / UPDATE
  // ============================================================================

  const resetForm = () => {
    setForm({
      name: "",

      phone: "",

      email: "",

      address: "",

      serviceIds: [],

      availability: defaultAvailability,

      leaves: [defaultLeave],
    });
  };

  const handleSubmit = () => {
    startTransition(async () => {
      if (!businessProfileId) {
        toast.error("Business profile missing");

        return;
      }

      if (!form.name.trim()) {
        toast.error("Staff name required");

        return;
      }

      try {
        const payload = {
          name: form.name,

          phone: form.phone || undefined,

          email: form.email || undefined,

          address: form.address || undefined,

          businessProfileId,

          serviceIds: form.serviceIds,

          availability: form.availability,

          leaves: form.leaves.filter(
            (leave) =>
              leave.startDate?.trim() ||
              leave.endDate?.trim() ||
              leave.reason?.trim(),
          ),
        };

        console.log("Payload in handleSubmit:", payload);

        if (editingId) {
          const response = await updateStaff(editingId, payload);

          console.log("Update in handlesubmit response:", response);

          if (!response.success) {
            toast.error(response.error);

            return;
          }

          toast.success("Staff updated");
        } else {
          const response = await createStaff(payload);

          if (!response.success) {
            toast.error(response.error);

            return;
          }

          toast.success("Staff created");
        }

        resetForm();

        setEditingId(null);

        fetchStaffs();
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong");
      }
    });
  };

  // ============================================================================
  // DELETE
  // ============================================================================

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this staff member?");

    if (!confirmDelete) return;

    setIsDeleting(id);

    try {
      const response = await deleteStaff(id);

      if (!response.success) {
        toast.error(response.error);

        return;
      }

      setStaffs((prev) => prev.filter((s) => s.id !== id));

      toast.success("Staff deleted");
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    } finally {
      setIsDeleting(null);
    }
  };

  // ============================================================================
  // EDIT
  // ============================================================================

  const handleEdit = (staff: Staff) => {
    setEditingId(staff.id);

    setForm({
      name: staff.name,

      phone: staff.phone || "",

      email: staff.email || "",

      address: staff.address || "",

      serviceIds: staff.services.map((s) => s.service.id),

      availability:
        staff.availability.length > 0
          ? staff.availability
          : defaultAvailability,

      leaves:
        staff.leaves.length > 0
          ? staff.leaves.map((leave) => ({
              startDate: leave.startDate
                ? new Date(leave.startDate).toISOString().split("T")[0]
                : "",

              endDate: leave.endDate
                ? new Date(leave.endDate).toISOString().split("T")[0]
                : "",

              reason: leave.reason || "",
            }))
          : [defaultLeave],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================================
  // FILTER
  // ============================================================================

  const filteredStaffs = useMemo(() => {
    return staffs.filter((staff) => {
      return (
        staff.name.toLowerCase().includes(search.toLowerCase()) ||
        staff.phone?.includes(search) ||
        staff.email?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [staffs, search]);

  // ============================================================================
  // LOADING
  // ============================================================================

  if (!business) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="space-y-6">
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Staff Management</h1>

            <p className="text-sm text-muted-foreground">
              Manage salon staff, timings, and services
            </p>
          </div>
        </div>

        {/* MAIN */}

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* FORM */}

          <div>
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>
                  {editingId ? "Edit Staff" : "Create Staff"}
                </CardTitle>

                <CardDescription>
                  Add staff members and assign services
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* NAME */}

                <div className="space-y-2">
                  <Label>Name</Label>

                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* PHONE */}

                <div className="space-y-2">
                  <Label>Phone</Label>

                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* EMAIL */}

                <div className="space-y-2">
                  <Label>Email</Label>

                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* ADDRESS */}

                <div className="space-y-2">
                  <Label>Address</Label>

                  <Input
                    value={form.address}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>

                <Separator />

                {/* SERVICES */}

                <div className="space-y-3">
                  <Label>Assign Services</Label>

                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => {
                      const active = form.serviceIds.includes(service.id);

                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,

                              serviceIds: active
                                ? prev.serviceIds.filter(
                                    (id) => id !== service.id,
                                  )
                                : [...prev.serviceIds, service.id],
                            }));
                          }}
                          className={cn(
                            "rounded-xl border p-3 text-sm transition",
                            active
                              ? "border-primary bg-primary text-white"
                              : "bg-background hover:bg-muted",
                          )}
                        >
                          {service.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* AVAILABILITY */}

                <div className="space-y-4">
                  <Label>Weekly Availability</Label>

                  {form.availability.map((slot, index) => (
                    <div
                      key={slot.dayOfWeek}
                      className="rounded-2xl border p-3"
                    >
                      <p className="mb-3 text-sm font-medium">
                        {DAYS[slot.dayOfWeek]}
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => {
                            const updated = [...form.availability];

                            updated[index].startTime = e.target.value;

                            setForm((prev) => ({
                              ...prev,
                              availability: updated,
                            }));
                          }}
                        />

                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => {
                            const updated = [...form.availability];

                            updated[index].endTime = e.target.value;

                            setForm((prev) => ({
                              ...prev,
                              availability: updated,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* LEAVES */}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Holidays / Leaves</Label>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,

                          leaves: [...prev.leaves, { ...defaultLeave }],
                        }))
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Leave
                    </Button>
                  </div>

                  {form.leaves.map((leave, index) => (
                    <div
                      key={index}
                      className="space-y-3 rounded-2xl border p-4"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="mb-2 block text-xs">
                            Start Date
                          </Label>

                          <Input
                            type="date"
                            value={leave.startDate}
                            onChange={(e) => {
                              const updated = [...form.leaves];

                              updated[index].startDate = e.target.value;

                              setForm((prev) => ({
                                ...prev,
                                leaves: updated,
                              }));
                            }}
                          />
                        </div>

                        <div>
                          <Label className="mb-2 block text-xs">End Date</Label>

                          <Input
                            type="date"
                            value={leave.endDate}
                            onChange={(e) => {
                              const updated = [...form.leaves];

                              updated[index].endDate = e.target.value;

                              setForm((prev) => ({
                                ...prev,
                                leaves: updated,
                              }));
                            }}
                          />
                        </div>
                      </div>

                      <Input
                        placeholder="Reason"
                        value={leave.reason}
                        onChange={(e) => {
                          const updated = [...form.leaves];

                          updated[index].reason = e.target.value;

                          setForm((prev) => ({
                            ...prev,
                            leaves: updated,
                          }));
                        }}
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (form.leaves.length === 1) {
                            setForm((prev) => ({
                              ...prev,
                              leaves: [defaultLeave],
                            }));

                            return;
                          }

                          setForm((prev) => ({
                            ...prev,

                            leaves: prev.leaves.filter((_, i) => i !== index),
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                {/* ACTION */}

                <div className="flex gap-2">
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingId ? (
                    <Button
                      className="flex-1 rounded-xl"
                      disabled={isPending}
                      onClick={handleSubmit}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Update Staff
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 rounded-xl"
                      disabled={isPending}
                      onClick={handleSubmit}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Staff
                    </Button>
                  )}

                  {editingId && (
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => {
                        resetForm();

                        setEditingId(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LIST */}

          <div className="space-y-5">
            {/* SEARCH */}

            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    placeholder="Search staff..."
                    className="h-11 rounded-xl pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* STAFF GRID */}

            <div className="grid gap-5 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredStaffs.map((staff) => (
                <Card key={staff.id} className="rounded-3xl border-0 shadow-sm">
                  <CardContent className="space-y-5 p-5">
                    {/* TOP */}

                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="rounded-xl bg-primary/10 p-2 text-primary">
                            <User2 className="h-4 w-4" />
                          </div>

                          <div>
                            <h2 className="text-xl font-bold">{staff.name}</h2>

                            <p className="text-xs text-muted-foreground">
                              Staff Member
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* INFO */}

                    <div className="space-y-3 text-sm">
                      {staff.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />

                          <span>{staff.phone}</span>
                        </div>
                      )}

                      {staff.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />

                          <span>{staff.email}</span>
                        </div>
                      )}

                      {staff.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />

                          <span>{staff.address}</span>
                        </div>
                      )}
                    </div>

                    {/* SERVICES */}

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Services</p>

                      <div className="flex flex-wrap gap-2">
                        {staff.services.map((item) => (
                          <div
                            key={item.service.id}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {item.service.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AVAILABILITY */}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-muted-foreground" />

                        <p className="text-sm font-medium">Availability</p>
                      </div>

                      <div className="space-y-2">
                        {staff.availability.slice(0, 3).map((slot) => (
                          <div
                            key={slot.dayOfWeek}
                            className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-xs"
                          >
                            <span>{DAYS[slot.dayOfWeek]}</span>

                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* LEAVES */}

                    {staff.leaves.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />

                          <p className="text-sm font-medium">Leaves</p>
                        </div>

                        {staff.leaves.map((leave, index) => (
                          <div
                            key={index}
                            className="rounded-xl bg-red-50 p-3 text-xs flex gap-4"
                          >
                            <p className="font-medium">
                              {new Date(leave.startDate).toLocaleDateString()}
                            </p>
                            <p className="font-medium">
                              {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : ""}
                            </p>

                            {leave.reason && (
                              <p className="mt-1 text-muted-foreground">
                                {leave.reason}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl"
                        onClick={() => handleEdit(staff)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        className="rounded-xl"
                        disabled={isDeleting === staff.id}
                        onClick={() => handleDelete(staff.id)}
                      >
                        {isDeleting === staff.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

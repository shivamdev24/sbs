/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
// "use client";

// import { useEffect, useState } from "react";
// import { createBooking } from "@/actions/bookingAction";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// type Service = {
//   id: string;
//   name: string;
// };

// export default function AdminCreateBooking() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [selectedServices, setSelectedServices] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     customerName: "",
//     contact: "",
//     date: "",
//     status: "PENDING",
//   });

//   useEffect(() => {
//     async function loadServices() {
//       const res = await fetch("/api/services");
//       const data = await res.json();
//       setServices(data);
//     }

//     loadServices();
//   }, []);

//   const toggleService = (id: string) => {
//     setSelectedServices((prev) =>
//       prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
//     );
//   };

//   const handleSubmit = async () => {
//     if (!form.customerName || !form.contact || !form.date) {
//       alert("Fill all fields");
//       return;
//     }

//     if (!selectedServices.length) {
//       alert("Select at least one service");
//       return;
//     }

//     setLoading(true);

//     const res = await createBooking({
//       customerName: form.customerName,
//       contact: form.contact,
//       date: form.date,
//       businessProfileId: "YOUR_BUSINESS_ID", // ⚠️ fix this
//       items: selectedServices.map((id) => ({
//         serviceId: id,
//       })),
//     });

//     setLoading(false);

//     if (res.success) {
//       alert("Booking created");

//       setForm({
//         customerName: "",
//         contact: "",
//         date: "",
//         status: "PENDING",
//       });
//       setSelectedServices([]);
//     } else {
//       alert(res.error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <Card className="max-w-2xl">
//         <CardHeader>
//           <CardTitle>Create Booking</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {/* Customer */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Name</Label>
//               <Input
//                 value={form.customerName}
//                 onChange={(e) =>
//                   setForm({ ...form, customerName: e.target.value })
//                 }
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Contact</Label>
//               <Input
//                 value={form.contact}
//                 onChange={(e) => setForm({ ...form, contact: e.target.value })}
//               />
//             </div>
//           </div>

//           {/* Date */}
//           <div className="space-y-2">
//             <Label>Date & Time</Label>
//             <Input
//               type="datetime-local"
//               value={form.date}
//               onChange={(e) => setForm({ ...form, date: e.target.value })}
//             />
//           </div>

//           {/* Status */}
//           <div className="space-y-2">
//             <Label>Status</Label>
//             <Select
//               value={form.status}
//               onValueChange={(value) => setForm({ ...form, status: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="PENDING">Pending</SelectItem>
//                 <SelectItem value="CONFIRMED">Confirmed</SelectItem>
//                 <SelectItem value="COMPLETED">Completed</SelectItem>
//                 <SelectItem value="CANCELLED">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Services */}
//           <div className="space-y-3">
//             <Label>Services</Label>

//             <div className="border rounded p-3 max-h-56 overflow-y-auto space-y-2">
//               {services.map((service) => (
//                 <div key={service.id} className="flex items-center gap-2">
//                   <Checkbox
//                     checked={selectedServices.includes(service.id)}
//                     onCheckedChange={() => toggleService(service.id)}
//                   />
//                   <span>{service.name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Submit */}
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Creating..." : "Create Booking"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default function AdminBookingPage() {
//   return (
//     <div className="min-h-screen bg-muted/30 p-6">
//       <div className="mx-auto max-w-7xl space-y-6">
//         {/* Header */}
//         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               Create Booking
//             </h1>
//             <p className="text-muted-foreground mt-1 text-sm">
//               Manage appointments, walk-ins, staff assignment, and customer
//               scheduling.
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <button className="rounded-xl border bg-background px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted">
//               View Calendar
//             </button>

//             <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition hover:opacity-90">
//               Quick Walk-In
//             </button>
//           </div>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
//           {/* Left */}
//           <div className="space-y-6">
//             {/* Booking Type */}
//             <section className="rounded-2xl border bg-background p-5 shadow-sm">
//               <div className="mb-4 flex items-center justify-between">
//                 <div>
//                   <h2 className="text-lg font-semibold">Booking Type</h2>
//                   <p className="text-muted-foreground text-sm">
//                     Choose how this booking is being created.
//                   </p>
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-3">
//                 <button className="rounded-2xl border-2 border-primary bg-primary/5 p-5 text-left transition hover:bg-primary/10">
//                   <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
//                     🚶
//                   </div>

//                   <h3 className="font-semibold">Walk-In</h3>
//                   <p className="text-muted-foreground mt-1 text-sm">
//                     Customer arrived without appointment.
//                   </p>
//                 </button>

//                 <button className="rounded-2xl border p-5 text-left transition hover:bg-muted/50">
//                   <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-lg">
//                     📅
//                   </div>

//                   <h3 className="font-semibold">Scheduled</h3>
//                   <p className="text-muted-foreground mt-1 text-sm">
//                     Future booking with time slot.
//                   </p>
//                 </button>

//                 <button className="rounded-2xl border p-5 text-left transition hover:bg-muted/50">
//                   <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-lg">
//                     📞
//                   </div>

//                   <h3 className="font-semibold">Phone Booking</h3>
//                   <p className="text-muted-foreground mt-1 text-sm">
//                     Reservation created from call.
//                   </p>
//                 </button>
//               </div>
//             </section>

//             {/* Customer */}
//             <section className="rounded-2xl border bg-background p-5 shadow-sm">
//               <div className="mb-5">
//                 <h2 className="text-lg font-semibold">Customer Details</h2>
//                 <p className="text-muted-foreground text-sm">
//                   Search existing customer or create a new one.
//                 </p>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Customer Name</label>
//                   <input
//                     className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary"
//                     placeholder="Enter customer name"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Phone Number</label>
//                   <input
//                     className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary"
//                     placeholder="+91 9876543210"
//                   />
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <label className="text-sm font-medium">Notes</label>
//                   <textarea
//                     className="min-h-[90px] w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary"
//                     placeholder="Hair preferences, allergies, special requests, etc."
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* Services */}
//             <section className="rounded-2xl border bg-background p-5 shadow-sm">
//               <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <h2 className="text-lg font-semibold">Services</h2>
//                   <p className="text-muted-foreground text-sm">
//                     Add one or multiple services.
//                   </p>
//                 </div>

//                 <input
//                   className="h-10 w-full rounded-xl border px-3 text-sm md:w-[260px]"
//                   placeholder="Search services..."
//                 />
//               </div>

//               <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//                 {[
//                   {
//                     name: "Hair Cut",
//                     duration: "45 min",
//                     price: "₹400",
//                   },
//                   {
//                     name: "Hair Spa",
//                     duration: "60 min",
//                     price: "₹1200",
//                   },
//                   {
//                     name: "Beard Styling",
//                     duration: "20 min",
//                     price: "₹250",
//                   },
//                 ].map((service) => (
//                   <button
//                     key={service.name}
//                     className="rounded-2xl border p-4 text-left transition hover:border-primary hover:bg-primary/5"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <h3 className="font-medium">{service.name}</h3>
//                         <p className="text-muted-foreground mt-1 text-sm">
//                           {service.duration}
//                         </p>
//                       </div>

//                       <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
//                         {service.price}
//                       </span>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </section>

//             {/* Scheduling */}
//             <section className="rounded-2xl border bg-background p-5 shadow-sm">
//               <div className="mb-5">
//                 <h2 className="text-lg font-semibold">Schedule & Staff</h2>
//                 <p className="text-muted-foreground text-sm">
//                   Assign timing and available staff.
//                 </p>
//               </div>

//               <div className="grid gap-4 md:grid-cols-3">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Date</label>
//                   <input
//                     type="date"
//                     className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Time</label>
//                   <input
//                     type="time"
//                     className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Assign Staff</label>
//                   <select className="h-11 w-full rounded-xl border bg-background px-3 text-sm">
//                     <option>Any Available</option>
//                     <option>Rahul</option>
//                     <option>Aman</option>
//                     <option>Priya</option>
//                   </select>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Right Sidebar */}
//           <div className="space-y-6">
//             {/* Summary */}
//             <section className="sticky top-6 rounded-2xl border bg-background p-5 shadow-sm">
//               <div className="mb-5 flex items-center justify-between">
//                 <div>
//                   <h2 className="text-lg font-semibold">Booking Summary</h2>
//                   <p className="text-muted-foreground text-sm">
//                     Final overview before confirmation.
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="rounded-xl border bg-muted/30 p-4">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Services</span>
//                     <span className="font-medium">3</span>
//                   </div>

//                   <div className="mt-3 space-y-2 text-sm">
//                     <div className="flex items-center justify-between">
//                       <span>Hair Cut</span>
//                       <span>₹400</span>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <span>Hair Spa</span>
//                       <span>₹1200</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-xl border bg-muted/30 p-4 text-sm">
//                   <div className="flex items-center justify-between">
//                     <span className="text-muted-foreground">Duration</span>
//                     <span className="font-medium">1h 45m</span>
//                   </div>

//                   <div className="mt-3 flex items-center justify-between">
//                     <span className="text-muted-foreground">Discount</span>
//                     <button className="text-primary font-medium">
//                       Apply Code
//                     </button>
//                   </div>
//                 </div>

//                 <div className="rounded-xl border bg-primary/5 p-4">
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium">Total Amount</span>
//                     <span className="text-2xl font-bold">₹1600</span>
//                   </div>
//                 </div>

//                 <div className="space-y-3 pt-2">
//                   <button className="h-11 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90">
//                     Create Booking
//                   </button>

//                   <button className="h-11 w-full rounded-xl border bg-background text-sm font-medium transition hover:bg-muted">
//                     Save as Draft
//                   </button>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { ArrowLeft, Loader2, Plus, Search, Trash2 } from "lucide-react";

import { toast } from "sonner";

import { createBooking } from "@/actions/bookingAction";

import { getServices } from "@/actions/serviceAction";

import { getStaffs } from "@/actions/teamAction";

import { getDiscounts } from "@/actions/discountAction";

import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import Link from "next/link";

// ============================================================================
// TYPES
// ============================================================================

type Staff = {
  id: string;
  name: string;
};

type Service = {
  id: string;
  name: string;
  isActive: boolean;
  basePrice?: number | null;
  totalDuration?: number | null;

  variants?: {
    id: string;
    name: string;
    price?: number | null;
    totalDuration?: number | null;
  }[];
};

type Discount = {
  id: string;
  code: string;
  discountPercentage: number;
};

type BookingItemPayload = {
  serviceId: string;
  variantId?: string;
  price: number;
  duration: number;
  staffId?: string;
};

// ============================================================================
// PAGE
// ============================================================================

export default function AdminBookingPage() {
  const business = useBusinessStore((s) => s.business);

  const businessProfileId = business?.id;

  const [services, setServices] = useState<Service[]>([]);

  const [staffs, setStaffs] = useState<Staff[]>([]);

  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const [serviceSearch, setServiceSearch] = useState("");

  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(1);

  const steps = ["Booking Type", "Customer", "Services", "Schedule"];

  // ============================================================================
  // FORM
  // ============================================================================

  const [form, setForm] = useState({
    bookingType: "",

    customerName: "",

    customerPhone: "",
    customerEmail: "",
    status: "CONFIRMED",

    notes: "",

    date: "",

    time: "",

    staffId: "",

    discountCodeId: "",

    items: [] as BookingItemPayload[],
  });

  // ============================================================================
  // FETCH
  // ============================================================================

  const fetchInitialData = async () => {
    if (!businessProfileId) return;

    try {
      const [serviceResponse, staffResponse, discountResponse] =
        await Promise.all([
          getServices(businessProfileId),
          getStaffs(businessProfileId),
          getDiscounts(businessProfileId),
        ]);

      console.log("SERVICE RESPONSE:", serviceResponse);
      console.log("STAFF RESPONSE:", staffResponse);
      console.log("DISCOUNT RESPONSE:", discountResponse);

      if (serviceResponse.success) {
        setServices(serviceResponse.data || []);
      }

      if (staffResponse.success) {
        setStaffs(staffResponse.data || []);
      }

      if (discountResponse.success) {
        setDiscounts(discountResponse.data || []);
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to load booking data");
    }
  };

  useEffect(() => {
    if (!businessProfileId) return;

    fetchInitialData();
  }, [businessProfileId]);

  useEffect(() => {
    console.log("SERVICES UPDATED:", services);
  }, [services]);

  useEffect(() => {
    console.log("STAFF UPDATED:", staffs);
  }, [staffs]);

  useEffect(() => {
    console.log("DISCOUNTS UPDATED:", discounts);
  }, [discounts]);

  // ============================================================================
  // SERVICES
  // ============================================================================

  // const filteredServices = useMemo(() => {
  //   return services.filter((service) =>
  //     service.name.toLowerCase().includes(serviceSearch.toLowerCase()),
  //   );
  // }, [services, serviceSearch]);

  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        service.isActive &&
        service.name.toLowerCase().includes(serviceSearch.toLowerCase()),
    );
  }, [services, serviceSearch]);

  const selectedDiscount = discounts.find((d) => d.id === form.discountCodeId);

  const subtotal = form.items.reduce((acc, item) => acc + item.price, 0);

  const totalDuration = form.items.reduce(
    (acc, item) => acc + item.duration,
    0,
  );

  const walkin = form.bookingType === "WALKIN";

  const discountAmount = selectedDiscount
    ? Math.floor(subtotal * (selectedDiscount.discountPercentage / 100))
    : 0;

  const finalTotal = subtotal - discountAmount;

  // ============================================================================
  // ADD SERVICE
  // ============================================================================

  const addService = (service: Service) => {
    const alreadyExists = form.items.some(
      (item) => item.serviceId === service.id,
    );

    if (alreadyExists) {
      toast.error("Service already added");

      return;
    }

    const payload: BookingItemPayload = {
      serviceId: service.id,

      variantId: undefined,

      price: Number(service.basePrice || 0),

      duration: Number(service.totalDuration || 0),

      staffId: form.staffId || undefined,
    };

    setForm((prev) => ({
      ...prev,

      items: [...prev.items, payload],
    }));

    toast.success(`${service.name} added`);
  };

  // ============================================================================
  // REMOVE SERVICE
  // ============================================================================

  const removeService = (index: number) => {
    setForm((prev) => ({
      ...prev,

      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // ============================================================================
  // CREATE BOOKING
  // ============================================================================

  const handleCreateBooking = () => {
    startTransition(async () => {
      if (!businessProfileId) {
        toast.error("Business profile missing");

        return;
      }

      if (!form.customerName.trim()) {
        toast.error("Customer name is required");

        return;
      }

      if (form.items.length === 0) {
        toast.error("Add at least one service");

        return;
      }

      const isWalkIn = form.bookingType === "WALKIN";

      if (!isWalkIn) {
        if (!form.date) {
          toast.error("Select booking date");
          return;
        }

        if (!form.time) {
          toast.error("Select booking time");
          return;
        }
      }
      if (isWalkIn) {
        form.date = new Date().toISOString().split("T")[0];
        form.time = new Date().toISOString().split("T")[1].slice(0, 5);
      }

      try {
        const payload = {
          businessProfileId,

          bookingType: form.bookingType,

          customerName: form.customerName,

          customerPhone: form.customerPhone || undefined,
          customerEmail: form.customerEmail || undefined,
          status: "CONFIRMED",

          staffId: form.staffId || undefined,

          notes: form.notes || undefined,

          discountCodeId: form.discountCodeId || undefined,

          date: new Date(form.date + "T00:00:00"),

          time: form.time,

          items: form.items,
        };

        console.log("BOOKING PAYLOAD:", payload);

        const response = await createBooking(payload);

        console.log("BOOKING RESPONSE:", response);

        if (!response) {
          toast.error("No response from server");
          return;
        }

        if (!response.success) {
          toast.error(response.error);
          return;
        }

        toast.success("Booking created successfully");

        setForm({
          bookingType: "",

          customerName: "",

          customerPhone: "",
          customerEmail: "",
          status: "",

          notes: "",

          date: "",

          time: "",

          staffId: "",

          discountCodeId: "",

          items: [],
        });

        setStep(1);
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong");
      }
    });
  };

  const addVariantService = (
    service: Service,
    variant: NonNullable<Service["variants"]>[number],
  ) => {
    const alreadyExists = form.items.some(
      (item) => item.serviceId === service.id && item.variantId === variant.id,
    );

    if (alreadyExists) {
      toast.error("Variant already added");

      return;
    }

    const payload: BookingItemPayload = {
      serviceId: service.id,

      variantId: variant.id,

      price: Number(variant.price || 0),

      duration: Number(variant.totalDuration || 0),

      staffId: form.staffId || undefined,
    };

    setForm((prev) => ({
      ...prev,

      items: [...prev.items, payload],
    }));

    toast.success(`${service.name} (${variant.name}) added`);
  };

  // ============================================================================
  // UI
  // ============================================================================

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href={`/dashboard/booking`}
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-black"
            >
              <ArrowLeft size={16} />
              Back to booking
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Booking
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage salon appointments and walk-ins.
            </p>
          </div>

          {/* <Button className="rounded-xl">Quick Walk-In</Button> */}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}

          <div className="space-y-6">
            {/* PROGRESS HEADER */}

            <div className="rounded-2xl border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 overflow-x-auto">
                {steps.map((label, index) => {
                  const current = index + 1;

                  const active = current === step;

                  const completed = current < step;

                  return (
                    <div
                      key={label}
                      className="flex min-w-[120px] items-center gap-3"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition",
                          active &&
                            "border-primary bg-primary text-primary-foreground",
                          completed &&
                            "border-green-500 bg-green-500 text-white",
                        )}
                      >
                        {current}
                      </div>

                      <div>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            active && "text-primary",
                          )}
                        >
                          {label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 1 */}

            {step === 1 && (
              <section className="rounded-2xl border bg-background p-5 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Booking Type</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Select how this booking is being created.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      label: "WALKIN",

                      icon: "🚶",

                      title: "Walk-In",

                      description: "Customer arrived without appointment.",
                    },

                    {
                      label: "PHONE",

                      icon: "📞",

                      title: "Phone Booking",

                      description: "Reservation created from phone call.",
                    },
                  ].map((type) => {
                    const active = form.bookingType === type.label;

                    return (
                      <button
                        key={type.label}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            bookingType: type.label,
                          }))
                        }
                        className={cn(
                          "rounded-2xl border p-5 text-left transition",
                          active
                            ? "border-green-500 bg-green-500/10"
                            : "hover:bg-muted/50",
                        )}
                      >
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-xl">
                          {type.icon}
                        </div>

                        <h3 className="font-semibold">{type.title}</h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    disabled={!form.bookingType}
                    onClick={() => setStep(2)}
                    className="rounded-xl"
                  >
                    Continue
                  </Button>
                </div>
              </section>
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <section className="rounded-2xl border bg-background p-5 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold">Customer Details</h2>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name</Label>

                    <Input
                      placeholder="Enter customer name"
                      value={form.customerName}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          customerName: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>

                    <Input
                      placeholder="Enter phone number"
                      value={form.customerEmail}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          customerEmail: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>

                    <Input
                      placeholder="Enter phone number"
                      value={form.customerPhone}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          customerPhone: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>

                    <textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="min-h-[100px] w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none"
                      placeholder="Special requests..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="rounded-xl"
                  >
                    Back
                  </Button>

                  <Button
                    disabled={!form.customerName}
                    onClick={() => setStep(3)}
                    className="rounded-xl"
                  >
                    Continue
                  </Button>
                </div>
              </section>
            )}

            {/* STEP 3 */}

            {step === 3 && (
              <section className="rounded-2xl border bg-background p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Services</h2>

                    <p className="text-sm text-muted-foreground">
                      Select service variants
                    </p>
                  </div>

                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      placeholder="Search services..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredServices.map((service) => (
                    <div key={service.id} className="rounded-2xl border p-4">
                      <div className="mb-4">
                        <h3 className="font-semibold">{service.name}</h3>
                      </div>

                      <div className="space-y-3">
                        {service.variants?.map((variant) => (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => addVariantService(service, variant)}
                            className="flex w-full items-center justify-between rounded-xl border p-3 text-left transition hover:border-primary hover:bg-primary/5"
                          >
                            <div>
                              <p className="font-medium">{variant.name}</p>

                              <p className="text-sm text-muted-foreground">
                                {variant.totalDuration || 0} min
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="font-semibold">
                                ₹{variant.price || 0}
                              </span>

                              <Plus className="h-4 w-4" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="rounded-xl"
                  >
                    Back
                  </Button>

                  <Button
                    disabled={form.items.length === 0}
                    onClick={() => setStep(walkin ? 4 : 4)}
                    className="rounded-xl"
                  >
                    Continue
                  </Button>
                </div>
              </section>
            )}

            {/* STEP 4 */}

            {step === 4 && (
              <section className="rounded-2xl border bg-background p-5 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold">Schedule & Staff</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* {!walkin && (
                    <>
                      <div className="space-y-2">
                        <Label>Date</Label>

                        <Input
                          type="date"
                          value={form.date}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Time</Label>

                        <Input
                          type="time"
                          value={form.time}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              time: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </>
                  )} */}

                  <div className="space-y-2 mb-4">
                    <Label>Assign Staff</Label>

                    <select
                      className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                      value={form.staffId}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          staffId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Any Available</option>

                      {staffs.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {!walkin && (
                  <section className="rounded-2xl border bg-background p-5 shadow-sm mb-5">
                    <div className="mb-5">
                      <h2 className="text-lg font-semibold">
                        Schedule & Staff
                      </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Date</Label>

                        <Input
                          type="date"
                          value={form.date}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Time</Label>

                        <Input
                          type="time"
                          value={form.time}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              time: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </section>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="rounded-xl"
                  >
                    Back
                  </Button>

                  {/* <Button
                    disabled={isPending}
                    onClick={handleCreateBooking}
                    className="rounded-xl"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Create Booking
                  </Button> */}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            <section className="sticky top-6 rounded-2xl border bg-background p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold">Booking Summary</h2>
              </div>

              <div className="space-y-4">
                {/* ITEMS */}

                <div className="space-y-3">
                  {form.items.map((item, index) => {
                    const service = services.find(
                      (s) => s.id === item.serviceId,
                    );

                    return (
                      <div key={index} className="rounded-xl border p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{service?.name}</p>

                            <p className="text-xs text-muted-foreground">
                              {item.duration} min
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <p className="font-semibold">₹{item.price}</p>

                            <button
                              type="button"
                              onClick={() => removeService(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DISCOUNT */}

                <div className="space-y-2">
                  <Label>Discount Code</Label>

                  <select
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                    value={form.discountCodeId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,

                        discountCodeId: e.target.value,
                      }))
                    }
                  >
                    <option value="">No Discount</option>

                    {discounts.map((discount) => (
                      <option key={discount.id} value={discount.id}>
                        {discount.code} ({discount.discountPercentage}% OFF)
                      </option>
                    ))}
                  </select>
                </div>

                {/* TOTAL */}

                <div className="space-y-3 rounded-xl border bg-primary/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>

                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>

                    <span>{totalDuration} min</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>

                    <span>- ₹{discountAmount}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Amount</span>

                      <span className="text-2xl font-bold">₹{finalTotal}</span>
                    </div>
                  </div>
                </div>

                {/* ACTION */}

                <div className="space-y-3 pt-2">
                  <Button
                    disabled={isPending}
                    onClick={handleCreateBooking}
                    className="h-11 w-full rounded-xl"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Create Booking
                  </Button>

                  <Button variant="outline" className="h-11 w-full rounded-xl">
                    Save as Draft
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

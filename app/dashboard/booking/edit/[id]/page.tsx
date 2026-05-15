/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import { useEffect, useState, useTransition } from "react";

// import { useRouter } from "next/navigation";

// import { ArrowLeft, Loader2, Save } from "lucide-react";

// import Link from "next/link";

// import { toast } from "sonner";

// import { getBookingById, updateBooking } from "@/actions/bookingAction";

// type Props = {
//   params: Promise<{
//     id: string;
//   }>;
// };

// export default function EditBookingPage({ params }: Props) {
//   const router = useRouter();

//   const [isPending, startTransition] = useTransition();

//   const [loading, setLoading] = useState(true);

//   const [bookingId, setBookingId] = useState("");

//   const [form, setForm] = useState({
//     customerName: "",
//     customerPhone: "",
//     customerEmail: "",
//     bookingType: "",
//     time: "",
//     notes: "",
//   });

//   useEffect(() => {
//     const loadBooking = async () => {
//       const { id } = await params;

//       setBookingId(id);

//       const res = await getBookingById(id);

//       if (!res.success || !res.data) {
//         toast.error("Booking not found");

//         router.push("/dashboard/booking");

//         return;
//       }

//       const booking = res.data;

//       setForm({
//         customerName: booking.BBABookingName || "",

//         customerPhone: booking.BBABookingPhone || "",

//         customerEmail: booking.BBABookingEmail || "",

//         bookingType: booking.bookingType || "",

//         time: booking.time || "",

//         notes: booking.notes || "",
//       });

//       setLoading(false);
//     };

//     loadBooking();
//   }, [params, router]);

//   const handleSubmit = () => {
//     startTransition(async () => {
//       const res = await updateBooking(bookingId, form);

//       if (res.success) {
//         toast.success("Booking updated successfully");

//         router.push(`/dashboard/booking/${bookingId}`);
//       } else {
//         toast.error(res.error);
//       }
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <Loader2 className="animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-muted/30 p-6">
//       <div className="mx-auto max-w-3xl space-y-6">
//         {/* HEADER */}

//         <div className="space-y-2">
//           <Link
//             href={`/dashboard/booking/${bookingId}`}
//             className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-black"
//           >
//             <ArrowLeft size={16} />
//             Back to details
//           </Link>

//           <h1 className="text-3xl font-bold">Edit Booking</h1>

//           <p className="text-muted-foreground">Update booking information</p>
//         </div>

//         {/* FORM */}

//         <div className="rounded-3xl border bg-background p-6 shadow-sm">
//           <div className="grid gap-5 md:grid-cols-2">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Customer Name</label>

//               <input
//                 type="text"
//                 value={form.customerName}
//                 onChange={(e) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     customerName: e.target.value,
//                   }))
//                 }
//                 className="h-11 w-full rounded-xl border px-4 outline-none"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Phone</label>

//               <input
//                 type="text"
//                 value={form.customerPhone}
//                 onChange={(e) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     customerPhone: e.target.value,
//                   }))
//                 }
//                 className="h-11 w-full rounded-xl border px-4 outline-none"
//               />
//             </div>

//             <div className="space-y-2 md:col-span-2">
//               <label className="text-sm font-medium">Email</label>

//               <input
//                 type="email"
//                 value={form.customerEmail}
//                 onChange={(e) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     customerEmail: e.target.value,
//                   }))
//                 }
//                 className="h-11 w-full rounded-xl border px-4 outline-none"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Booking Type</label>

//               <select
//                 value={form.bookingType}
//                 onChange={(e) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     bookingType: e.target.value,
//                   }))
//                 }
//                 className="h-11 w-full rounded-xl border px-4 outline-none"
//               >
//                 <option value="WALKIN">WALKIN</option>

//                 <option value="ONLINE">ONLINE</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Time</label>

//               <input
//                 type="time"
//                 value={form.time}
//                 onChange={(e) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     time: e.target.value,
//                   }))
//                 }
//                 className="h-11 w-full rounded-xl border px-4 outline-none"
//               />
//             </div>

//             <div className="space-y-2 md:col-span-2">
//               <label className="text-sm font-medium">Notes</label>

//               <textarea
//                 rows={5}
//                 value={form.notes}
//                 onChange={(e) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     notes: e.target.value,
//                   }))
//                 }
//                 className="w-full rounded-xl border p-4 outline-none"
//               />
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end">
//             <button
//               disabled={isPending}
//               onClick={handleSubmit}
//               className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
//             >
//               {isPending ? (
//                 <Loader2 size={16} className="animate-spin" />
//               ) : (
//                 <Save size={16} />
//               )}
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { getBookingById, updateBooking } from "@/actions/bookingAction";

import { getDiscounts } from "@/actions/discountAction";

import { getServices } from "@/actions/serviceAction";

import { getStaffs } from "@/actions/teamAction";

import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";

// import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

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

export default function EditBookingPage({ params }: Props) {
  const router = useRouter();

  const business = useBusinessStore((s) => s.business);

  const businessProfileId = business?.id;

  const [isPending, startTransition] = useTransition();

  const [loading, setLoading] = useState(true);

  const [bookingId, setBookingId] = useState("");

  const [services, setServices] = useState<Service[]>([]);

  const [staffs, setStaffs] = useState<Staff[]>([]);

  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const [serviceSearch, setServiceSearch] = useState("");

  // ============================================================================
  // FORM
  // ============================================================================

  // const [form, setForm] = useState({
  //   BBABookingName: "",

  //   BBABookingPhone: "",

  //   BBABookingEmail: "",

  //   bookingType: "WALKIN",

  //   staffId: "",

  //   date: "",

  //   time: "",

  //   totalPrice: 0,

  //   discountAmount: 0,

  //   discountCodeId: "",

  //   status: "PENDING",

  //   notes: "",

  //   cancelledReason: "",

  //   items: [] as BookingItemPayload[],
  // });

  type BookingItemPayload = {
    serviceId: string;

    variantId?: string;

    price: number;

    duration: number;

    staffId?: string;
  };

  type FormState = {
    BBABookingName: string;

    BBABookingPhone: string;

    BBABookingEmail: string;

    bookingType: "WALKIN" | "ONLINE" | "PHONE";

    staffId: string;

    date: string;

    time: string;

    totalPrice: number;

    discountAmount: number;

    discountCodeId: string;

    status: string;

    notes: string;

    cancelledReason: string;

    items: BookingItemPayload[];
  };

  const [form, setForm] = useState<FormState>({
    BBABookingName: "",

    BBABookingPhone: "",

    BBABookingEmail: "",

    bookingType: "WALKIN",

    staffId: "",

    date: "",

    time: "",

    totalPrice: 0,

    discountAmount: 0,

    discountCodeId: "",

    status: "PENDING",

    notes: "",

    cancelledReason: "",

    items: [],
  });

  // ============================================================================
  // FETCH INITIAL DATA
  // ============================================================================

  useEffect(() => {
    if (!businessProfileId) return;

    const fetchInitialData = async () => {
      try {
        const [serviceResponse, staffResponse, discountResponse] =
          await Promise.all([
            getServices(businessProfileId),
            getStaffs(businessProfileId),
            getDiscounts(businessProfileId),
          ]);

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

    fetchInitialData();
  }, [businessProfileId]);

  // ============================================================================
  // LOAD BOOKING
  // ============================================================================

  useEffect(() => {
    const loadBooking = async () => {
      const { id } = await params;

      setBookingId(id);

      const res = await getBookingById(id);

      console.log("Fetched booking:", res); // Debugging log

      if (!res.success || !res.data) {
        toast.error("Booking not found");

        router.push("/dashboard/booking");

        return;
      }

      const booking = res.data;

      setForm({
        BBABookingName: booking.BBABookingName || "",

        BBABookingPhone: booking.BBABookingPhone || "",

        BBABookingEmail: booking.BBABookingEmail || "",

        bookingType: (booking.bookingType || "WALKIN") as
          | "WALKIN"
          | "ONLINE"
          | "PHONE",

        staffId: booking.staffId || "",

        date: booking.date
          ? new Date(booking.date).toISOString().split("T")[0]
          : "",

        time: booking.time || "",

        totalPrice: booking.totalPrice || 0,

        discountAmount: booking.discountAmount || 0,

        discountCodeId: booking.discountCodeId || "",

        status: booking.status || "PENDING",

        notes: booking.notes || "",

        cancelledReason: booking.cancelledReason || "",

        items:
          booking.items?.map((item: any) => ({
            serviceId: item.serviceId,

            variantId: item.variantId || undefined,

            price: item.price || 0,

            duration: item.duration || 0,

            staffId: item.staffId || undefined,
          })) || [],
      });

      setLoading(false);
    };

    loadBooking();
  }, [params, router]);

  // ============================================================================
  // FILTER SERVICES
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

  // ============================================================================
  // TOTALS
  // ============================================================================

  const subtotal = form.items.reduce((acc, item) => acc + item.price, 0);

  const totalDuration = form.items.reduce(
    (acc, item) => acc + item.duration,
    0,
  );

  const selectedDiscount = discounts.find((d) => d.id === form.discountCodeId);

  const calculatedDiscount = selectedDiscount
    ? Math.floor(subtotal * (selectedDiscount.discountPercentage / 100))
    : form.discountAmount;

  const finalTotal = subtotal - calculatedDiscount;

  // ============================================================================
  // ADD VARIANT
  // ============================================================================

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

    toast.success("Service added");
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
  // SUBMIT
  // ============================================================================

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const payload: {
          BBABookingName: string;
          BBABookingPhone: string;
          BBABookingEmail: string;
          bookingType: "WALKIN" | "ONLINE" | "PHONE";
          staffId?: string;
          date: Date;
          time: string;
          totalPrice: number;
          discountAmount: number;
          discountCodeId?: string;
          status: BookingStatus;
          notes: string;
          cancelledReason: string | null;
          items: BookingItemPayload[];
        } = {
          BBABookingName: form.BBABookingName,

          BBABookingPhone: form.BBABookingPhone,

          BBABookingEmail: form.BBABookingEmail,

          bookingType: form.bookingType,

          staffId: form.staffId || undefined,

          date: new Date(form.date),

          time: form.time,

          totalPrice: finalTotal,

          discountAmount: calculatedDiscount,

          discountCodeId: form.discountCodeId || undefined,

          status: form.status as BookingStatus,

          notes: form.notes,

          cancelledReason:
            form.status === "CANCELLED" ? form.cancelledReason : null,

          items: form.items,
        };

        const res = await updateBooking(bookingId, payload);

        if (!res.success) {
          toast.error(res.error);

          return;
        }

        toast.success("Booking updated");

        router.push(`/dashboard/booking`);
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong");
      }
    });
  };

  // ============================================================================
  // LOADING
  // ============================================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
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
            <Link
              href={`/dashboard/booking`}
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-black"
            >
              <ArrowLeft size={16} />
              Back to booking
            </Link>

            <h1 className="text-3xl font-bold">Edit Booking</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Update customer, services, schedule, pricing and booking details.
            </p>
          </div>

          <Button
            disabled={isPending}
            onClick={handleSubmit}
            className="h-11 rounded-xl px-6"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}

          <div className="space-y-6">
            {/* CUSTOMER */}

            <section className="rounded-3xl border bg-background p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold">
                Customer Information
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Customer Name</Label>

                  <Input
                    value={form.BBABookingName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        BBABookingName: e.target.value,
                      }))
                    }
                    placeholder="Customer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>

                  <Input
                    value={form.BBABookingPhone}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        BBABookingPhone: e.target.value,
                      }))
                    }
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Email Address</Label>

                  <Input
                    type="email"
                    value={form.BBABookingEmail}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        BBABookingEmail: e.target.value,
                      }))
                    }
                    placeholder="customer@email.com"
                  />
                </div>
              </div>
            </section>

            {/* BOOKING DETAILS */}

            <section className="rounded-3xl border bg-background p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold">Booking Details</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Booking Type</Label>

                  <select
                    value={form.bookingType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        bookingType: e.target.value as
                          | "WALKIN"
                          | "ONLINE"
                          | "PHONE",
                      }))
                    }
                    className="h-11 w-full rounded-xl border bg-background px-3"
                  >
                    <option value="WALKIN">WALKIN</option>

                    <option value="ONLINE">ONLINE</option>

                    <option value="PHONE">PHONE</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as BookingStatus,
                      }))
                    }
                    className={cn(
                      "h-11 w-full rounded-xl border px-3 font-medium text-white",
                      form.status === "CONFIRMED" &&
                        "bg-green-600 border-green-600",
                      form.status === "PENDING" &&
                        "bg-yellow-500 border-yellow-500 text-black",
                      form.status === "COMPLETED" &&
                        "bg-blue-600 border-blue-600",
                      form.status === "CANCELLED" &&
                        "bg-red-600 border-red-600",
                    )}
                  >
                    <option value="PENDING">PENDING</option>

                    <option value="CONFIRMED">CONFIRMED</option>

                    <option value="COMPLETED">COMPLETED</option>

                    <option value="CANCELLED">CANCELLED</option>
                    </select>

                  {/* <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as BookingStatus,
                      }))
                    }
                    className="h-11 w-full rounded-xl border bg-background px-3"
                  >
                    <option value="PENDING">PENDING</option>

                    <option value="CONFIRMED">CONFIRMED</option>

                    <option value="COMPLETED">COMPLETED</option>

                    <option value="CANCELLED">CANCELLED</option>
                  </select> */}
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
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

                <div className="space-y-2 md:col-span-2">
                  <Label>Assign Staff</Label>

                  <select
                    value={form.staffId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        staffId: e.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-xl border bg-background px-3"
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
            </section>

            {/* SERVICES */}

            <section className="rounded-3xl border bg-background p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Services</h2>

                  <p className="text-sm text-muted-foreground">
                    Add or remove booking services
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
                    <h3 className="mb-4 font-semibold">{service.name}</h3>

                    <div className="space-y-3">
                      {service.variants?.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => addVariantService(service, variant)}
                          className="flex w-full items-center justify-between rounded-xl border p-3 text-left transition hover:bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">{variant.name}</p>

                            <p className="text-sm text-muted-foreground">
                              {variant.totalDuration} min
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
            </section>

            {/* NOTES */}

            <section className="rounded-3xl border bg-background p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold">
                Notes & Cancellation
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Notes</Label>

                  <textarea
                    rows={5}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border p-4 outline-none"
                    placeholder="Additional booking notes..."
                  />
                </div>

                {form.status === "CANCELLED" && (
                  <div className="space-y-2">
                    <Label>Cancellation Reason</Label>

                    <textarea
                      rows={4}
                      value={form.cancelledReason}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          cancelledReason: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border p-4 outline-none"
                      placeholder="Why was this booking cancelled?"
                    />
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}

          <div className="space-y-6">
            <section className="sticky top-6 rounded-3xl border bg-background p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold">Booking Summary</h2>

              {/* ITEMS */}

              <div className="space-y-3">
                {form.items.map((item, index) => {
                  const service = services.find((s) => s.id === item.serviceId);

                  const variant = service?.variants?.find(
                    (v) => v.id === item.variantId,
                  );

                  return (
                    <div key={index} className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{service?.name}</p>

                          <p className="text-sm text-muted-foreground">
                            {variant?.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.duration} min
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">₹{item.price}</p>

                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="mt-2 inline-flex"
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

              <div className="mt-5 space-y-2">
                <Label>Discount Code</Label>

                <select
                  value={form.discountCodeId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountCodeId: e.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border bg-background px-3"
                >
                  <option value="">No Discount</option>

                  {discounts.map((discount) => (
                    <option key={discount.id} value={discount.id}>
                      {discount.code} ({discount.discountPercentage}% OFF)
                    </option>
                  ))}
                </select>
              </div>

              {/* TOTALS */}

              <div className="mt-5 space-y-4 rounded-2xl border bg-muted/40 p-4">
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

                  <span>- ₹{calculatedDiscount}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>

                    <span className="text-2xl font-bold">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* SAVE */}

              <Button
                disabled={isPending}
                onClick={handleSubmit}
                className="mt-5 h-11 w-full rounded-xl"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Update Booking
              </Button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

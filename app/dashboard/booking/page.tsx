// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import { useState, useMemo } from "react";
// import { DataTable } from "@/components/data-table";
// import inquery from "../booking.json";
// import data from "../booking-data.json";
// import Link from "next/link";

// export default function Page() {
//   const [search, setSearch] = useState("");
//   const [service, setService] = useState("");

//   // ✅ filtering logic
//   const filteredData = useMemo(() => {
//     return data.filter((item: any) => {
//       const matchesSearch =
//         item.name?.toLowerCase().includes(search.toLowerCase()) ||
//         item.contact?.toLowerCase().includes(search.toLowerCase());

//       const matchesService = service ? item.service === service : true;

//       return matchesSearch && matchesService;
//     });
//   }, [search, service]);

//   // ✅ unique services for dropdown
//   const services = [...new Set(data.map((d: any) => d.service))];

//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex justify-between">
//         <h1 className="text-xl font-bold">Inquery Page</h1>
//         <Link
//           href="/dashboard/booking/create-booking"
//           className="flex items-center gap-1 text-blue-600 hover:underline"
//         >
//           <span>New Booking</span>
//         </Link>
//       </div>

//       {/* 🔍 Filters */}
//       <div className="flex flex-wrap gap-3">
//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by name or contact"
//           className="border px-3 py-2 rounded w-60"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         {/* Service Filter */}
//         <select
//           className="border px-3 py-2 rounded"
//           value={service}
//           onChange={(e) => setService(e.target.value)}
//         >
//           <option value="">All Services</option>
//           {services.map((s: string) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>

//         {/* Reset */}
//         <button
//           onClick={() => {
//             setSearch("");
//             setService("");
//           }}
//           className="bg-gray-200 px-3 py-2 rounded"
//         >
//           Reset
//         </button>
//       </div>

//       {/* 📊 Table */}
//       <DataTable
//         TableName="Booking Table"
//         data={filteredData}
//         columns={inquery}
//       />
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  Eye,
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { deleteBooking, getBookings } from "@/actions/bookingAction";

import { DataTable } from "@/components/data-table";

import inquery from "../booking.json";
import { getBusinessProfile } from "@/actions/businesssAction";

export default function BookingPage() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [service, setService] = useState("");

  const [bookings, setBookings] = useState<any[]>([]);

  // ============================================================================
  // FETCH BOOKINGS
  // ============================================================================

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const businessProfile = await getBusinessProfile();

        console.log(
          "Business ID from store:",
          businessProfile.businessProfile?.id,
        ); // Debugging log

        const businessProfileId = businessProfile.businessProfile?.id;

        if (!businessProfileId) {
          toast.error("Business profile not found");
          return;
        }

        const res = await getBookings(businessProfileId);

        console.log("Fetched Bookings:", res); // Debugging log

        if (res.success) {
          setBookings(res.data || []);
        } else {
          toast.error(res.error || "Failed to fetch bookings");
        }
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ============================================================================
  // FILTERED DATA
  // ============================================================================

  const filteredData = useMemo(() => {
    return bookings.filter((item: any) => {
      const customerName = item.BBABookingName || item.customer?.name || "";

      const customerPhone = item.BBABookingPhone || item.customer?.phone || "";

      const serviceNames =
        item.items
          ?.map((i: any) => i.service?.name)
          .join(", ")
          .toLowerCase() || "";

      const matchesSearch =
        customerName.toLowerCase().includes(search.toLowerCase()) ||
        customerPhone.toLowerCase().includes(search.toLowerCase());

      const matchesService = service
        ? serviceNames.includes(service.toLowerCase())
        : true;

      return matchesSearch && matchesService;
    });
  }, [bookings, search, service]);

  // ============================================================================
  // UNIQUE SERVICES
  // ============================================================================

  const services = [
    ...new Set(
      bookings.flatMap((booking: any) =>
        booking.items?.map((item: any) => item.service?.name),
      ),
    ),
  ].filter(Boolean);

  // ============================================================================
  // DELETE BOOKING
  // ============================================================================

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this booking?");

    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteBooking(id);

      if (res.success) {
        toast.success(res.message);

        setBookings((prev) => prev.filter((booking) => booking.id !== id));
      } else {
        toast.error(res.error);
      }
    });
  };

  // ============================================================================
  // TABLE DATA
  // ============================================================================

  // const tableData = filteredData.map((item: any) => ({
  //   id: item.id,

  //   name: item.BBABookingName || item.customer?.name || "Unknown",

  //   contact: item.BBABookingPhone || item.customer?.phone || "N/A",

  //   service: item.items?.map((i: any) => i.service?.name).join(", ") || "N/A",

  //   status: item.status,

  //   bookingType: item.bookingType || "Walk-In",

  //   totalPrice: item.totalPrice ? `₹${item.totalPrice}` : "₹0",

  //   date: item.date ? new Date(item.date).toLocaleDateString() : "N/A",

  //   time: item.time || "N/A",

  //   action: (
  //     <div className="flex items-center gap-2">
  //       {/* WhatsApp */}
  //       <button
  //         onClick={() => {
  //           const phone = item.BBABookingPhone || item.customer?.phone;

  //           if (!phone) {
  //             toast.error("Phone number not found");

  //             return;
  //           }

  //           window.open(`https://wa.me/${phone}`, "_blank");
  //         }}
  //         className="rounded-lg border p-2 text-green-600 transition hover:bg-green-50"
  //       >
  //         <MessageCircle size={16} />
  //       </button>

  //       {/* View */}
  //       <Link
  //         href={`/dashboard/booking/${item.id}`}
  //         className="rounded-lg border p-2 text-blue-600 transition hover:bg-blue-50"
  //       >
  //         <Eye size={16} />
  //       </Link>

  //       {/* Edit */}
  //       <Link
  //         href={`/dashboard/booking/edit/${item.id}`}
  //         className="rounded-lg border p-2 text-yellow-600 transition hover:bg-yellow-50"
  //       >
  //         <Pencil size={16} />
  //       </Link>

  //       {/* Delete */}
  //       <button
  //         disabled={isPending}
  //         onClick={() => handleDelete(item.id)}
  //         className="rounded-lg border p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
  //       >
  //         {isPending ? (
  //           <Loader2 size={16} className="animate-spin" />
  //         ) : (
  //           <Trash2 size={16} />
  //         )}
  //       </button>
  //     </div>
  //   ),
  // }));

  const tableData = filteredData.map((item: any) => ({
    id: item.id,

    name: item.BBABookingName || item.customer?.name || "Unknown",

    contact: item.BBABookingPhone || item.customer?.phone || "N/A",

    service: item.items?.map((i: any) => i.service?.name).join(", ") || "N/A",

    staff: item.staff?.name || "Unassigned",

    status: item.status,

    bookingType: item.bookingType || "Walk-In",

    totalPrice: item.totalPrice ? `₹${item.totalPrice}` : "₹0",

    date: item.date ? new Date(item.date).toLocaleDateString() : "N/A",

    time: item.time || "N/A",

    action: (
      <div className="flex items-center gap-2">
        {/* WhatsApp */}
        <button
          onClick={() => {
            const phone = item.BBABookingPhone || item.customer?.phone;

            if (!phone) {
              toast.error("Phone number not found");

              return;
            }

            window.open(`https://wa.me/${phone}`, "_blank");
          }}
          className="rounded-lg border p-2 text-green-600 transition hover:bg-green-50"
        >
          <MessageCircle size={16} />
        </button>

        {/* View */}
        <Link
          href={`/dashboard/booking/view/${item.id}`}
          className="rounded-lg border p-2 text-blue-600 transition hover:bg-blue-50"
        >
          <Eye size={16} />
        </Link>

        {/* Edit */}
        <Link
          href={`/dashboard/booking/edit/${item.id}`}
          className="rounded-lg border p-2 text-yellow-600 transition hover:bg-yellow-50"
        >
          <Pencil size={16} />
        </Link>

        {/* Delete */}
        <button
          disabled={isPending}
          onClick={() => handleDelete(item.id)}
          className="rounded-lg border p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    ),
  }));

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ============================================================================
            HEADER
        ============================================================================ */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Booking Management
            </h1>

            <p className="text-muted-foreground">
              Manage customer bookings and appointments
            </p>
          </div>

          <Link
            href="/dashboard/booking/create-booking"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus size={18} />

            <span>New Booking</span>
          </Link>
        </div>

        {/* ============================================================================
            FILTERS
        ============================================================================ */}

        <div className="rounded-2xl border bg-background p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                placeholder="Search by customer or phone"
                className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 outline-none transition focus:border-black"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Service Filter */}
            <select
              className="h-11 rounded-xl border bg-background px-4 outline-none"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="">All Services</option>

              {services.map((s: any) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Reset */}
            <button
              onClick={() => {
                setSearch("");

                setService("");
              }}
              className="h-11 rounded-xl border px-4 transition hover:bg-muted"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ============================================================================
            TABLE
        ============================================================================ */}

        <div className="rounded-2xl border bg-background p-4 shadow-sm">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <DataTable
              TableName="Booking Table"
              data={tableData}
              columns={inquery}
            />
          )}
        </div>
      </div>
    </div>
  );
}

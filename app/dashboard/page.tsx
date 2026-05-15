/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
// import { SectionCards } from "@/components/section-cards";

// import data from "./data.json";
// import inquery from "./inquery.json";
// import bookingData from "./booking-data.json";
// import booking from "./booking.json";

// // ✅ safest way (no timezone bugs)
// function getTodayDate() {
//   return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
// }

// // ✅ get today's bookings
// function getTodayBookings() {
//   const today = getTodayDate();

//   return bookingData.filter((item) => item.date === today);
// }

// useEffect(() => {
//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const businessProfile = await getBusinessProfile();

//       console.log(
//         "Business ID from store:",
//         businessProfile.businessProfile?.id,
//       ); // Debugging log

//       const businessProfileId = businessProfile.businessProfile?.id;

//       if (!businessProfileId) {
//         toast.error("Business profile not found");
//         return;
//       }

//       const res = await getBookings(businessProfileId);

//       console.log("Fetched Bookings:", res); // Debugging log

//       if (res.success) {
//         setBookings(res.data || []);
//       } else {
//         toast.error(res.error || "Failed to fetch bookings");
//       }
//     } catch (error) {
//       console.error(error);

//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchBookings();
// }, []);

// export default function Page() {
//   const todayBookings = getTodayBookings();

//   //  console.log("Today:", getTodayDate());
//   //  console.log("Today's Bookings:", todayBookings);

//   return (
//     <div className="flex flex-1 flex-col">
//       <div className="@container/main flex flex-1 flex-col gap-2">
//         <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//           <SectionCards />
//           <div className="px-4 lg:px-6">
//             <ChartAreaInteractive />
//           </div>
//           <DataTable
//             TableName="Today's Booking Table"
//             data={todayBookings}
//             columns={booking}
//           />
//           <DataTable TableName="Inquery Table" data={data} columns={inquery} />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";

import { DataTable } from "@/components/data-table";

import { SectionCards } from "@/components/section-cards";

import { getBookings } from "@/actions/bookingAction";

import { getBusinessProfile } from "@/actions/businesssAction";

import bookingColumns from "./booking.json";

import inquiryColumns from "./inquery.json";
import { getLeads } from "@/actions/leadAction";

type Booking = {
  id: string;

  BBABookingName?: string | null;

  BBABookingPhone?: string | null;

  BBABookingEmail?: string | null;

  bookingType?: string | null;

  date: string | Date;

  time: string;

  totalPrice?: number | null;

  status: string;

  createdAt: string | Date;

  items?: any[];

  notes?: string | null;
};

type Inquiry = {
  id: string;

  name?: string | null;

  contact?: string | null;

  service?: string | null;

  status: string;

  source?: string | null;

  createdAt: string | Date;
};

export default function DashboardClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiryData, setInquiryData] = useState<Inquiry[]>([]);

  const [loading, setLoading] = useState(true);

  // ============================================================================
  // FETCH BOOKINGS
  // ============================================================================

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const businessProfile = await getBusinessProfile();

        const businessProfileId = businessProfile.businessProfile?.id;

        if (!businessProfileId) {
          toast.error("Business profile not found");

          return;
        }

        const res = await getBookings(businessProfileId);

        if (!res.success) {
          toast.error(res.error || "Failed to fetch bookings");

          return;
        }

        setBookings(res.data || []);
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const fetchLeads = async () => {
      setLoading(true);

      try {
        const response = await getLeads();

        console.log("Fetched leads:", response); // Debugging log

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

    fetchBookings();
  }, []);

  // ============================================================================
  // TODAY BOOKINGS
  // ============================================================================

  const todayBookings = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date).toISOString().split("T")[0];

      return bookingDate === today;
    });
  }, [bookings]);

  // ============================================================================
  // INQUIRIES
  // ============================================================================

  const inquiries = useMemo(() => {
    return bookings.filter((booking) =>
      booking.bookingType?.toLowerCase().includes("inquiry"),
    );
  }, [bookings]);

  // ============================================================================
  // TABLE DATA
  // ============================================================================

  const bookingTableData = useMemo(() => {
    return todayBookings.map((booking) => ({
      id: booking.id,

      name: booking.BBABookingName || "Walk-in Customer",

      contact: booking.BBABookingPhone || "-",

      service:
        booking.items?.map((item: any) => item.service?.name).join(", ") || "-",

      date: new Date(booking.date).toLocaleDateString(),

      time: booking.time,

      bookingConfirmation: booking.status,

      amount: booking.totalPrice || 0,
    }));
  }, [todayBookings]);

  const inquiryTableData = useMemo(() => {
    return inquiryData.map((lead) => ({
      id: lead.id,

      name: lead.name || "-",

      contact: lead.contact || "-",

      service: lead.service || "-",

      status: lead.status,

      source: lead.source || "-",

      createdAt: new Date(lead.createdAt).toLocaleDateString(),
    }));
  }, [inquiryData]);

  // ============================================================================
  // UI
  // ============================================================================

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>

          <DataTable
            TableName="Today's Booking Table"
            data={bookingTableData}
            columns={bookingColumns}
            loading={loading}
          />

          <DataTable
            TableName="Inquiry Table"
            data={inquiryTableData}
            columns={inquiryColumns}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

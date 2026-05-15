/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  CreditCard,
  Mail,
  MessageCircle,
  Phone,
  User2,
} from "lucide-react";

import { notFound } from "next/navigation";

import { getBookingById } from "@/actions/bookingAction";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookingDetailsPage({ params }: Props) {
  const { id } = await params;

  const res = await getBookingById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const booking = res.data;

  const customerName =
    booking.BBABookingName || booking.customer?.name || "Unknown Customer";

  const customerPhone =
    booking.BBABookingPhone || booking.customer?.phone || "N/A";

  const customerEmail =
    booking.BBABookingEmail || booking.customer?.email || "N/A";

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <Link
              href="/dashboard/booking"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-black"
            >
              <ArrowLeft size={16} />
              Back to bookings
            </Link>

            <h1 className="text-3xl font-bold tracking-tight">
              Booking Details
            </h1>

            <p className="text-muted-foreground">
              View complete booking information
            </p>
          </div>

          <Link
            href={`/dashboard/booking/edit/${booking.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Edit Booking
          </Link>
        </div>

        {/* TOP GRID */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* CUSTOMER */}

          <div className="rounded-3xl border bg-background p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-black p-3 text-white">
                <User2 size={20} />
              </div>

              <div>
                <h2 className="font-semibold">Customer</h2>

                <p className="text-sm text-muted-foreground">
                  Customer information
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>

                <h3 className="font-medium">{customerName}</h3>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-muted-foreground" />

                <span>{customerPhone}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-muted-foreground" />

                <span>{customerEmail}</span>
              </div>

              {customerPhone !== "N/A" && (
                <a
                  href={`https://wa.me/${customerPhone}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition hover:bg-green-500 bg-green-600 text-white"
                >
                  <MessageCircle size={16} />
                  WhatsApp Customer
                </a>
              )}
            </div>
          </div>

          {/* BOOKING */}

          <div className="rounded-3xl border bg-background p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-black p-3 text-white">
                <CalendarDays size={20} />
              </div>

              <div>
                <h2 className="font-semibold">Booking</h2>

                <p className="text-sm text-muted-foreground">
                  Appointment details
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>

                <h3 className="font-medium">
                  {new Date(booking.date).toLocaleDateString()}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <Clock3 size={16} className="text-muted-foreground" />

                <span>{booking.time}</span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Booking Type</p>

                <h3 className="font-medium">{booking.bookingType}</h3>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>

                <div
                  className={cn(
                    "mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium text-white",
                    booking.status === "CONFIRMED" && "bg-green-600",
                    booking.status === "PENDING" && "bg-yellow-500",
                    booking.status === "CANCELLED" && "bg-red-600",
                    booking.status === "COMPLETED" && "bg-blue-600",
                  )}
                >
                  {booking.status}
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT */}

          <div className="rounded-3xl border bg-background p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-black p-3 text-white">
                <CreditCard size={20} />
              </div>

              <div>
                <h2 className="font-semibold">Payment</h2>

                <p className="text-sm text-muted-foreground">
                  Booking payment summary
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>

                <h3 className="text-3xl font-bold">₹{booking.totalPrice}</h3>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Discount</p>

                <h3 className="font-medium">₹{booking.discountAmount || 0}</h3>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Staff</p>

                <h3 className="font-medium">
                  {booking.staff?.name || "Not Assigned"}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* SERVICES */}

        <div className="rounded-3xl border bg-background p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Services</h2>

            <p className="text-sm text-muted-foreground">
              Services included in this booking
            </p>
          </div>

          <div className="space-y-4">
            {booking.items.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border p-5 md:flex-row md:items-center"
              >
                <div>
                  <h3 className="font-semibold">{item.service?.name}</h3>

                  <p className="text-sm text-muted-foreground">
                    Variant: {item.variant?.name || "Default"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Duration: {item.duration} mins
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Price</p>

                  <h3 className="text-xl font-bold">₹{item.price}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NOTES */}

        {booking.notes && (
          <div className="rounded-3xl border bg-background p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">Notes</h2>

            <p className="leading-relaxed text-muted-foreground">
              {booking.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

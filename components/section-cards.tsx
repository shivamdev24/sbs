// "use client"

// import { Badge } from "@/components/ui/badge"
// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

// export function SectionCards() {
//   return (
//     <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Total Bookings</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             100
//           </CardTitle>
//           {/* <CardAction>
//             <Badge variant="outline">
//               <TrendingUpIcon
//               />
//               +12.5%
//             </Badge>
//           </CardAction> */}
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Total bookings this month
//           </div>
//           <div className="text-muted-foreground">Compared to last month</div>
//           {/* <div className="line-clamp-1 flex gap-2 font-medium">
//             12% more bookings this month
//             <TrendingUpIcon className="size-4" />
//           </div>
//           <div className="text-muted-foreground">Compared to last month</div> */}
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>New Bookings</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             34
//           </CardTitle>
//           {/* <CardAction>
//             <Badge variant="outline">
//               <TrendingDownIcon
//               />
//               -20%
//             </Badge>
//           </CardAction> */}
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             New clients
//           </div>
//           <div className="text-muted-foreground">
//             Consider running offers or ads
//           </div>
//           {/* <div className="line-clamp-1 flex gap-2 font-medium">
//             Slight drop in new clients <TrendingDownIcon className="size-4" />
//           </div>
//           <div className="text-muted-foreground">
//             Consider running offers or ads
//           </div> */}
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Total Earning</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             45,678
//           </CardTitle>
//           {/* <CardAction>
//             <Badge variant="outline">
//               <TrendingUpIcon
//               />
//               +12.5%
//             </Badge>
//           </CardAction> */}
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Revenue growing steadily
//           </div>
//           <div className="text-muted-foreground">
//             Driven by repeat customers
//           </div>
//           {/* <div className="line-clamp-1 flex gap-2 font-medium">
//             Revenue growing steadily <TrendingUpIcon className="size-4" />
//           </div>
//           <div className="text-muted-foreground">
//             Driven by repeat customers
//           </div> */}
//         </CardFooter>
//       </Card>
//       <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>New Inquery</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             10
//           </CardTitle>
//           {/* <CardAction>
//             <Badge variant="outline">
//               <TrendingUpIcon
//               />
//               +4.5%
//             </Badge>
//           </CardAction> */}
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm bg-amber-100">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Leads coming in consistently
//           </div>
//           <div className="text-muted-foreground">
//             {" "}
//             Follow up quickly to convert
//           </div>
//           {/* <div className="line-clamp-1 flex gap-2 font-medium">
//             Leads coming in consistently <TrendingUpIcon className="size-4" />
//           </div>
//           <div className="text-muted-foreground">
//             {" "}
//             Follow up quickly to convert
//           </div> */}
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

"use client";

import * as React from "react";

import {
  TrendingDownIcon,
  TrendingUpIcon,
  CalendarCheck2,
  IndianRupee,
  Users,
  MessageSquareMore,
} from "lucide-react";

import { getBookings } from "@/actions/bookingAction";

import { getLeads } from "@/actions/leadAction";

import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ============================================================================
// TYPES
// ============================================================================

type Booking = {
  id: string;

  status: string;

  totalPrice?: number | null;

  createdAt: string | Date;
};

type Lead = {
  id: string;

  status?: string;

  createdAt: string | Date;
};

// ============================================================================
// HELPERS
// ============================================================================

const getThisMonthItems = <T extends { createdAt: string | Date }>(
  items: T[],
) => {
  const now = new Date();

  return items.filter((item) => {
    const date = new Date(item.createdAt);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });
};

const getLastMonthItems = <T extends { createdAt: string | Date }>(
  items: T[],
) => {
  const now = new Date();

  const lastMonth = now.getMonth() - 1;

  return items.filter((item) => {
    const date = new Date(item.createdAt);

    return (
      date.getMonth() === lastMonth && date.getFullYear() === now.getFullYear()
    );
  });
};

const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;

  return Number((((current - previous) / previous) * 100).toFixed(1));
};

// ============================================================================
// COMPONENT
// ============================================================================

export function SectionCards() {
  const business = useBusinessStore((s) => s.business);

  const businessProfileId = business?.id;

  const [loading, setLoading] = React.useState(true);

  const [bookings, setBookings] = React.useState<Booking[]>([]);

  const [leads, setLeads] = React.useState<Lead[]>([]);

  // ============================================================================
  // FETCH
  // ============================================================================

  React.useEffect(() => {
    const fetchData = async () => {
      if (!businessProfileId) return;

      try {
        setLoading(true);

        const [bookingResponse, leadResponse] = await Promise.all([
          getBookings(businessProfileId),
          getLeads(),
        ]);

        if (bookingResponse.success) {
          setBookings(bookingResponse.data || []);
        }

        if (leadResponse.success) {
          setLeads(leadResponse.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessProfileId]);

  console.log("Bookings in SectionCards:", bookings); // Debugging log
  console.log("Leads in SectionCards:", leads); // Debugging log

  // ============================================================================
  // CALCULATIONS
  // ============================================================================

  const thisMonthBookings = getThisMonthItems(bookings);

  const lastMonthBookings = getLastMonthItems(bookings);

  const completedBookings = thisMonthBookings.filter(
    (booking) =>
      booking.status === "COMPLETED" || booking.status === "CONFIRMED",
  );

  const totalRevenue = completedBookings.reduce(
    (acc, booking) => acc + Number(booking.totalPrice || 0),
    0,
  );

  const bookingGrowth = calculateGrowth(
    thisMonthBookings.length,
    lastMonthBookings.length,
  );

  const thisMonthLeads = getThisMonthItems(leads);

  const lastMonthLeads = getLastMonthItems(leads);

  const leadGrowth = calculateGrowth(
    thisMonthLeads.length,
    lastMonthLeads.length,
  );

  const confirmedBookings = thisMonthBookings.filter(
    (booking) =>
      booking.status === "CONFIRMED" || booking.status === "COMPLETED",
  );

  const conversionRate =
    thisMonthLeads.length > 0
      ? Math.round((confirmedBookings.length / thisMonthLeads.length) * 100)
      : 0;

  // ============================================================================
  // CARD DATA
  // ============================================================================

  const cards = [
    {
      title: "Total Bookings",

      value: thisMonthBookings.length,

      icon: CalendarCheck2,

      growth: bookingGrowth,

      positive: bookingGrowth >= 0,

      description: "Total appointments this month",

      subText: "Compared to last month",
    },

    {
      title: "New Leads",

      value: thisMonthLeads.length,

      icon: Users,

      growth: leadGrowth,

      positive: leadGrowth >= 0,

      description: "Fresh customer inquiries",

      subText: "Track lead generation",
    },

    {
      title: "Revenue",

      value: `₹${totalRevenue.toLocaleString()}`,

      icon: IndianRupee,

      growth: bookingGrowth,

      positive: bookingGrowth >= 0,

      description: "Revenue from bookings",

      subText: "Confirmed & completed bookings",
    },

    {
      title: "Conversion Rate",

      value: `${conversionRate}%`,

      icon: MessageSquareMore,

      growth: conversionRate,

      positive: conversionRate >= 50,

      description: "Lead to booking conversion",

      subText: "Higher is better",
    },
  ];

  // ============================================================================
  // UI
  // ============================================================================

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 2xl:grid-cols-4 lg:px-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="overflow-hidden rounded-3xl border bg-gradient-to-b from-background to-muted/20 shadow-sm"
          >
            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-background">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <CardDescription className="text-sm">
                      {card.title}
                    </CardDescription>

                    <CardTitle className="mt-2 text-3xl font-bold tracking-tight">
                      {loading ? "..." : card.value}
                    </CardTitle>
                  </div>
                </div>

                {!loading && (
                  <CardAction>
                    <Badge
                      variant="outline"
                      className="rounded-full px-2.5 py-1"
                    >
                      {card.positive ? (
                        <TrendingUpIcon className="mr-1 h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <TrendingDownIcon className="mr-1 h-3.5 w-3.5 text-red-500" />
                      )}
                      {Math.abs(card.growth)}%
                    </Badge>
                  </CardAction>
                )}
              </div>
            </CardHeader>

            <CardFooter className="flex flex-col items-start gap-1 border-t bg-muted/20 px-6 py-4 text-sm">
              <div className="flex items-center gap-2 font-medium">
                {card.description}

                {card.positive ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-red-500" />
                )}
              </div>

              <p className="text-muted-foreground">{card.subText}</p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

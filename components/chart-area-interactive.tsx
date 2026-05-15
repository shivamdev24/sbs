/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import * as React from "react"
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

// import { useIsMobile } from "@/hooks/use-mobile"
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   type ChartConfig,
// } from "@/components/ui/chart"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   ToggleGroup,
//   ToggleGroupItem,
// } from "@/components/ui/toggle-group"

// export const description = "An interactive area chart"

// const chartData = [
//   { date: "2024-04-01", desktop: 222, mobile: 150 },
//   { date: "2024-04-02", desktop: 97, mobile: 180 },
//   { date: "2024-04-03", desktop: 167, mobile: 120 },
//   { date: "2024-04-04", desktop: 242, mobile: 260 },
//   { date: "2024-04-05", desktop: 373, mobile: 290 },
//   { date: "2024-04-06", desktop: 301, mobile: 340 },
//   { date: "2024-04-07", desktop: 245, mobile: 180 },
//   { date: "2024-04-08", desktop: 409, mobile: 320 },
//   { date: "2024-04-09", desktop: 59, mobile: 110 },
//   { date: "2024-04-10", desktop: 261, mobile: 190 },
//   { date: "2024-04-11", desktop: 327, mobile: 350 },
//   { date: "2024-04-12", desktop: 292, mobile: 210 },
//   { date: "2024-04-13", desktop: 342, mobile: 380 },
//   { date: "2024-04-14", desktop: 137, mobile: 220 },
//   { date: "2024-04-15", desktop: 120, mobile: 170 },
//   { date: "2024-04-16", desktop: 138, mobile: 190 },
//   { date: "2024-04-17", desktop: 446, mobile: 360 },
//   { date: "2024-04-18", desktop: 364, mobile: 410 },
//   { date: "2024-04-19", desktop: 243, mobile: 180 },
//   { date: "2024-04-20", desktop: 89, mobile: 150 },
//   { date: "2024-04-21", desktop: 137, mobile: 200 },
//   { date: "2024-04-22", desktop: 224, mobile: 170 },
//   { date: "2024-04-23", desktop: 138, mobile: 230 },
//   { date: "2024-04-24", desktop: 387, mobile: 290 },
//   { date: "2024-04-25", desktop: 215, mobile: 250 },
//   { date: "2024-04-26", desktop: 75, mobile: 130 },
//   { date: "2024-04-27", desktop: 383, mobile: 420 },
//   { date: "2024-04-28", desktop: 122, mobile: 180 },
//   { date: "2024-04-29", desktop: 315, mobile: 240 },
//   { date: "2024-04-30", desktop: 454, mobile: 380 },
//   { date: "2024-05-01", desktop: 165, mobile: 220 },
//   { date: "2024-05-02", desktop: 293, mobile: 310 },
//   { date: "2024-05-03", desktop: 247, mobile: 190 },
//   { date: "2024-05-04", desktop: 385, mobile: 420 },
//   { date: "2024-05-05", desktop: 481, mobile: 390 },
//   { date: "2024-05-06", desktop: 498, mobile: 520 },
//   { date: "2024-05-07", desktop: 388, mobile: 300 },
//   { date: "2024-05-08", desktop: 149, mobile: 210 },
//   { date: "2024-05-09", desktop: 227, mobile: 180 },
//   { date: "2024-05-10", desktop: 293, mobile: 330 },
//   { date: "2024-05-11", desktop: 335, mobile: 270 },
//   { date: "2024-05-12", desktop: 197, mobile: 240 },
//   { date: "2024-05-13", desktop: 197, mobile: 160 },
//   { date: "2024-05-14", desktop: 448, mobile: 490 },
//   { date: "2024-05-15", desktop: 473, mobile: 380 },
//   { date: "2024-05-16", desktop: 338, mobile: 400 },
//   { date: "2024-05-17", desktop: 499, mobile: 420 },
//   { date: "2024-05-18", desktop: 315, mobile: 350 },
//   { date: "2024-05-19", desktop: 235, mobile: 180 },
//   { date: "2024-05-20", desktop: 177, mobile: 230 },
//   { date: "2024-05-21", desktop: 82, mobile: 140 },
//   { date: "2024-05-22", desktop: 81, mobile: 120 },
//   { date: "2024-05-23", desktop: 252, mobile: 290 },
//   { date: "2024-05-24", desktop: 294, mobile: 220 },
//   { date: "2024-05-25", desktop: 201, mobile: 250 },
//   { date: "2024-05-26", desktop: 213, mobile: 170 },
//   { date: "2024-05-27", desktop: 420, mobile: 460 },
//   { date: "2024-05-28", desktop: 233, mobile: 190 },
//   { date: "2024-05-29", desktop: 78, mobile: 130 },
//   { date: "2024-05-30", desktop: 340, mobile: 280 },
//   { date: "2024-05-31", desktop: 178, mobile: 230 },
//   { date: "2024-06-01", desktop: 178, mobile: 200 },
//   { date: "2024-06-02", desktop: 470, mobile: 410 },
//   { date: "2024-06-03", desktop: 103, mobile: 160 },
//   { date: "2024-06-04", desktop: 439, mobile: 380 },
//   { date: "2024-06-05", desktop: 88, mobile: 140 },
//   { date: "2024-06-06", desktop: 294, mobile: 250 },
//   { date: "2024-06-07", desktop: 323, mobile: 370 },
//   { date: "2024-06-08", desktop: 385, mobile: 320 },
//   { date: "2024-06-09", desktop: 438, mobile: 480 },
//   { date: "2024-06-10", desktop: 155, mobile: 200 },
//   { date: "2024-06-11", desktop: 92, mobile: 150 },
//   { date: "2024-06-12", desktop: 492, mobile: 420 },
//   { date: "2024-06-13", desktop: 81, mobile: 130 },
//   { date: "2024-06-14", desktop: 426, mobile: 380 },
//   { date: "2024-06-15", desktop: 307, mobile: 350 },
//   { date: "2024-06-16", desktop: 371, mobile: 310 },
//   { date: "2024-06-17", desktop: 475, mobile: 520 },
//   { date: "2024-06-18", desktop: 107, mobile: 170 },
//   { date: "2024-06-19", desktop: 341, mobile: 290 },
//   { date: "2024-06-20", desktop: 408, mobile: 450 },
//   { date: "2024-06-21", desktop: 169, mobile: 210 },
//   { date: "2024-06-22", desktop: 317, mobile: 270 },
//   { date: "2024-06-23", desktop: 480, mobile: 530 },
//   { date: "2024-06-24", desktop: 132, mobile: 180 },
//   { date: "2024-06-25", desktop: 141, mobile: 190 },
//   { date: "2024-06-26", desktop: 434, mobile: 380 },
//   { date: "2024-06-27", desktop: 448, mobile: 490 },
//   { date: "2024-06-28", desktop: 149, mobile: 200 },
//   { date: "2024-06-29", desktop: 103, mobile: 160 },
//   { date: "2024-06-30", desktop: 446, mobile: 400 },
// ]

// const chartConfig = {
//   visitors: {
//     label: "Inquery",
//   },
//   desktop: {
//     label: "Bookings",
//     color: "var(--primary)",
//   },
//   mobile: {
//     label: "Earning",
//     color: "var(--primary)",
//   },
// } satisfies ChartConfig

// export function ChartAreaInteractive() {
//   const isMobile = useIsMobile()
//   const [timeRange, setTimeRange] = React.useState("90d")

//   React.useEffect(() => {
//     if (isMobile) {
//       setTimeRange("7d")
//     }
//   }, [isMobile])

//   const filteredData = chartData.filter((item) => {
//     const date = new Date(item.date)
//     const referenceDate = new Date("2024-06-30")
//     let daysToSubtract = 90
//     if (timeRange === "30d") {
//       daysToSubtract = 30
//     } else if (timeRange === "7d") {
//       daysToSubtract = 7
//     }
//     const startDate = new Date(referenceDate)
//     startDate.setDate(startDate.getDate() - daysToSubtract)
//     return date >= startDate
//   })

//   return (
//     <Card className="@container/card">
//       <CardHeader>
//         <CardTitle>Analytics</CardTitle>
//         <CardDescription>
//           <span className="hidden @[540px]/card:block">
//             Total for the last 3 months
//           </span>
//           <span className="@[540px]/card:hidden">Last 3 months</span>
//         </CardDescription>
//         <CardAction>
//           <ToggleGroup
//             type="single"
//             value={timeRange}
//             onValueChange={setTimeRange}
//             variant="outline"
//             className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
//           >
//             <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
//             <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
//             <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
//           </ToggleGroup>
//           <Select value={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger
//               className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
//               size="sm"
//               aria-label="Select a value"
//             >
//               <SelectValue placeholder="Last 3 months" />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl">
//               <SelectItem value="90d" className="rounded-lg">
//                 Last 3 months
//               </SelectItem>
//               <SelectItem value="30d" className="rounded-lg">
//                 Last 30 days
//               </SelectItem>
//               <SelectItem value="7d" className="rounded-lg">
//                 Last 7 days
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </CardAction>
//       </CardHeader>
//       <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-auto h-[250px] w-full"
//         >
//           <AreaChart data={filteredData}>
//             <defs>
//               <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor="var(--color-desktop)"
//                   stopOpacity={1.0}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="var(--color-desktop)"
//                   stopOpacity={0.1}
//                 />
//               </linearGradient>
//               <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor="var(--color-mobile)"
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="var(--color-mobile)"
//                   stopOpacity={0.1}
//                 />
//               </linearGradient>
//               <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="85%"
//                   stopColor="var(--color-mobile)"
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="var(--color-mobile)"
//                   stopOpacity={0.1}
//                 />
//               </linearGradient>
//             </defs>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) => {
//                 const date = new Date(value)
//                 return date.toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "numeric",
//                 })
//               }}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={
//                 <ChartTooltipContent
//                   labelFormatter={(value) => {
//                     return new Date(value).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                     })
//                   }}
//                   indicator="dot"
//                 />
//               }
//             />
//             <Area
//               dataKey="mobile"
//               type="natural"
//               fill="url(#fillMobile)"
//               stroke="var(--color-mobile)"
//               stackId="a"
//             />
//             <Area
//               dataKey="desktop"
//               type="natural"
//               fill="url(#fillDesktop)"
//               stroke="var(--color-)"
//               stackId="a"
//             />
//             <Area
//               dataKey="desktop"
//               type="natural"
//               fill="url(#fillDesktop)"
//               stroke="var(--color-)"
//               stackId="a"
//             />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";

import { getBookings } from "@/actions/bookingAction";

import { useIsMobile } from "@/hooks/use-mobile";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// ============================================================================
// TYPES
// ============================================================================

type Booking = {
  id: string;

  date: string | Date;

  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

  totalPrice?: number | null;

  bookingType?: string | null;
};

type ChartItem = {
  date: string;

  bookings: number;

  completed: number;

  revenue: number;
};

// ============================================================================
// TRANSFORM LOGIC
// ============================================================================

function buildChartData(data: Booking[], days: number): ChartItem[] {
  const map = new Map<string, ChartItem>();

  // Create date buckets
  for (let i = 0; i < days; i++) {
    const d = new Date();

    d.setHours(0, 0, 0, 0);

    d.setDate(d.getDate() - i);

    const key = d.toLocaleDateString("en-CA");

    map.set(key, {
      date: key,

      bookings: 0,

      completed: 0,

      revenue: 0,
    });
  }

  data.forEach((booking) => {
    if (!booking.date) return;

    const key = new Date(booking.date).toLocaleDateString("en-CA");

    if (!map.has(key)) return;

    const day = map.get(key)!;

    // Total bookings
    day.bookings += 1;

    // Completed bookings
    if (booking.status === "COMPLETED") {
      day.completed += 1;
    }

    // Revenue
    if (booking.status === "COMPLETED" || booking.status === "CONFIRMED") {
      day.revenue += Number(booking.totalPrice || 0);
    }
  });

  return Array.from(map.values()).reverse();
}

// ============================================================================
// CHART CONFIG
// ============================================================================

const chartConfig = {
  bookings: {
    label: "Bookings",

    color: "var(--primary)",
  },

  revenue: {
    label: "Revenue",

    color: "var(--chart-6)",
  },

  completed: {
    label: "Completed",

    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

// ============================================================================
// COMPONENT
// ============================================================================

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();

  const business = useBusinessStore((s) => s.business);

  const businessProfileId = business?.id;

  const [timeRange, setTimeRange] = React.useState("15d");

  const [loading, setLoading] = React.useState(true);

  const [bookings, setBookings] = React.useState<Booking[]>([]);

  const [data, setData] = React.useState<ChartItem[]>([]);

  // ============================================================================
  // MOBILE RANGE
  // ============================================================================

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // ============================================================================
  // FETCH BOOKINGS
  // ============================================================================

  React.useEffect(() => {
    const fetchBookings = async () => {
      if (!businessProfileId) return;

      try {
        setLoading(true);

        const res = await getBookings(businessProfileId);

        if (res.success) {
          setBookings(res.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [businessProfileId]);

  // ============================================================================
  // BUILD CHART DATA
  // ============================================================================

  React.useEffect(() => {
    let days = 90;

    if (timeRange === "30d") days = 30;

    if (timeRange === "15d") days = 15;

    if (timeRange === "7d") days = 7;

    const chartData = buildChartData(bookings, days);

    setData(chartData);
  }, [bookings, timeRange]);

  // ============================================================================
  // EMPTY STATE
  // ============================================================================

  const isEmpty = data.every(
    (d) => d.bookings === 0 && d.completed === 0 && d.revenue === 0,
  );

  // ============================================================================
  // TOTALS
  // ============================================================================

  const totalRevenue = data.reduce((acc, item) => acc + item.revenue, 0);

  const totalBookings = data.reduce((acc, item) => acc + item.bookings, 0);

  // ============================================================================
  // UI
  // ============================================================================

  return (
    <Card className="@container/card rounded-3xl border shadow-sm">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>Booking Analytics</CardTitle>

          <CardDescription>
            Track bookings, completed appointments & revenue
          </CardDescription>
        </div>

        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(val) => val && setTimeRange(val)}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">7D</ToggleGroupItem>

            <ToggleGroupItem value="15d">15D</ToggleGroupItem>

            <ToggleGroupItem value="30d">30D</ToggleGroupItem>

            <ToggleGroupItem value="90d">3M</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 @[767px]/card:hidden" size="sm">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>

              <SelectItem value="15d">Last 15 days</SelectItem>

              <SelectItem value="30d">Last 30 days</SelectItem>

              <SelectItem value="90d">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        {/* STATS */}

        {/* <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Total Bookings</p>

            <h3 className="mt-2 text-3xl font-bold">{totalBookings}</h3>
          </div>

          <div className="rounded-2xl border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Revenue</p>

            <h3 className="mt-2 text-3xl font-bold">₹{totalRevenue}</h3>
          </div>
        </div> */}

        {/* EMPTY */}

        {!loading && isEmpty && (
          <div className="rounded-2xl border border-dashed py-10 text-center text-sm text-muted-foreground">
            No analytics data available
          </div>
        )}

        {/* CHART */}

        {!isEmpty && (
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.4}
                  />

                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0.05}
                  />
                </linearGradient>

                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-6)"
                    stopOpacity={0.5}
                  />

                  <stop
                    offset="95%"
                    stopColor="var(--chart-6)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                width={40}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={60}
                tickFormatter={(value) => `₹${value}`}
              />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={20}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                }
              />

              {/* BOOKINGS */}

              <Area
                yAxisId="left"
                dataKey="bookings"
                type="monotone"
                fill="url(#fillBookings)"
                stroke="var(--primary)"
                strokeWidth={2}
              />

              {/* REVENUE */}

              <Area
                yAxisId="right"
                dataKey="revenue"
                type="monotone"
                fill="url(#fillRevenue)"
                stroke="var(--chart-6)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

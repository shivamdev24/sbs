/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import { toast } from "sonner";
// import { useEffect, useState } from "react";
// import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import {
//   createDiscount,
//   deleteDiscount,
//   getDiscounts,
// } from "@/actions/discountAction";

// export default function DiscountPage() {
//   const business = useBusinessStore((s) => s.business);
//   const businessProfileId = business?.id;

//   const [discounts, setDiscounts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     code: "",
//     percentage: "",
//     expiry: "",
//   });

//   // ================= FETCH =================
//   const fetchDiscounts = async () => {
//     if (!businessProfileId) return;

//     try {
//       const getD = await getDiscounts(businessProfileId);

//       if (getD.success) {
//         setDiscounts(getD.data);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     if (businessProfileId) {
//       fetchDiscounts();
//     }
//   }, [businessProfileId]);

//   // ================= CREATE =================
//   const handleCreate = async () => {
//     if (!businessProfileId) {
//       console.error("No Business Profile ID");
//       return;
//     }

//     if (!form.code.trim()) return;
//     if (Number(form.percentage) <= 0 || Number(form.percentage) > 100) return;

//     setLoading(true);

//     try {
//       const data = {
//         code: form.code,
//         discountPercentage: Number(form.percentage),
//         businessProfileId,
//         expiryDate: form.expiry || null,
//       };

//       const Ddata = await createDiscount(data);
//       toast("Discount has been created.");

//       if (!Ddata.success) {
//         console.error(Ddata.error);
//         return;
//       }

//       setForm({ code: "", percentage: "", expiry: "" });
//       await fetchDiscounts();
//     } catch (err) {
//       console.error("Create error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id: string) => {
//     try {
//       console.log("Deleting discount with ID:", id); // Debugging log
//       const Ddata = await deleteDiscount(id);
//       toast("Discount has been deleted.");

//       console.log("Delete response:", Ddata); // Debugging log

//       if (!Ddata.success) {
//         console.error(Ddata.error);
//         return;
//       }

//       fetchDiscounts();
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   // ================= LOADING STATE =================
//   if (!business) {
//     return (
//       <div className="p-6 text-center text-sm text-muted-foreground">
//         Loading business profile...
//       </div>
//     );
//   }

//   // ================= UI =================
//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold">Discount Management</h1>
//         <p className="text-sm text-muted-foreground">
//           Create and manage discount codes for bookings
//         </p>
//       </div>

//       {/* Create Discount */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Create Discount</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-3">
//             {/* Code */}
//             <div className="space-y-2">
//               <Label>Code</Label>
//               <Input
//                 placeholder="SAVE20"
//                 value={form.code}
//                 onChange={(e) =>
//                   setForm({ ...form, code: e.target.value.toUpperCase() })
//                 }
//               />
//             </div>

//             {/* Percentage */}
//             <div className="space-y-2">
//               <Label>Percentage</Label>
//               <Input
//                 type="number"
//                 placeholder="20"
//                 value={form.percentage}
//                 onChange={(e) =>
//                   setForm({ ...form, percentage: e.target.value })
//                 }
//               />
//             </div>

//             {/* Expiry */}
//             <div className="space-y-2">
//               <Label>Expiry Date</Label>
//               <Input
//                 type="date"
//                 value={form.expiry}
//                 onChange={(e) => setForm({ ...form, expiry: e.target.value })}
//               />
//             </div>
//           </div>

//           <Button onClick={handleCreate} disabled={loading}>
//             {loading ? "Creating..." : "Create Discount"}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Discount List */}
//       <Card>
//         <CardHeader>
//           <CardTitle>All Discounts</CardTitle>
//         </CardHeader>

//         <CardContent>
//           {discounts.length === 0 ? (
//             <div className="text-center text-sm text-muted-foreground py-6">
//               No discounts created yet
//             </div>
//           ) : (
//             <div className="divide-y">
//               {discounts.map((d: any) => (
//                 <div
//                   key={d.id}
//                   className="flex items-center justify-between py-3"
//                 >
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <span className="font-medium">{d.code}</span>
//                       <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                         {d.discountPercentage}%
//                       </span>
//                     </div>

//                     <div className="text-xs text-muted-foreground">
//                       Expires:{" "}
//                       {d.expiryDate
//                         ? new Date(d.expiryDate).toDateString()
//                         : "No expiry"}
//                     </div>
//                   </div>

//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleDelete(d.id)}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Copy,
  Percent,
  Plus,
  Search,
  TicketPercent,
  Trash2,
} from "lucide-react";

import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";

import {
  createDiscount,
  deleteDiscount,
  getDiscounts,
} from "@/actions/discountAction";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Discount = {
  id: string;

  code: string;

  discountPercentage: number;

  validUntil: string | null;

  createdAt?: string;
};

export default function DiscountPage() {
  const business = useBusinessStore((s) => s.business);
  const businessProfileId = business?.id;

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    code: "",
    percentage: "",
    validUntil: "",
  });

  // ================= FETCH =================
  const fetchDiscounts = async () => {
    if (!businessProfileId) return;

    try {
      const response = await getDiscounts(businessProfileId);

      if (response.success) {
        setDiscounts(
          response.data.map((item: any) => ({
            id: item.id,
            code: item.code,
            discountPercentage: item.discountPercentage,
            validUntil: item.validUntil
              ? new Date(item.validUntil).toISOString()
              : null,

            createdAt: item.createdAt
              ? new Date(item.createdAt).toISOString()
              : undefined,
          })),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch discounts");
    }
  };

  useEffect(() => {
    if (businessProfileId) {
      fetchDiscounts();
    }
  }, [businessProfileId]);

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!businessProfileId) {
      toast.error("Business profile missing");
      return;
    }

    if (!form.code.trim()) {
      toast.error("Discount code is required");
      return;
    }

    const percentage = Number(form.percentage);

    if (percentage <= 0 || percentage > 100) {
      toast.error("Percentage must be between 1 and 100");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        code: form.code.toUpperCase(),

        discountPercentage: percentage,

        businessProfileId,

        validUntil: form.validUntil
          ? new Date(form.validUntil).toISOString()
          : null,
      };

      const response = await createDiscount(payload);

      if (!response.success) {
        toast.error(response.error || "Failed to create discount");
        return;
      }

      toast.success("Discount created successfully");

      setForm({
        code: "",
        percentage: "",
        validUntil: "",
      });

      fetchDiscounts();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteDiscount(id);

      if (!response.success) {
        toast.error(response.error || "Failed to delete");
        return;
      }

      setDiscounts((prev) => prev.filter((d) => d.id !== id));

      toast.success("Discount deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // ================= FILTER =================
  const filteredDiscounts = useMemo(() => {
    return discounts.filter((d) =>
      d.code.toLowerCase().includes(search.toLowerCase()),
    );
  }, [discounts, search]);

  // ================= STATS =================
  const activeDiscounts = discounts.filter((d) => {
    if (!d.validUntil) return true;

    return new Date(d.validUntil) > new Date();
  });

  // ================= LOADING =================
  if (!business) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading business profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Discount Campaigns
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Create, manage, and track promotional offers for bookings.
            </p>
          </div>

          <Button className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Discounts
                  </p>

                  <h2 className="mt-1 text-3xl font-bold">
                    {discounts.length}
                  </h2>
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <TicketPercent className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Discounts
                  </p>

                  <h2 className="mt-1 text-3xl font-bold">
                    {activeDiscounts.length}
                  </h2>
                </div>

                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                  <Percent className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Highest Offer</p>

                  <h2 className="mt-1 text-3xl font-bold">
                    {discounts.length
                      ? `${Math.max(
                          ...discounts.map((d) => d.discountPercentage),
                        )}%`
                      : "0%"}
                  </h2>
                </div>

                <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* ================= CREATE PANEL ================= */}
          <Card className="h-fit rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Create Campaign</CardTitle>

              <CardDescription>
                Launch promotional offers for bookings and services.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* CODE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Code</label>

                <Input
                  placeholder="SAVE20"
                  value={form.code}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              {/* PERCENTAGE */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Discount Percentage
                </label>

                <Input
                  type="number"
                  placeholder="20"
                  value={form.percentage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      percentage: e.target.value,
                    })
                  }
                  className="h-11 rounded-xl"
                />

                <div className="flex flex-wrap gap-2">
                  {[10, 20, 30, 50].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        setForm({
                          ...form,
                          percentage: String(value),
                        })
                      }
                    >
                      {value}% OFF
                    </Button>
                  ))}
                </div>
              </div>

              {/* EXPIRY */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>

                <Input
                  type="date"
                  value={form.validUntil}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      validUntil: e.target.value,
                    })
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              {/* LIVE PREVIEW */}
              <div className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg">
                <p className="text-xs uppercase tracking-widest text-blue-100">
                  Preview
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  {form.code || "DISCOUNT"}
                </h2>

                <p className="mt-2 text-lg font-medium">
                  {form.percentage || 0}% OFF
                </p>

                <div className="mt-6 flex items-center justify-between text-sm text-blue-100">
                  <span>
                    {form.validUntil
                      ? new Date(form.validUntil).toDateString()
                      : "No expiry"}
                  </span>

                  <span>Salon Offer</span>
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={loading}
                className="h-11 w-full rounded-xl"
              >
                {loading ? "Creating..." : "Create Discount"}
              </Button>
            </CardContent>
          </Card>

          {/* ================= LIST PANEL ================= */}
          <div className="space-y-5">
            {/* SEARCH */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    placeholder="Search discount code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* DISCOUNTS */}
            {filteredDiscounts.length === 0 ? (
              <Card className="rounded-2xl border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <TicketPercent className="h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    No discounts found
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Create your first promotional campaign to increase salon
                    bookings and attract more customers.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredDiscounts.map((discount) => {
                  const isExpired =
                    discount.validUntil &&
                    new Date(discount.validUntil) < new Date();

                  return (
                    <Card
                      key={discount.id}
                      className="overflow-hidden rounded-2xl border-0 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div
                        className={`h-2 ${
                          isExpired ? "bg-red-500" : "bg-green-500"
                        }`}
                      />

                      <CardContent className="space-y-5 p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                              Promo Code
                            </p>

                            <h2 className="mt-1 text-2xl font-bold">
                              {discount.code}
                            </h2>
                          </div>

                          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            {discount.discountPercentage}% OFF
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Status
                            </span>

                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                isExpired
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {isExpired ? "Expired" : "Active"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Expiry
                            </span>

                            <span className="font-medium">
                              {discount.validUntil
                                ? new Date(
                                    discount.validUntil,
                                  ).toLocaleDateString()
                                : "No expiry"}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => {
                              navigator.clipboard.writeText(discount.code);
                              toast.success("Code copied");
                            }}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </Button>

                          <Button
                            variant="destructive"
                            className="rounded-xl"
                            onClick={() => handleDelete(discount.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

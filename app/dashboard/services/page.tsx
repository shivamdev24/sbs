// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useMemo, useState, useTransition } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   createService,
//   getServices,
//   deleteService,
//   updateService,
// } from "@/actions/serviceAction";
// import { getCategories } from "@/actions/categoryAction";
// import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";

// interface ServiceVariant {
//   name: string;
//   price: number;
//   duration?: number;
// }

// interface SavedService {
//   id: string;
//   name: string;
//   categoryId: string;
//   category?: { name: string };
//   variants?: ServiceVariant[];
//   businessProfileId: string;
//   isActive: boolean; // ✅ ADD THIS
// }

// interface Category {
//   id: string;
//   name: string;
// }

// // ✅ Columns (for potential future DataTable use)
// // const columns = [
// //   { accessorKey: "name", header: "Service Name" },
// //   {
// //     accessorKey: "category.name",
// //     header: "Category",
// //     cell: (info: any) => info.row.original.category?.name || "N/A",
// //   },
// //   {
// //     accessorKey: "variants",
// //     header: "Variants",
// //     cell: (info: any) => {
// //       const variants = info.row.original.variants;
// //       return variants?.length ? `${variants.length} variant(s)` : "No variants";
// //     },
// //   },
// // ];

// export default function ServicePage() {
//   const [services, setServices] = useState<SavedService[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isPending, startTransition] = useTransition();
//   const [isDeleting, setIsDeleting] = useState<string | null>(null);
//   const [isActivating, setIsActivating] = useState<string | null>(null);
//   const [response, setResponse] = useState<{
//     success: boolean;
//     message: string;
//   } | null>(null);

//   const business = useBusinessStore((state) => state.business);
//   const businessProfileId = business?.id;

//   // ✅ Form state
//   const [form, setForm] = useState({
//     name: "",
//     categoryId: "",
//     variants: [{ name: "", price: "", duration: "" }],
//   });

//   // ✅ Filters
//   const [search, setSearch] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");

//   // ✅ Fetch categories
//   const fetchCategories = async () => {
//     if (!businessProfileId) return;

//     const data = await getCategories(businessProfileId);
//     if (data.success) {
//       setCategories(data.data || []);
//     } else {
//       console.error("Failed to fetch categories:", data.error);
//     }
//   };

//   // ✅ Fetch services
//   const fetchServices = async () => {
//     if (!businessProfileId) return;

//     const data = await getServices(businessProfileId);
//     if (data.success) {
//       const mappedServices = (data.data || []).map((service: any) => ({
//         ...service,
//         variants: (service.variants || []).map((v: any) => ({
//           ...v,
//           duration: v.duration ?? undefined,
//         })),
//       }));
//       setServices(mappedServices);
//     } else {
//       console.error("Failed to fetch services:", data.error);
//     }
//   };

//   useEffect(() => {
//     if (businessProfileId) {
//       fetchCategories();
//       fetchServices();
//     }
//   }, [businessProfileId]);

//   // ✅ Add variant input
//   const addVariant = () => {
//     setForm({
//       ...form,
//       variants: [...form.variants, { name: "", price: "", duration: "" }],
//     });
//   };

//   // ✅ Remove variant input
//   const removeVariant = (index: number) => {
//     const updated = form.variants.filter((_, i) => i !== index);
//     setForm({ ...form, variants: updated });
//   };

//   // ✅ Update variant
//   const updateVariant = (
//     index: number,
//     field: "name" | "price" | "duration",
//     value: string,
//   ) => {
//     const updated = [...form.variants];
//     updated[index][field] = value;
//     setForm({ ...form, variants: updated });
//   };

//   // ✅ Create service
//   const handleCreate = () => {
//     startTransition(async () => {
//       if (!form.name || !form.categoryId || !businessProfileId) {
//         setResponse({
//           success: false,
//           message: "❌ Please fill required fields",
//         });
//         return;
//       }

//       const validVariants = form.variants.filter(
//         (v) => v.name.trim() && v.price.trim(),
//       );

//       if (!validVariants.length) {
//         setResponse({
//           success: false,
//           message: "❌ At least one variant is required",
//         });
//         return;
//       }

//       const data = await createService({
//         name: form.name,
//         categoryId: form.categoryId,
//         businessProfileId,
//         variants: validVariants.map((v) => ({
//           name: v.name,
//           price: Number(v.price),
//           duration: v.duration ? Number(v.duration) : undefined,
//         })),
//       });

//       setResponse({
//         success: data.success,
//         message: data.success
//           ? `✅ Service "${form.name}" created successfully`
//           : `❌ ${data.error}`,
//       });

//       if (data.success) {
//         setForm({
//           name: "",
//           categoryId: "",
//           variants: [{ name: "", price: "", duration: "" }],
//         });
//         await fetchServices();
//       }
//     });
//   };

//   // ✅ Delete service
//   const handleDelete = (serviceId: string, serviceName: string) => {
//     if (!confirm(`Delete "${serviceName}"?`)) return;

//     setIsDeleting(serviceId);
//     startTransition(async () => {
//       const data = await deleteService(serviceId);

//       setResponse({
//         success: data.success,
//         message: data.success
//           ? `✅ Service deleted successfully`
//           : `❌ ${data.error}`,
//       });

//       if (data.success) {
//         await fetchServices();
//       }

//       setIsDeleting(null);
//     });
//   };

//   // ✅ Update service active status
//   // const handleActive = (
//   //   serviceId: string,
//   //   serviceName: string,
//   //   currentStatus: boolean,
//   // ) => {
//   //   if (!confirm(`Update "${serviceName}" status?`)) return;

//   //   setIsActivating(serviceId);

//   //   console.log(
//   //     "Activating service:",
//   //     serviceId,
//   //     "Current status:",
//   //     currentStatus,
//   //   ); // Debugging log

//   //   startTransition(async () => {
//   //     const data = await updateService(serviceId, {
//   //       isActive: !currentStatus, // ✅ TOGGLE
//   //     });

//   //     setResponse({
//   //       success: data.success,
//   //       message: data.success ? `✅ Service updated` : `❌ ${data.error}`,
//   //     });

//   //     if (data.success) {
//   //       await fetchServices();
//   //     }
//   //     console.log(
//   //       "Activating service:",
//   //       serviceId,
//   //       "Current status:",
//   //       currentStatus,
//   //     ); // Debugging log
//   //     toast(`${serviceName} is now ${!currentStatus ? "active" : "inactive"}`);
//   //     setIsActivating(null);
//   //   });
//   // };

//   const handleActive = async (
//     serviceId: string,
//     serviceName: string,
//     currentStatus: boolean,
//   ) => {
//     if (!confirm(`Update "${serviceName}" status?`)) return;

//     setIsActivating(serviceId);

//     console.log("Updating service:", serviceId, "from:", currentStatus);

//     try {
//       const data = await updateService(serviceId, {
//         isActive: !currentStatus,
//       });

//       if (data.success) {
//         await fetchServices();
//         toast(
//           `${serviceName} is now ${!currentStatus ? "active" : "inactive"}`,
//         );
//       } else {
//         toast.error(data.error);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsActivating(null);
//     }
//   };

//   // ✅ Filter services
//   const filteredData = useMemo(() => {
//     return services.filter((service: SavedService) => {
//       const matchesSearch = service.name
//         ?.toLowerCase()
//         .includes(search.toLowerCase());

//       const matchesCategory = categoryFilter
//         ? service.categoryId === categoryFilter
//         : true;

//       return matchesSearch && matchesCategory;
//     });
//   }, [services, search, categoryFilter]);

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-3xl font-bold">Services</h1>
//           <p className="text-sm text-gray-600">Manage all salon services</p>
//         </div>
//         <Link
//           href="/dashboard/services/category"
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           + Manage Categories
//         </Link>
//       </div>

//       {/* Response Message */}
//       {response && (
//         <div
//           className={`p-4 border rounded transition ${
//             response.success
//               ? "bg-green-50 border-green-200 text-green-700"
//               : "bg-red-50 border-red-200 text-red-700"
//           }`}
//         >
//           <p>{response.message}</p>
//         </div>
//       )}

//       {/* Create Service */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Add Service</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {/* Service Name and Category */}
//           <div className="grid md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Service Name *</Label>
//               <Input
//                 placeholder="e.g., Hair Straightening"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Category *</Label>
//               <select
//                 className="w-full border rounded px-3 py-2"
//                 value={form.categoryId}
//                 onChange={(e) =>
//                   setForm({ ...form, categoryId: e.target.value })
//                 }
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//               {categories.length === 0 && (
//                 <p className="text-xs text-orange-600">
//                   No categories found.{" "}
//                   <Link
//                     href="/dashboard/services/category"
//                     className="underline"
//                   >
//                     Create one first
//                   </Link>
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Variants Section */}
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <Label className="text-base font-semibold">
//                 Service Variants *
//               </Label>
//               <Button onClick={addVariant} variant="outline" size="sm">
//                 + Add Variant
//               </Button>
//             </div>

//             {form.variants.map((variant, index) => (
//               <div key={index} className="grid md:grid-cols-4 gap-2 items-end">
//                 <div className="space-y-2">
//                   <Label className="text-sm">Variant Name</Label>
//                   <Input
//                     placeholder="e.g., Shoulder Length"
//                     value={variant.name}
//                     onChange={(e) =>
//                       updateVariant(index, "name", e.target.value)
//                     }
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm">Price ($)</Label>
//                   <Input
//                     type="number"
//                     placeholder="0.00"
//                     value={variant.price}
//                     onChange={(e) =>
//                       updateVariant(index, "price", e.target.value)
//                     }
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm">Duration (min)</Label>
//                   <Input
//                     type="number"
//                     placeholder="30"
//                     value={variant.duration}
//                     onChange={(e) =>
//                       updateVariant(index, "duration", e.target.value)
//                     }
//                   />
//                 </div>

//                 <Button
//                   onClick={() => removeVariant(index)}
//                   variant="destructive"
//                   size="sm"
//                   className="w-full"
//                 >
//                   Remove
//                 </Button>
//               </div>
//             ))}
//           </div>

//           <Button
//             onClick={handleCreate}
//             disabled={isPending || !businessProfileId}
//             className="w-full bg-black text-white hover:bg-gray-900"
//           >
//             {isPending ? "Creating..." : "Create Service"}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Filters</CardTitle>
//         </CardHeader>

//         <CardContent className="flex gap-3 flex-wrap">
//           <Input
//             placeholder="Search by name..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-60"
//           />

//           <select
//             className="border rounded px-3 py-2"
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//           >
//             <option value="">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           <Button
//             variant="outline"
//             onClick={() => {
//               setSearch("");
//               setCategoryFilter("");
//             }}
//           >
//             Reset Filters
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Services Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>All Services ({filteredData.length})</CardTitle>
//         </CardHeader>

//         <CardContent>
//           {filteredData.length > 0 ? (
//             <div className="space-y-2">
//               {filteredData.map((service) => (
//                 <div
//                   key={service.id}
//                   className={cn(
//                     "flex gap-4 items-center p-4 border rounded transition",
//                   )}
//                 >
//                   <div
//                     className={cn(
//                       "flex-1",
//                       service.isActive === false && "opacity-50 text-gray-100",
//                     )}
//                   >
//                     <p className="font-semibold text-gray-900">
//                       {service.name}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Category: {service.category?.name || "N/A"}
//                     </p>
//                     {service.variants && service.variants.length > 0 && (
//                       <div className="text-xs text-gray-500 mt-2">
//                         Variants:{" "}
//                         {service.variants
//                           .map((v) => `${v.name} ($${v.price})`)
//                           .join(", ")}
//                       </div>
//                     )}
//                   </div>

//                   {/* {service.isActive === true ? (
//                     " "
//                   ) : (
//                     <Button
//                       onClick={() =>
//                         handleActive(service.id, service.name, service.isActive)
//                       }
//                       disabled={isActivating === service.id}
//                       variant={service.isActive ? "destructive" : "default"}
//                       size="sm"
//                     >
//                       {isActivating === service.id
//                         ? "Updating..."
//                         : service.isActive
//                           ? "Deactivate"
//                           : "Activate"}
//                     </Button>
//                   )} */}

//                   <Button
//                     onClick={() =>
//                       handleActive(service.id, service.name, service.isActive)
//                     }
//                     disabled={isActivating === service.id}
//                     variant={service.isActive ? "destructive" : "default"}
//                     size="sm"
//                   >
//                     {isActivating === service.id
//                       ? "Updating..."
//                       : service.isActive
//                         ? "Deactivate"
//                         : "Activate"}
//                   </Button>

//                   <Button
//                     onClick={() => handleDelete(service.id, service.name)}
//                     disabled={isDeleting === service.id}
//                     variant="destructive"
//                     size="sm"
//                   >
//                     {isDeleting === service.id ? "Deleting..." : "Delete"}
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="p-6 text-center text-gray-500">
//               <p>No services found. Create one to get started!</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState, useTransition } from "react";

// import {
//   BadgePlus,
//   LayoutGrid,
//   Loader2,
//   Plus,
//   Search,
//   Trash2,
//   Layers3,
//   Eye,
//   EyeOff,
//   Sparkles,
// } from "lucide-react";

// import { toast } from "sonner";

// import {
//   createService,
//   deleteService,
//   getServices,
//   updateService,
// } from "@/actions/serviceAction";

// import { getCategories } from "@/actions/categoryAction";

// import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";

// import { cn } from "@/lib/utils";

// import { Button } from "@/components/ui/button";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Input } from "@/components/ui/input";

// import { Label } from "@/components/ui/label";

// import { Separator } from "@/components/ui/separator";

// interface ServiceVariant {
//   name: string;
//   price: string;
//   duration: string;
// }

// interface SavedVariant {
//   id?: string;
//   name: string;
//   price: number;
//   duration?: number;
// }

// interface SavedService {
//   id: string;
//   name: string;
//   categoryId: string;
//   category?: {
//     name: string;
//   };
//   variants?: SavedVariant[];
//   businessProfileId: string;
//   isActive: boolean;
// }

// interface Category {
//   id: string;
//   name: string;
// }

// export default function ServicePage() {
//   const business = useBusinessStore((state) => state.business);

//   const businessProfileId = business?.id;

//   const [services, setServices] = useState<SavedService[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);

//   const [isPending, startTransition] = useTransition();

//   const [isDeleting, setIsDeleting] = useState<string | null>(null);

//   const [isUpdating, setIsUpdating] = useState<string | null>(null);

//   // ================= FORM =================

//   const [form, setForm] = useState({
//     name: "",
//     categoryId: "",
//     variants: [
//       {
//         name: "",
//         price: "",
//         duration: "",
//       },
//     ] as ServiceVariant[],
//   });

//   // ================= FILTERS =================

//   const [search, setSearch] = useState("");

//   const [categoryFilter, setCategoryFilter] = useState("");

//   // ================= FETCH =================

//   const fetchCategories = async () => {
//     if (!businessProfileId) return;

//     const data = await getCategories(businessProfileId);

//     if (data.success) {
//       setCategories(data.data || []);
//     }
//   };

//   const fetchServices = async () => {
//     if (!businessProfileId) return;

//     const data = await getServices(businessProfileId);

//     if (data.success) {
//       setServices(data.data || []);
//     }
//   };

//   useEffect(() => {
//     if (businessProfileId) {
//       fetchCategories();
//       fetchServices();
//     }
//   }, [businessProfileId]);

//   // ================= VARIANTS =================

//   const addVariant = () => {
//     setForm((prev) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         {
//           name: "",
//           price: "",
//           duration: "",
//         },
//       ],
//     }));
//   };

//   const removeVariant = (index: number) => {
//     setForm((prev) => ({
//       ...prev,
//       variants: prev.variants.filter((_, i) => i !== index),
//     }));
//   };

//   const updateVariant = (
//     index: number,
//     field: keyof ServiceVariant,
//     value: string,
//   ) => {
//     const updated = [...form.variants];

//     updated[index][field] = value;

//     setForm((prev) => ({
//       ...prev,
//       variants: updated,
//     }));
//   };

//   // ================= CREATE =================

//   const handleCreate = () => {
//     startTransition(async () => {
//       if (!businessProfileId) {
//         toast.error("Business not found");
//         return;
//       }

//       if (!form.name.trim()) {
//         toast.error("Service name required");
//         return;
//       }

//       if (!form.categoryId) {
//         toast.error("Select category");
//         return;
//       }

//       const validVariants = form.variants.filter(
//         (v) => v.name.trim() && v.price.trim(),
//       );

//       if (!validVariants.length) {
//         toast.error("Add at least one variant");
//         return;
//       }

//       const data = await createService({
//         name: form.name,
//         categoryId: form.categoryId,
//         businessProfileId,
//         variants: validVariants.map((v) => ({
//           name: v.name,
//           price: Number(v.price),
//           duration: v.duration ? Number(v.duration) : undefined,
//         })),
//       });

//       if (!data.success) {
//         toast.error(data.error);
//         return;
//       }

//       toast.success("Service created");

//       setForm({
//         name: "",
//         categoryId: "",
//         variants: [
//           {
//             name: "",
//             price: "",
//             duration: "",
//           },
//         ],
//       });

//       fetchServices();
//     });
//   };

//   // ================= DELETE =================

//   const handleDelete = async (serviceId: string, serviceName: string) => {
//     const confirmDelete = confirm(`Delete "${serviceName}" service?`);

//     if (!confirmDelete) return;

//     setIsDeleting(serviceId);

//     try {
//       const data = await deleteService(serviceId);

//       if (!data.success) {
//         toast.error(data.error);
//         return;
//       }

//       setServices((prev) => prev.filter((service) => service.id !== serviceId));

//       toast.success("Service deleted");
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsDeleting(null);
//     }
//   };

//   // ================= ACTIVE TOGGLE =================

//   const handleToggleActive = async (
//     serviceId: string,
//     currentStatus: boolean,
//     serviceName: string,
//   ) => {
//     setIsUpdating(serviceId);

//     try {
//       const data = await updateService(serviceId, {
//         isActive: !currentStatus,
//       });

//       if (!data.success) {
//         toast.error(data.error);
//         return;
//       }

//       setServices((prev) =>
//         prev.map((service) =>
//           service.id === serviceId
//             ? {
//                 ...service,
//                 isActive: !currentStatus,
//               }
//             : service,
//         ),
//       );

//       toast.success(
//         `${serviceName} ${!currentStatus ? "activated" : "deactivated"}`,
//       );
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsUpdating(null);
//     }
//   };

//   // ================= FILTER =================

//   const filteredServices = useMemo(() => {
//     return services.filter((service) => {
//       const matchesSearch = service.name
//         .toLowerCase()
//         .includes(search.toLowerCase());

//       const matchesCategory = categoryFilter
//         ? service.categoryId === categoryFilter
//         : true;

//       return matchesSearch && matchesCategory;
//     });
//   }, [services, search, categoryFilter]);

//   // ================= STATS =================

//   const activeServices = services.filter((s) => s.isActive);

//   const inactiveServices = services.filter((s) => !s.isActive);

//   // ================= LOADING =================

//   if (!business) {
//     return (
//       <div className="flex h-[60vh] items-center justify-center">
//         <Loader2 className="h-6 w-6 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-muted/30 p-6">
//       <div className="mx-auto max-w-7xl space-y-6">
//         {/* ================= HEADER ================= */}

//         <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               Service Management
//             </h1>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Create and manage all salon services and variants.
//             </p>
//           </div>

//           <Link href="/dashboard/services/category">
//             <Button className="rounded-xl gap-2">
//               <LayoutGrid className="h-4 w-4" />
//               Manage Categories
//             </Button>
//           </Link>
//         </div>

//         {/* ================= STATS ================= */}

//         <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
//           <Card className="rounded-2xl">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">
//                     Total Services
//                   </p>

//                   <h2 className="mt-2 text-3xl font-bold">{services.length}</h2>
//                 </div>

//                 <div className="rounded-xl bg-primary/10 p-3 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="rounded-2xl">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Active</p>

//                   <h2 className="mt-2 text-3xl font-bold">
//                     {activeServices.length}
//                   </h2>
//                 </div>

//                 <div className="rounded-xl bg-green-100 p-3 text-green-700">
//                   <Eye className="h-5 w-5" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="rounded-2xl">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Inactive</p>

//                   <h2 className="mt-2 text-3xl font-bold">
//                     {inactiveServices.length}
//                   </h2>
//                 </div>

//                 <div className="rounded-xl bg-red-100 p-3 text-red-700">
//                   <EyeOff className="h-5 w-5" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="rounded-2xl">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Categories</p>

//                   <h2 className="mt-2 text-3xl font-bold">
//                     {categories.length}
//                   </h2>
//                 </div>

//                 <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
//                   <Layers3 className="h-5 w-5" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* ================= MAIN GRID ================= */}

//         <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
//           {/* ================= CREATE FORM ================= */}

//           <div className="sticky top-6 h-fit">
//             <Card className="rounded-3xl border-0 shadow-sm">
//               <CardHeader>
//                 <CardTitle>Add New Service</CardTitle>

//                 <CardDescription>
//                   Create service with pricing and variants.
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="space-y-5">
//                 {/* NAME */}

//                 <div className="space-y-2">
//                   <Label>Service Name</Label>

//                   <Input
//                     placeholder="Hair Spa"
//                     className="h-11 rounded-xl"
//                     value={form.name}
//                     onChange={(e) =>
//                       setForm((prev) => ({
//                         ...prev,
//                         name: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>

//                 {/* CATEGORY */}

//                 <div className="space-y-2 overflow-hidden">
//                   <Label>Category</Label>

//                   <select
//                     className="h-11 w-full max-w-full truncate rounded-xl border border-input bg-background px-3 text-sm"
//                     value={form.categoryId}
//                     onChange={(e) =>
//                       setForm((prev) => ({
//                         ...prev,
//                         categoryId: e.target.value,
//                       }))
//                     }
//                   >
//                     <option value="">Select Category</option>

//                     {categories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <Separator />

//                 {/* VARIANTS */}

//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <Label>Variants</Label>

//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={addVariant}
//                       className="rounded-xl"
//                     >
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add
//                     </Button>
//                   </div>

//                   {form.variants.map((variant, index) => (
//                     <div
//                       key={index}
//                       className="rounded-2xl border bg-muted/40 p-4 space-y-3"
//                     >
//                       <div className="space-y-2">
//                         <Label>Variant Name</Label>

//                         <Input
//                           placeholder="Short Hair"
//                           value={variant.name}
//                           onChange={(e) =>
//                             updateVariant(index, "name", e.target.value)
//                           }
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-3">
//                         <div className="space-y-2">
//                           <Label>Price</Label>

//                           <Input
//                             type="number"
//                             placeholder="499"
//                             value={variant.price}
//                             onChange={(e) =>
//                               updateVariant(index, "price", e.target.value)
//                             }
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label>Duration</Label>

//                           <Input
//                             type="number"
//                             placeholder="60"
//                             value={variant.duration}
//                             onChange={(e) =>
//                               updateVariant(index, "duration", e.target.value)
//                             }
//                           />
//                         </div>
//                       </div>

//                       {form.variants.length > 1 && (
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           className="w-full rounded-xl"
//                           onClick={() => removeVariant(index)}
//                         >
//                           Remove Variant
//                         </Button>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* PREVIEW */}

//                 <div className="rounded-3xl bg-gradient-to-br from-black to-zinc-800 p-5 text-white">
//                   <p className="text-xs uppercase tracking-widest text-zinc-400">
//                     Preview
//                   </p>

//                   <h3 className="mt-3 text-2xl font-bold">
//                     {form.name || "Service Name"}
//                   </h3>

//                   <div className="mt-4 space-y-2">
//                     {form.variants.map((variant, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm"
//                       >
//                         <span>{variant.name || "Variant"}</span>

//                         <span>₹{variant.price || 0}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* CREATE */}

//                 <Button
//                   className="h-11 w-full rounded-xl"
//                   disabled={isPending}
//                   onClick={handleCreate}
//                 >
//                   {isPending ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <BadgePlus className="mr-2 h-4 w-4" />
//                       Create Service
//                     </>
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           {/* ================= RIGHT SIDE ================= */}

//           <div className="space-y-5">
//             {/* FILTERS */}

//             <Card className="rounded-2xl border-0 shadow-sm">
//               <CardContent className="p-5">
//                 <div className="flex flex-col gap-3 lg:flex-row">
//                   <div className="relative flex-1">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

//                     <Input
//                       placeholder="Search services..."
//                       className="pl-10 h-11 rounded-xl"
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                     />
//                   </div>

//                   <select
//                     className="h-11 rounded-xl border bg-background px-3"
//                     value={categoryFilter}
//                     onChange={(e) => setCategoryFilter(e.target.value)}
//                   >
//                     <option value="">All Categories</option>

//                     {categories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* SERVICES */}

//             {filteredServices.length === 0 ? (
//               <Card className="rounded-3xl border-dashed">
//                 <CardContent className="flex flex-col items-center justify-center py-20 text-center">
//                   <div className="rounded-full bg-primary/10 p-4 text-primary">
//                     <Sparkles className="h-8 w-8" />
//                   </div>

//                   <h3 className="mt-5 text-xl font-semibold">
//                     No Services Found
//                   </h3>

//                   <p className="mt-2 max-w-md text-sm text-muted-foreground">
//                     Create your first salon service to start accepting online
//                     bookings.
//                   </p>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//                 {filteredServices.map((service) => {
//                   const prices = service.variants?.map((v) => v.price) || [];

//                   const minPrice = prices.length ? Math.min(...prices) : 0;

//                   return (
//                     <Card
//                       key={service.id}
//                       className={cn(
//                         "overflow-hidden rounded-3xl border-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
//                         service.isActive ? "bg-green-100" : "bg-red-100",
//                       )}
//                     >
//                       <div
//                         className={cn(
//                           "h-2",
//                           service.isActive ? "bg-green-500" : "bg-red-500",
//                         )}
//                       />

//                       <CardContent className="p-5 space-y-5">
//                         {/* TOP */}

//                         <div className="flex items-start justify-between">
//                           <div>
//                             <p className="text-xs uppercase tracking-wider text-muted-foreground">
//                               {service.category?.name}
//                             </p>

//                             <h2 className="mt-1 text-2xl font-bold">
//                               {service.name}
//                             </h2>
//                           </div>

//                           <div
//                             className={cn(
//                               "rounded-full px-3 py-1 text-xs font-medium",
//                               service.isActive
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-red-100 text-red-700",
//                             )}
//                           >
//                             {service.isActive ? "Active" : "Inactive"}
//                           </div>
//                         </div>

//                         {/* PRICING */}

//                         <div className="rounded-2xl bg-white p-4">
//                           <p className="text-sm text-muted-foreground">
//                             Starting Price
//                           </p>

//                           <h3 className="mt-1 text-3xl font-bold">
//                             ₹{minPrice}
//                           </h3>
//                         </div>

//                         {/* VARIANTS */}

//                         <div className="space-y-2">
//                           <p className="text-sm font-medium">Variants</p>

//                           <div className="space-y-2">
//                             {service.variants?.map((variant) => (
//                               <div
//                                 key={variant.name}
//                                 className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm bg-white"
//                               >
//                                 <div>
//                                   <p className="font-medium">{variant.name}</p>

//                                   <p className="text-xs text-muted-foreground">
//                                     {variant.duration || 0} mins
//                                   </p>
//                                 </div>

//                                 <div className="font-semibold">
//                                   ₹{variant.price}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* ACTIONS */}

//                         <div className="flex gap-2 pt-2">
//                           <Button
//                             className={cn(
//                               "flex-1 rounded-xl",
//                               service.isActive
//                                 ? "bg-orange-500 text-white"
//                                 : "bg-green-500 text-white",
//                             )}
//                             variant={service.isActive ? "outline" : "default"}
//                             disabled={isUpdating === service.id}
//                             onClick={() =>
//                               handleToggleActive(
//                                 service.id,
//                                 service.isActive,
//                                 service.name,
//                               )
//                             }
//                           >
//                             {isUpdating === service.id ? (
//                               <Loader2 className="h-4 w-4 animate-spin" />
//                             ) : service.isActive ? (
//                               <>
//                                 <EyeOff className=" h-4 w-4" />
//                                 Disable Service
//                               </>
//                             ) : (
//                               <>
//                                 <Eye className=" h-4 w-4" />
//                                 Activate Service
//                               </>
//                             )}
//                           </Button>

//                           <Button
//                             variant="destructive"
//                             className="rounded-xl"
//                             disabled={isDeleting === service.id}
//                             onClick={() =>
//                               handleDelete(service.id, service.name)
//                             }
//                           >
//                             {isDeleting === service.id ? (
//                               <Loader2 className="h-4 w-4 animate-spin" />
//                             ) : (
//                               <Trash2 className="h-4 w-4" />
//                             )}
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";

import {
  BadgePlus,
  LayoutGrid,
  Loader2,
  Plus,
  Search,
  Trash2,
  Layers3,
  Eye,
  EyeOff,
  Sparkles,
  Pencil,
  Save,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  createService,
  deleteService,
  getServices,
  updateService,
  updateServicevariants,
} from "@/actions/serviceAction";

import { getCategories } from "@/actions/categoryAction";

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

interface ServiceVariant {
  id?: string;
  name: string;
  price: string;
  duration: string;
}

interface SavedVariant {
  id?: string;
  name: string;
  price: number;
  totalDuration?: number | null;
}

interface SavedService {
  id: string;
  name: string;

  categoryId: string;

  category?: {
    name: string;
  };

  variants?: SavedVariant[];

  businessProfileId: string;

  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
}

export default function ServicePage() {
  const business = useBusinessStore((state) => state.business);

  const businessProfileId = business?.id;

  const [services, setServices] = useState<SavedService[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isPending, startTransition] = useTransition();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // ================= CREATE FORM =================

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    variants: [
      {
        name: "",
        price: "",
        duration: "",
      },
    ] as ServiceVariant[],
  });

  // ================= EDIT FORM =================

  const [editForm, setEditForm] = useState({
    name: "",
    categoryId: "",
    variants: [] as ServiceVariant[],
  });

  // ================= FILTER =================

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");

  // ================= FETCH =================

  const fetchCategories = async () => {
    if (!businessProfileId) return;

    const data = await getCategories(businessProfileId);

    if (data.success) {
      setCategories(data.data || []);
    }
  };

  const fetchServices = async () => {
    if (!businessProfileId) return;

    const data = await getServices(businessProfileId);

    console.log("Fetched services:", data.data);

    if (data.success) {
      setServices(data.data || []);
    }
  };

  useEffect(() => {
    if (businessProfileId) {
      fetchCategories();
      fetchServices();
    }
  }, [businessProfileId]);

  // ================= CREATE VARIANTS =================

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: "",
          price: "",
          duration: "",
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (
    index: number,
    field: keyof ServiceVariant,
    value: string,
  ) => {
    setForm((prev) => {
      const updated = [...prev.variants];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        variants: updated,
      };
    });
  };

  // ================= EDIT VARIANTS =================

  const handleEdit = (service: SavedService) => {
    setEditingServiceId(service.id);

    setEditForm({
      name: service.name,

      categoryId: service.categoryId,

      variants:
        service.variants?.map((v) => ({
          id: v.id,

          name: v.name,

          price: String(v.price),

          duration: String(v.totalDuration || ""),
        })) || [],
    });
  };

  const addEditVariant = () => {
    setEditForm((prev) => ({
      ...prev,

      variants: [
        ...prev.variants,

        {
          name: "",
          price: "",
          duration: "",
        },
      ],
    }));
  };

  const updateEditVariant = (
    index: number,
    field: keyof ServiceVariant,
    value: string,
  ) => {
    setEditForm((prev) => {
      const updated = [...prev.variants];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        variants: updated,
      };
    });
  };

  const handleSaveEdit = async (serviceId: string) => {
    setIsUpdating(serviceId);

    try {
      console.log("Saving edits for service:", {
        serviceId,
        name: editForm.name,
        categoryId: editForm.categoryId,
        variants: editForm.variants,
      });
      const data = await updateServicevariants(serviceId, {
        name: editForm.name,

        categoryId: editForm.categoryId,

        variants: editForm.variants.map((v) => ({
          id: v.id,

          name: v.name,

          price: Number(v.price),

          totalDuration: v.duration ? Number(v.duration) : null,
        })),
      });

      if (!data.success) {
        toast.error(data.error);
        return;
      }

      toast.success("Service updated");

      setEditingServiceId(null);

      await fetchServices();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

  // ================= CREATE =================

  const handleCreate = () => {
    startTransition(async () => {
      if (!businessProfileId) {
        toast.error("Business not found");
        return;
      }

      if (!form.name.trim()) {
        toast.error("Service name required");
        return;
      }

      if (!form.categoryId) {
        toast.error("Select category");
        return;
      }

      const validVariants = form.variants.filter(
        (v) => v.name.trim() && v.price.trim(),
      );

      if (!validVariants.length) {
        toast.error("Add at least one variant");
        return;
      }

      const data = await createService({
        name: form.name,

        categoryId: form.categoryId,

        businessProfileId,

        variants: validVariants.map((v) => ({
          name: v.name,

          price: Number(v.price),

          totalDuration: v.duration ? Number(v.duration) : null,
        })),
      });

      if (!data.success) {
        toast.error(data.error);
        return;
      }

      toast.success("Service created");

      setForm({
        name: "",
        categoryId: "",
        variants: [
          {
            name: "",
            price: "",
            duration: "",
          },
        ],
      });

      fetchServices();
    });
  };

  // ================= DELETE =================

  const handleDelete = async (serviceId: string, serviceName: string) => {
    const confirmDelete = confirm(`Delete "${serviceName}" service?`);

    if (!confirmDelete) return;

    setIsDeleting(serviceId);

    try {
      const data = await deleteService(serviceId);

      if (!data.success) {
        toast.error(data.error);
        return;
      }

      setServices((prev) => prev.filter((s) => s.id !== serviceId));

      toast.success("Service deleted");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  // ================= ACTIVE TOGGLE =================

  const handleToggleActive = async (
    serviceId: string,
    currentStatus: boolean,
    serviceName: string,
  ) => {
    setIsUpdating(serviceId);

    try {
      const data = await updateService(serviceId, {
        isActive: !currentStatus,
      });

      if (!data.success) {
        toast.error(data.error);
        return;
      }

      setServices((prev) =>
        prev.map((service) =>
          service.id === serviceId
            ? {
                ...service,
                isActive: !currentStatus,
              }
            : service,
        ),
      );

      toast.success(
        `${serviceName} ${!currentStatus ? "activated" : "deactivated"}`,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

  // ================= FILTER =================

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory = categoryFilter
        ? service.categoryId === categoryFilter
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, categoryFilter]);

  // ================= LOADING =================

  // ================= STATS =================

  const activeServices = services.filter((s) => s.isActive);

  const inactiveServices = services.filter((s) => !s.isActive);

  if (!business) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Service Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage all salon services and variants.
            </p>
          </div>

          <Link href="/dashboard/services/category">
            <Button className="rounded-xl gap-2">
              <LayoutGrid className="h-4 w-4" />
              Manage Categories
            </Button>
          </Link>
        </div>
        {/* ================= STATS ================= */}

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Services
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">{services.length}</h2>
                </div>
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {activeServices.length}
                  </h2>
                </div>
                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                  <Eye className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {inactiveServices.length}
                  </h2>
                </div>

                <div className="rounded-xl bg-red-100 p-3 text-red-700">
                  <EyeOff className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {categories.length}
                  </h2>
                </div>

                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <Layers3 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= MAIN GRID ================= */}

        {/* MAIN */}

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* CREATE */}

          <div>
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Add New Service</CardTitle>

                <CardDescription>Create service with variants</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Service Name</Label>

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

                <div className="space-y-2">
                  <Label>Category</Label>

                  <select
                    className="h-11 w-full rounded-xl border px-3"
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Category</option>

                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Variants</Label>

                    <Button variant="outline" size="sm" onClick={addVariant}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {form.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border p-4 space-y-3"
                    >
                      <Input
                        placeholder="Variant Name"
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(index, "name", e.target.value)
                        }
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="number"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(index, "price", e.target.value)
                          }
                        />

                        <Input
                          type="number"
                          placeholder="Duration"
                          value={variant.duration}
                          onChange={(e) =>
                            updateVariant(index, "duration", e.target.value)
                          }
                        />
                      </div>

                      {form.variants.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => removeVariant(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button className="w-full rounded-xl" onClick={handleCreate}>
                  <BadgePlus className="mr-2 h-4 w-4" />
                  Create Service
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* SERVICES */}

          <div className="space-y-5">
            {/* FILTER */}

            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    placeholder="Search services..."
                    className="pl-10 h-11 rounded-xl"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* GRID */}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => {
                const prices = service.variants?.map((v) => v.price) || [];

                const minPrice = prices.length ? Math.min(...prices) : 0;

                const isEditing = editingServiceId === service.id;

                return (
                  <Card
                    key={service.id}
                    className={cn(
                      "overflow-hidden rounded-3xl shadow-sm",
                      service.isActive ? "bg-green-100" : "bg-red-100",
                    )}
                  >
                    <div
                      className={cn(
                        "h-2",
                        service.isActive ? "bg-green-500" : "bg-red-500",
                      )}
                    />

                    <CardContent className="p-5 space-y-5">
                      {/* TOP */}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-xs uppercase text-muted-foreground">
                            {service.category?.name}
                          </p>

                          {isEditing ? (
                            <Input
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            <h2 className="mt-1 text-2xl font-bold">
                              {service.name}
                            </h2>
                          )}
                        </div>

                        <div
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            service.isActive
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800",
                          )}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>

                      {/* PRICE */}

                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-sm text-muted-foreground">
                          Starting Price
                        </p>

                        <h3 className="text-3xl font-bold">₹{minPrice}</h3>
                      </div>

                      {/* VARIANTS */}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Variants</p>

                          {isEditing && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={addEditVariant}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add
                            </Button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-3">
                            {editForm.variants.map((variant, index) => (
                              <div
                                key={index}
                                className="rounded-xl border bg-white p-3 space-y-2"
                              >
                                <Input
                                  placeholder="Variant Name"
                                  value={variant.name}
                                  onChange={(e) =>
                                    updateEditVariant(
                                      index,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                />

                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Price"
                                    value={variant.price}
                                    onChange={(e) =>
                                      updateEditVariant(
                                        index,
                                        "price",
                                        e.target.value,
                                      )
                                    }
                                  />

                                  <Input
                                    type="number"
                                    placeholder="Duration"
                                    value={variant.duration}
                                    onChange={(e) =>
                                      updateEditVariant(
                                        index,
                                        "duration",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {service.variants?.map((variant) => (
                              <div
                                key={variant.name}
                                className="flex items-center justify-between rounded-xl border bg-white px-3 py-2"
                              >
                                <div>
                                  <p className="font-medium">{variant.name}</p>

                                  <p className="text-xs text-muted-foreground">
                                    {variant.totalDuration || 0} mins
                                  </p>
                                </div>

                                <div className="font-semibold">
                                  ₹{variant.price}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* ACTIONS */}

                      <div className="flex gap-2 pt-2">
                        {isEditing ? (
                          <>
                            <Button
                              className="flex-1 rounded-xl"
                              onClick={() => handleSaveEdit(service.id)}
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </Button>

                            <Button
                              variant="outline"
                              className="rounded-xl"
                              onClick={() => setEditingServiceId(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              className="rounded-xl"
                              onClick={() => handleEdit(service)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              className={cn(
                                "flex-1 rounded-xl",
                                service.isActive
                                  ? "bg-orange-500 text-white"
                                  : "bg-green-500 text-white",
                              )}
                              disabled={isUpdating === service.id}
                              onClick={() =>
                                handleToggleActive(
                                  service.id,
                                  service.isActive,
                                  service.name,
                                )
                              }
                            >
                              {isUpdating === service.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : service.isActive ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </Button>

                            {/* <Button
                              variant="destructive"
                              className="rounded-xl"
                              disabled={isDeleting === service.id}
                              onClick={() =>
                                handleDelete(service.id, service.name)
                              }
                            >
                              {isDeleting === service.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button> */}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

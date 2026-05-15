// "use client";

// import { useEffect, useState } from "react";
// import { createBooking } from "@/actions/bookingAction";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";

// type Service = {
//   id: string;
//   name: string;
// };

// export default function BookingPage() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [selectedServices, setSelectedServices] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     customerName: "",
//     contact: "",
//     date: "",
//   });

//   // 🔴 Replace with your real API
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
//       date: new Date(form.date),
//       items: selectedServices.map((id) => ({
//         serviceId: id,
//       })),
//     });

//     setLoading(false);

//     if (res.success) {
//       alert("Booking successful");

//       setForm({
//         customerName: "",
//         contact: "",
//         date: "",
//       });
//       setSelectedServices([]);
//     } else {
//       alert(res.error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <Card className="w-full max-w-xl shadow-md">
//         <CardHeader>
//           <CardTitle>Book Appointment</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {/* Name */}
//           <div className="space-y-2">
//             <Label>Your Name</Label>
//             <Input
//               placeholder="Enter your name"
//               value={form.customerName}
//               onChange={(e) =>
//                 setForm({ ...form, customerName: e.target.value })
//               }
//             />
//           </div>

//           {/* Contact */}
//           <div className="space-y-2">
//             <Label>Phone Number</Label>
//             <Input
//               placeholder="Enter phone number"
//               value={form.contact}
//               onChange={(e) => setForm({ ...form, contact: e.target.value })}
//             />
//           </div>

//           {/* Date */}
//           <div className="space-y-2">
//             <Label>Select Date & Time</Label>
//             <Input
//               type="datetime-local"
//               value={form.date}
//               onChange={(e) => setForm({ ...form, date: e.target.value })}
//             />
//           </div>

//           {/* Services */}
//           <div className="space-y-3">
//             <Label>Select Services</Label>

//             <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-3">
//               {services.map((service) => (
//                 <div key={service.id} className="flex items-center space-x-2">
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
//           <Button onClick={handleSubmit} className="w-full" disabled={loading}>
//             {loading ? "Booking..." : "Confirm Booking"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import React from "react";

const page = () => {
  return <div></div>;
};

export default page;

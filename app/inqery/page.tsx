"use client";

import { useState, useTransition } from "react";

import {
  Loader2,
  Phone,
  Mail,
  User2,
  MessageSquare,
  Briefcase,
  FileText,
} from "lucide-react";

import { toast } from "sonner";

import { createLead } from "@/actions/leadAction";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

type FormState = {
  name: string;

  contact: string;

  email: string;

  service: string;

  source: string;

  notes: string;

  message: string;

  assignedTo: string;
};

export default function InquiryPage() {
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<FormState>({
    name: "",

    contact: "",

    email: "",

    service: "",

    source: "",

    notes: "",

    message: "",

    assignedTo: "",
  });

  // ============================================================================
  // HANDLE CHANGE
  // ============================================================================

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,

      [key]: value,
    }));
  };

  // ============================================================================
  // SUBMIT
  // ============================================================================

  const handleSubmit = () => {
    startTransition(async () => {
      if (!form.name.trim()) {
        toast.error("Customer name is required");

        return;
      }

      if (!form.contact.trim()) {
        toast.error("Phone number is required");

        return;
      }

      try {
        const response = await createLead({
          name: form.name.trim(),

          contact: form.contact.trim(),

          email: form.email || undefined,

          service: form.service || undefined,

          source: form.source || undefined,

          notes: form.notes || undefined,

          message: form.message || undefined,

          assignedTo: form.assignedTo || undefined,
          businessProfileId: "",
        });

        console.log("createLead response", response);

        if (!response.success) {
          toast.error(response.error);

          return;
        }

        toast.success("Inquiry submitted successfully");

        setForm({
          name: "",

          contact: "",

          email: "",

          service: "",

          source: "",

          notes: "",

          message: "",

          assignedTo: "",
        });
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong");
      }
    });
  };

  // ============================================================================
  // UI
  // ============================================================================

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-3xl">
        <Card className="rounded-3xl border-0 shadow-xl">
          <CardContent className="p-8">
            {/* HEADER */}

            <div className="mb-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Create Inquiry
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Add a new customer inquiry or lead manually.
              </p>
            </div>

            {/* FORM */}

            <div className="space-y-6">
              {/* CUSTOMER */}

              <div className="grid gap-5 md:grid-cols-2">
                {/* NAME */}

                <div className="space-y-2">
                  <Label>Customer Name</Label>

                  <div className="relative">
                    <User2 className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      placeholder="Enter customer name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="h-12 rounded-xl pl-10"
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div className="space-y-2">
                  <Label>Phone Number</Label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      placeholder="Enter phone number"
                      value={form.contact}
                      onChange={(e) => handleChange("contact", e.target.value)}
                      className="h-12 rounded-xl pl-10"
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div className="space-y-2">
                  <Label>Email Address</Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      type="email"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="h-12 rounded-xl pl-10"
                    />
                  </div>
                </div>

                {/* SERVICE */}

                <div className="space-y-2">
                  <Label>Interested Service</Label>

                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      placeholder="Haircut, Facial, Spa..."
                      value={form.service}
                      onChange={(e) => handleChange("service", e.target.value)}
                      className="h-12 rounded-xl pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* SOURCE */}

              <div className="space-y-2">
                <Label>Lead Source</Label>

                <select
                  value={form.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  className="h-12 w-full rounded-xl border bg-background px-4 text-sm"
                >
                  <option value="">Select source</option>

                  <option value="WHATSAPP">WhatsApp</option>

                  <option value="INSTAGRAM">Instagram</option>

                  <option value="FACEBOOK">Facebook</option>

                  <option value="GOOGLE">Google</option>

                  <option value="PHONE_CALL">Phone Call</option>

                  <option value="WEBSITE">Website</option>

                  <option value="WALK_IN">Walk In</option>

                  <option value="REFERRAL">Referral</option>
                </select>
              </div>

              {/* MESSAGE */}

              <div className="space-y-2">
                <Label>Customer Message</Label>

                <textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Write inquiry message..."
                  className="min-h-[120px] w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* NOTES */}

              <div className="space-y-2">
                <Label>Internal Notes</Label>

                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                  <textarea
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Add internal notes..."
                    className="min-h-[100px] w-full rounded-2xl border bg-background px-10 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              {/* ASSIGN */}

              <div className="space-y-2">
                <Label>Assign To</Label>

                <Input
                  placeholder="Staff name or manager"
                  value={form.assignedTo}
                  onChange={(e) => handleChange("assignedTo", e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              {/* ACTION */}

              <div className="flex flex-col gap-3 pt-4 md:flex-row">
                <Button
                  type="submit"
                  disabled={isPending}
                  onClick={handleSubmit}
                  className="h-12 flex-1 rounded-2xl"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MessageSquare className="mr-2 h-4 w-4" />
                  )}
                  Create Inquiry
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-2xl"
                  onClick={() =>
                    setForm({
                      name: "",

                      contact: "",

                      email: "",

                      service: "",

                      source: "",

                      notes: "",

                      message: "",

                      assignedTo: "",
                    })
                  }
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

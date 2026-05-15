export default function SettingsPage() {
  // #TODO: Implement settings page with sections for business info, booking settings, notifications, and payment settings. Include a "Danger Zone" for critical actions like deleting business data. Use forms and toggles for configuration options.
  // use server actions
  // admin profile where user can update password
  // business information like name, address, phone, email & updations
  // staff info like name, phone, email & updations

  const sections = [
    {
      title: "Business Information",
      description: "Manage salon details visible to customers.",
      fields: [
        { label: "Business Name", type: "text", placeholder: "Glow Studio" },
        { label: "Phone Number", type: "text", placeholder: "+91 9876543210" },
        {
          label: "Email Address",
          type: "email",
          placeholder: "hello@glowstudio.com",
        },
        { label: "Address", type: "text", placeholder: "Salon address" },
      ],
    },
    // {
    //   title: "Booking Settings",
    //   description: "Control appointment behaviour and defaults.",
    //   fields: [
    //     {
    //       label: "Default Booking Duration",
    //       type: "number",
    //       placeholder: "60",
    //     },
    //     {
    //       label: "Advance Booking Limit (days)",
    //       type: "number",
    //       placeholder: "30",
    //     },
    //     {
    //       label: "Cancellation Policy",
    //       type: "textarea",
    //       placeholder: "Cancellation rules...",
    //     },
    //   ],
    // },
    // {
    //   title: "Notifications",
    //   description: "Configure customer and admin alerts.",
    //   toggles: [
    //     "Booking Confirmation SMS",
    //     "WhatsApp Notifications",
    //     "Email Notifications",
    //     "Reminder Notifications",
    //   ],
    // },
    // {
    //   title: "Payment Settings",
    //   description: "Manage payment preferences.",
    //   fields: [
    //     { label: "UPI ID", type: "text", placeholder: "salon@upi" },
    //     { label: "GST Number", type: "text", placeholder: "GST Number" },
    //   ],
    //   toggles: ["Enable Online Payments", "Allow Partial Payments"],
    // },
  ];

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage salon configuration, bookings, notifications and payments.
            </p>
          </div>

          <button className="h-11 rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:opacity-90">
            Save Changes
          </button>
        </div>

        {/* GRID */}

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* SIDEBAR */}

          <div className="sticky top-6 h-fit rounded-3xl border bg-background p-4 shadow-sm">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.title}
                  className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition hover:bg-muted"
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}

          <div className="space-y-6">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border bg-background p-6 shadow-sm"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">{section.title}</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>

                {/* FIELDS */}

                {section.fields && (
                  <div className="grid gap-5 md:grid-cols-2">
                    {section.fields.map((field) => (
                      <div
                        key={field.label}
                        className={
                          field.type === "textarea" ? "md:col-span-2" : ""
                        }
                      >
                        <label className="mb-2 block text-sm font-medium">
                          {field.label}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            rows={5}
                            placeholder={field.placeholder}
                            className="w-full rounded-2xl border bg-background p-4 text-sm outline-none transition focus:border-black"
                          />
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-black"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* TOGGLES */}

                {/* {section.toggles && (
                  <div className="mt-6 space-y-4">
                    {section.toggles.map((toggle) => (
                      <div
                        key={toggle}
                        className="flex items-center justify-between rounded-2xl border p-4"
                      >
                        <div>
                          <h3 className="font-medium">{toggle}</h3>

                          <p className="text-sm text-muted-foreground">
                            Enable or disable this feature.
                          </p>
                        </div>

                        <button className="relative h-6 w-11 rounded-full bg-black transition">
                          <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )} */}
              </section>
            ))}

            {/* DANGER ZONE */}

            <section className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-red-600">
                  Danger Zone
                </h2>

                <p className="mt-1 text-sm text-red-500">
                  Critical actions related to your business account.
                </p>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-red-200 bg-white p-4">
                <div>
                  <h3 className="font-medium">Delete Business Data</h3>

                  <p className="text-sm text-muted-foreground">
                    Permanently remove bookings, clients and services.
                  </p>
                </div>

                <button className="h-11 rounded-xl bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700">
                  Delete Business
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

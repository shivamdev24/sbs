/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { prisma } from "@/lib/prisma";
import { get } from "http";
import { getCurrentUser } from "./getCurrentUser";

// ============================================================================
// TYPES
// ============================================================================

type BookingItemInput = {
  serviceId: string;

  variantId?: string;

  staffId?: string;
};

type CreateBookingData = {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;

  businessProfileId: string;

  staffId?: string;

  date: Date;

  time: string;

  bookingType?: string;

  notes?: string;

  discountCode?: string;

  items: BookingItemInput[];
};

// ============================================================================
// CREATE BOOKING
// ============================================================================

export async function createBooking(data: CreateBookingData) {
  try {
    // const currentUser = await getCurrentUser();
    // ============================================================================
    // VALIDATION
    // ============================================================================

    // if (!data.customerId) {
    //   throw new Error("Customer is required");
    // }

    if (!data.businessProfileId) {
      throw new Error("Business profile is required");
    }

    const isWalkIn = data.bookingType === "WALKIN";

    if (!isWalkIn) {
      if (!data.date) {
        throw new Error("Booking date is required");
      }

      if (!data.time) {
        throw new Error("Booking time is required");
      }
    }

    if (!data.items || data.items.length === 0) {
      throw new Error("At least one service is required");
    }

    console.log("Creating booking with data:", data);

    // ============================================================================
    // CUSTOMER
    // ============================================================================

    // const customer = await prisma.user.findUnique({
    //   where: {
    //     id: currentUser?.id,
    //   },
    // });

    // if (!customer) {
    //   throw new Error("Customer not found");
    // }

    // ============================================================================
    // BUSINESS
    // ============================================================================

    const business = await prisma.businessProfile.findUnique({
      where: {
        id: data.businessProfileId,
      },
    });

    if (!business) {
      throw new Error("Business profile not found");
    }

    // ============================================================================
    // DATE + TIME
    // ============================================================================

    const bookingDate = new Date(data.date);

    if (isNaN(bookingDate.getTime())) {
      throw new Error("Invalid booking date");
    }

    // if (isNaN(bookingTime.getTime())) {
    //   throw new Error("Invalid booking time");
    // }

    // ============================================================================
    // BUILD ITEMS
    // ============================================================================

    let totalPrice = 0;

    const bookingItemsData: any[] = [];

    for (const item of data.items) {
      // ============================================================================
      // SERVICE
      // ============================================================================

      const service = await prisma.service.findUnique({
        where: {
          id: item.serviceId,
        },
      });

      if (!service) {
        throw new Error("Service not found");
      }

      let finalPrice = 0;

      let finalDuration = service.duration || 0;

      // ============================================================================
      // VARIANT
      // ============================================================================

      if (item.variantId) {
        const variant = await prisma.serviceVariant.findUnique({
          where: {
            id: item.variantId,
          },
        });

        if (!variant) {
          throw new Error("Variant not found");
        }

        finalPrice = variant.price ?? finalPrice;

        finalDuration = variant.totalDuration ?? finalDuration;
      }

      totalPrice += finalPrice;

      bookingItemsData.push({
        serviceId: item.serviceId,

        variantId: item.variantId || null,

        staffId: item.staffId || null,

        price: finalPrice,

        duration: finalDuration,
      });
    }

    // ============================================================================
    // DISCOUNT
    // ============================================================================

    let discountAmount = 0;

    let discountCodeId: string | null = null;

    if (data.discountCode) {
      const discount = await prisma.discountCode.findFirst({
        where: {
          code: data.discountCode.toUpperCase(),
        },
      });

      if (!discount) {
        throw new Error("Invalid discount code");
      }

      // Expired
      if (discount.validUntil && new Date(discount.validUntil) < new Date()) {
        throw new Error("Discount code expired");
      }

      // Usage limit
      if (
        discount.maxUses !== null &&
        discount.maxUses !== undefined &&
        discount.usedCount >= discount.maxUses
      ) {
        throw new Error("Discount usage limit reached");
      }

      discountAmount = Math.floor(
        (totalPrice * discount.discountPercentage) / 100,
      );

      discountCodeId = discount.id;
    }

    // ============================================================================
    // FINAL PRICE
    // ============================================================================

    const finalTotal = totalPrice - discountAmount;

    // ============================================================================
    // TRANSACTION
    // ============================================================================

    const booking = await prisma.$transaction(async (tx) => {
      // ============================================================================
      // CREATE BOOKING
      // ============================================================================

      // const createdBooking = await tx.booking.create({
      //   data: {
      //     businessProfileId: data.businessProfileId,

      //     staffId: data.staffId || null,

      //     date: bookingDate,

      //     time: bookingTime,

      //     totalPrice: finalTotal,

      //     discountAmount,

      //     discountCodeId,

      //     bookingType: data.bookingType,

      //     notes: data.notes || null,

      //     items: {
      //       create: bookingItemsData,
      //     },
      //   },

      //   include: {
      //     customer: true,

      //     staff: true,

      //     items: {
      //       include: {
      //         service: true,

      //         variant: true,

      //         staff: true,
      //       },
      //     },

      //     discountCode: true,
      //   },
      // });

      const createdBooking = await tx.booking.create({
        data: {
          BBABookingName: data.customerName, // You can replace this with actual admin name if available
          BBABookingPhone: data.customerPhone, // You can replace this with actual admin phone if available
          BBABookingEmail: data.customerEmail, // You can replace this with actual admin email if available

          businessProfileId: data.businessProfileId,

          staffId: data.staffId || null,

          date: bookingDate,

          time: data.time,

          totalPrice: finalTotal,

          discountAmount,

          discountCodeId,

          bookingType: data.bookingType,

          notes: data.notes || null,

          items: {
            create: bookingItemsData,
          },
        },

        include: {
          staff: true,

          items: {
            include: {
              service: true,

              variant: true,

              staff: true,
            },
          },

          discountCode: true,
        },
      });

      // ============================================================================
      // UPDATE DISCOUNT USAGE
      // ============================================================================

      if (discountCodeId) {
        await tx.discountCode.update({
          where: {
            id: discountCodeId,
          },

          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
      }

      return createdBooking;
    });

    return {
      success: true,

      data: booking,

      message: "Booking created successfully",
    };
  } catch (error: any) {
    console.error("CREATE BOOKING ERROR:", error);

    return {
      success: false,

      error: error.message || "Failed to create booking",
    };
  }
}

export async function createBookingByUser(data: CreateBookingData) {
  try {
    // ============================================================================
    // VALIDATION
    // ============================================================================

    // if (!data.customerId) {
    //   throw new Error("Customer is required");
    // }

    if (!data.businessProfileId) {
      throw new Error("Business profile is required");
    }

    if (!data.date) {
      throw new Error("Booking date is required");
    }

    if (!data.time) {
      throw new Error("Booking time is required");
    }

    if (!data.items || data.items.length === 0) {
      throw new Error("At least one service is required");
    }

    console.log("Creating booking with data:", data);

    // ============================================================================
    // CUSTOMER
    // ============================================================================

    // const customer = await prisma.user.findUnique({
    //   where: {
    //     id: data.customerId,
    //   },
    // });

    // if (!customer) {
    //   throw new Error("Customer not found");
    // }

    // ============================================================================
    // BUSINESS
    // ============================================================================

    const business = await prisma.businessProfile.findUnique({
      where: {
        id: data.businessProfileId,
      },
    });

    if (!business) {
      throw new Error("Business profile not found");
    }

    // ============================================================================
    // DATE + TIME
    // ============================================================================

    const bookingDate = new Date(data.date);

    if (isNaN(bookingDate.getTime())) {
      throw new Error("Invalid booking date");
    }

    // if (isNaN(bookingTime.getTime())) {
    //   throw new Error("Invalid booking time");
    // }

    // ============================================================================
    // BUILD ITEMS
    // ============================================================================

    let totalPrice = 0;

    const bookingItemsData: any[] = [];

    for (const item of data.items) {
      // ============================================================================
      // SERVICE
      // ============================================================================

      const service = await prisma.service.findUnique({
        where: {
          id: item.serviceId,
        },
      });

      if (!service) {
        throw new Error("Service not found");
      }

      let finalPrice = 0;

      let finalDuration = service.duration || 0;

      // ============================================================================
      // VARIANT
      // ============================================================================

      if (item.variantId) {
        const variant = await prisma.serviceVariant.findUnique({
          where: {
            id: item.variantId,
          },
        });

        if (!variant) {
          throw new Error("Variant not found");
        }

        finalPrice = variant.price ?? finalPrice;

        finalDuration = variant.totalDuration ?? finalDuration;
      }

      totalPrice += finalPrice;

      bookingItemsData.push({
        serviceId: item.serviceId,

        variantId: item.variantId || null,

        staffId: item.staffId || null,

        price: finalPrice,

        duration: finalDuration,
      });
    }

    // ============================================================================
    // DISCOUNT
    // ============================================================================

    let discountAmount = 0;

    let discountCodeId: string | null = null;

    if (data.discountCode) {
      const discount = await prisma.discountCode.findFirst({
        where: {
          code: data.discountCode.toUpperCase(),
        },
      });

      if (!discount) {
        throw new Error("Invalid discount code");
      }

      // Expired
      if (discount.validUntil && new Date(discount.validUntil) < new Date()) {
        throw new Error("Discount code expired");
      }

      // Usage limit
      if (
        discount.maxUses !== null &&
        discount.maxUses !== undefined &&
        discount.usedCount >= discount.maxUses
      ) {
        throw new Error("Discount usage limit reached");
      }

      discountAmount = Math.floor(
        (totalPrice * discount.discountPercentage) / 100,
      );

      discountCodeId = discount.id;
    }

    // ============================================================================
    // FINAL PRICE
    // ============================================================================

    const finalTotal = totalPrice - discountAmount;

    // ============================================================================
    // TRANSACTION
    // ============================================================================

    const booking = await prisma.$transaction(async (tx) => {
      // ============================================================================
      // CREATE BOOKING
      // ============================================================================

      // const createdBooking = await tx.booking.create({
      //   data: {
      //     businessProfileId: data.businessProfileId,

      //     staffId: data.staffId || null,

      //     date: bookingDate,

      //     time: bookingTime,

      //     totalPrice: finalTotal,

      //     discountAmount,

      //     discountCodeId,

      //     bookingType: data.bookingType,

      //     notes: data.notes || null,

      //     items: {
      //       create: bookingItemsData,
      //     },
      //   },

      //   include: {
      //     customer: true,

      //     staff: true,

      //     items: {
      //       include: {
      //         service: true,

      //         variant: true,

      //         staff: true,
      //       },
      //     },

      //     discountCode: true,
      //   },
      // });

      const createdBooking = await tx.booking.create({
        data: {
          BBABookingName: data.customerName, // You can replace this with actual admin name if available
          BBABookingPhone: data.customerPhone, // You can replace this with actual admin phone if available
          BBABookingEmail: data.customerEmail, // You can replace this with actual admin email if available

          businessProfileId: data.businessProfileId,

          staffId: data.staffId || null,

          date: bookingDate,

          time: data.time,

          totalPrice: finalTotal,

          discountAmount,

          discountCodeId,

          bookingType: data.bookingType,

          notes: data.notes || null,

          items: {
            create: bookingItemsData,
          },
        },

        include: {
          staff: true,

          items: {
            include: {
              service: true,

              variant: true,

              staff: true,
            },
          },

          discountCode: true,
        },
      });

      // ============================================================================
      // UPDATE DISCOUNT USAGE
      // ============================================================================

      if (discountCodeId) {
        await tx.discountCode.update({
          where: {
            id: discountCodeId,
          },

          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
      }

      return createdBooking;
    });

    return {
      success: true,

      data: booking,

      message: "Booking created successfully",
    };
  } catch (error: any) {
    console.error("CREATE BOOKING ERROR:", error);

    return {
      success: false,

      error: error.message || "Failed to create booking",
    };
  }
}

// ============================================================================
// GET BOOKINGS
// ============================================================================

export async function getBookings(businessProfileId: string) {
  try {
    if (!businessProfileId) {
      throw new Error("Business profile ID required");
    }

    const bookings = await prisma.booking.findMany({
      where: {
        businessProfileId,
      },

      include: {
        customer: true,

        staff: true,

        discountCode: true,

        items: {
          include: {
            service: true,

            variant: true,

            staff: true,
          },
        },

        payments: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,

      data: bookings,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,

      data: [],

      error: error.message || "Failed to fetch bookings",
    };
  }
}

// ============================================================================
// GET SINGLE BOOKING
// ============================================================================

export async function getBookingById(id: string) {
  try {
    if (!id) {
      throw new Error("Booking ID required");
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },

      include: {
        customer: true,

        staff: true,

        discountCode: true,

        items: {
          include: {
            service: true,

            variant: true,

            staff: true,
          },
        },

        payments: true,
      },
    });

    console.log("Fetched booking:", booking); // Debugging log

    if (!booking) {
      throw new Error("Booking not found");
    }

    return {
      success: true,

      data: booking,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,

      data: null,

      error: error.message || "Failed to fetch booking",
    };
  }
}

// ============================================================================
// UPDATE BOOKING STATUS
// ============================================================================

export async function updateBookingStatus(
  bookingId: string,
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
) {
  try {
    if (!bookingId) {
      throw new Error("Booking ID required");
    }

    const updated = await prisma.booking.update({
      where: {
        id: bookingId,
      },

      data: {
        status,
      },
    });

    return {
      success: true,

      data: updated,

      message: "Booking updated",
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,

      error: error.message || "Failed to update booking",
    };
  }
}

// ============================================================================
// UPDATE BOOKING
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================

type UpdateBookingItemInput = {
  serviceId: string;

  variantId?: string;

  staffId?: string;

  price: number;

  duration: number;
};

type UpdateBookingData = {
  BBABookingName?: string;

  BBABookingPhone?: string;

  BBABookingEmail?: string;

  staffId?: string;

  date: Date;

  time: string;

  totalPrice?: number;

  discountAmount?: number;

  discountCodeId?: string;

  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

  bookingType?: string;

  notes?: string;

  cancelledAt?: Date | null;

  cancelledReason?: string | null;

  items: UpdateBookingItemInput[];
};

// ============================================================================
// UPDATE BOOKING
// ============================================================================

export async function updateBooking(
  bookingId: string,
  data: UpdateBookingData,
) {
  try {
    // ============================================================================
    // VALIDATION
    // ============================================================================

    if (!bookingId) {
      throw new Error("Booking ID required");
    }

    if (!data.date) {
      throw new Error("Booking date required");
    }

    if (!data.time) {
      throw new Error("Booking time required");
    }

    if (!data.items || data.items.length === 0) {
      throw new Error("At least one service required");
    }

    // ============================================================================
    // CHECK BOOKING
    // ============================================================================

    const existingBooking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },

      include: {
        items: true,
      },
    });

    if (!existingBooking) {
      throw new Error("Booking not found");
    }

    // ============================================================================
    // RECALCULATE TOTALS
    // ============================================================================

    let subtotal = 0;

    for (const item of data.items) {
      subtotal += Number(item.price || 0);
    }

    let discountAmount = Number(data.discountAmount || 0);

    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    const finalTotal = subtotal - discountAmount;

    // ============================================================================
    // UPDATE BOOKING
    // ============================================================================

    const updatedBooking = await prisma.$transaction(async (tx) => {
      // ============================================================================
      // DELETE OLD ITEMS
      // ============================================================================

      await tx.bookingItem.deleteMany({
        where: {
          bookingId,
        },
      });

      // ============================================================================
      // UPDATE BOOKING
      // ============================================================================

      const booking = await tx.booking.update({
        where: {
          id: bookingId,
        },

        data: {
          BBABookingName: data.BBABookingName || null,

          BBABookingPhone: data.BBABookingPhone || null,

          BBABookingEmail: data.BBABookingEmail || null,

          staffId: data.staffId || null,

          date: new Date(data.date),

          time: data.time,

          totalPrice: finalTotal,

          discountAmount,

          discountCodeId: data.discountCodeId || null,

          status: data.status || existingBooking.status,

          bookingType: data.bookingType || null,

          notes: data.notes || null,

          cancelledAt: data.cancelledAt || null,

          cancelledReason: data.cancelledReason || null,

          items: {
            create: data.items.map((item) => ({
              serviceId: item.serviceId,

              variantId: item.variantId || null,

              staffId: item.staffId || null,

              price: Number(item.price || 0),

              duration: Number(item.duration || 0),
            })),
          },
        },

        include: {
          staff: true,

          discountCode: true,

          items: {
            include: {
              service: true,

              variant: true,

              staff: true,
            },
          },

          payments: true,
        },
      });

      return booking;
    });

    return {
      success: true,

      data: updatedBooking,

      message: "Booking updated successfully",
    };
  } catch (error: any) {
    console.error("UPDATE BOOKING ERROR:", error);

    return {
      success: false,

      error: error.message || "Failed to update booking",
    };
  }
}
// ============================================================================
// CANCEL BOOKING
// ============================================================================

export async function cancelBooking(bookingId: string, reason?: string) {
  try {
    if (!bookingId) {
      throw new Error("Booking ID required");
    }

    const updated = await prisma.booking.update({
      where: {
        id: bookingId,
      },

      data: {
        status: "CANCELLED",

        cancelledAt: new Date(),

        cancelledReason: reason || null,
      },
    });

    return {
      success: true,

      data: updated,

      message: "Booking cancelled",
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,

      error: error.message || "Failed to cancel booking",
    };
  }
}

// ============================================================================
// DELETE BOOKING
// ============================================================================

export async function deleteBooking(bookingId: string) {
  try {
    if (!bookingId) {
      throw new Error("Booking ID required");
    }

    await prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });

    return {
      success: true,

      message: "Booking deleted",
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,

      error: error.message || "Failed to delete booking",
    };
  }
}

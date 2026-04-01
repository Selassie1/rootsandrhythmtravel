// src/actions/admin.ts
"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Resend } from 'resend';
import { getSiteURL } from "@/utils/url-helper";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Validates the current session and ensures the user has the 'admin' role.
 * Throws an error if unauthorized.
 */
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: No valid session found.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    throw new Error("Forbidden: You must be an admin to perform this action.");
  }

  return { supabase, user };
}

/**
 * Creates a master Supabase client utilizing the Service Role Key.
 * Bypasses Row Level Security (RLS). Must ONLY be executed AFTER `requireAdmin()`.
 */
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ==========================================
// 1. Tour Manifest Engine (Tours Actions)
// ==========================================

export async function getAdminTours() {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: tours, error } = await adminClient
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tours:", error);
    throw new Error("Failed to fetch tours.");
  }

  return tours;
}

export async function createTour(data: any) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: newTour, error } = await adminClient
    .from("tours")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating tour:", error);
    return { success: false, error: error.message || "Failed to create tour." };
  }

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  return { success: true, tour: newTour };
}

export async function updateTour(id: string, data: any) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: updatedTour, error } = await adminClient
    .from("tours")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating tour:", error);
    return { success: false, error: error.message || "Failed to update tour." };
  }

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  revalidatePath(`/tours/${data.slug || id}`);
  return { success: true, tour: updatedTour };
}

export async function toggleTourStatus(id: string, currentStatus: boolean) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: updatedTour, error } = await adminClient
    .from("tours")
    .update({ is_active: !currentStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling tour status:", error);
    throw new Error(error.message || "Failed to toggle tour status.");
  }

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  return updatedTour;
}

export async function deleteTour(id: string) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { error } = await adminClient
    .from("tours")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting tour:", error);
    throw new Error(error.message || "Failed to delete tour.");
  }

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  return { success: true };
}

// ==========================================
// 2. Global Financial & Booking Registry (Bookings Actions)
// ==========================================

export async function getAllBookings() {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: bookings, error } = await adminClient
    .from("bookings")
    .select(`
      *,
      profiles(first_name, last_name, phone),
      tours(title, slug)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to fetch bookings.");
  }

  return bookings;
}

export async function getAllTransactions() {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: rawTransactions, error } = await adminClient
    .from("payment_transactions")
    .select(`
      *,
      profiles(id, first_name, last_name, phone),
      bookings(paystack_reference)
    `)
    .order("created_at", { ascending: false });

  if (error || !rawTransactions) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions.");
  }

  // 2. Fetch secure auth identities to map emails (identical to getAllUsers logic)
  const { data: authData } = await adminClient.auth.admin.listUsers();
  const emailMap = new Map();
  if (authData?.users) {
    authData.users.forEach(u => emailMap.set(u.id, u.email));
  }

  // 3. Stitch emails onto the transaction profiles for the management view
  return rawTransactions.map(tx => ({
    ...tx,
    profiles: tx.profiles ? {
      ...tx.profiles,
      email: emailMap.get(tx.profiles.id) || null
    } : null
  }));
}

export async function updateBookingStatus(id: string, newStatus: string) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: updatedBooking, error } = await adminClient
    .from("bookings")
    .update({ booking_status: newStatus })
    .eq("id", id)
    .select('*, tours(title)')
    .single();

  if (error) {
    console.error("Error updating booking status:", error);
    throw new Error(error.message || "Failed to update booking status.");
  }

  // Generate automated outbound email pipeline
  try {
     // Fetch email from auth since profiles doesn't have it
     const authData = await adminClient.auth.admin.getUserById(updatedBooking.user_id || '');
     const emailDestination = authData.data.user?.email || updatedBooking.guest_email;
     
     // Correcting profile field access
     const { data: profile } = await adminClient.from('profiles').select('first_name').eq('id', updatedBooking.user_id || '').single();
     const travelerName = profile?.first_name || updatedBooking.guest_name || 'Traveler';
     const tourTitle = updatedBooking.tours?.title || 'Your upcoming journey';
     
     if (emailDestination) {
        await resend.emails.send({
           from: 'Root & Rhythm Travels <concierge@rootsandrhythmtravel.com>',
           to: emailDestination,
           subject: `Booking Status Update: ${newStatus.replace('_', ' ')}`,
           html: `
             <div style="font-family: sans-serif; background-color: #131A14; color: #FAFAF8; padding: 40px; text-align: center;">
               <h1 style="color: #B8860B; font-weight: normal; letter-spacing: 2px;">ROOTS & RHYTHM</h1>
               <div style="background-color: #1A241B; padding: 40px; border-radius: 12px; margin-top: 30px; border: 1px solid rgba(255,255,255,0.1);">
                 <h2 style="margin-bottom: 20px;">Booking Update</h2>
                 <p style="color: #A0A0A0; line-height: 1.6;">Hello ${travelerName},</p>
                 <p style="color: #A0A0A0; line-height: 1.6;">The status of your reservation for <strong>${tourTitle}</strong> has been actively updated to:</p>
                 <div style="background-color: rgba(184,134,11,0.1); border: 1px solid rgba(184,134,11,0.3); color: #E8D3A2; display: inline-block; padding: 10px 24px; border-radius: 50px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin: 20px 0; font-size: 12px;">
                    ${newStatus.replace('_', ' ')}
                 </div>
                 <p style="color: #A0A0A0; line-height: 1.6; font-size: 14px;">If you have any urgent inquiries regarding this alteration, our luxury concierge is on standby to assist you.</p>
                 <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; margin-top: 20px; text-decoration: none; background-color: #B8860B; color: #000; padding: 12px 24px; border-radius: 50px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">View Details</a>
               </div>
             </div>
           `
        });
  console.log("Successfully fired Resend Booking Update Email to: ", emailDestination);
      }
   } catch (emailErr) {
      console.error("Resend Pipeline Error (Booking Status):", emailErr);
   }

   revalidatePath("/admin/bookings");
   return updatedBooking;
}

/**
 * Resends the itinerary receipt to the customer.
 */
export async function resendReceipt(bookingId: string) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: booking, error } = await adminClient
    .from("bookings")
    .select('*, tours(title)')
    .eq("id", bookingId)
    .single();

  if (error || !booking) throw new Error("Booking not found.");

  try {
     const authData = await adminClient.auth.admin.getUserById(booking.user_id || '');
     const emailDestination = authData.data.user?.email || booking.guest_email;
     const { data: profile } = await adminClient.from('profiles').select('first_name').eq('id', booking.user_id || '').single();
     const travelerName = profile?.first_name || booking.guest_name || 'Traveler';

     if (emailDestination) {
        const res = await resend.emails.send({
           from: 'Root & Rhythm Travels <concierge@rootsandrhythmtravel.com>',
           to: emailDestination,
           subject: `Itinerary Receipt: ${booking.tours?.title}`,
           html: `<div style="font-family:sans-serif;background:#131A14;color:#FAFAF8;padding:40px;">
             <h1>ROOTS & RHYTHM</h1>
             <p>Hello ${travelerName}, here is your receipt for <strong>${booking.tours?.title}</strong>.</p>
             <p>Ref: ${booking.paystack_reference}</p>
             <p>Amount: $${booking.amount_paid}</p>
           </div>`
        });
        if (res.error) throw new Error(res.error.message);
        return { success: true };
     }
     return { success: false, error: "No email." };
  } catch (err: any) {
     return { success: false, error: err.message };
  }
}

export async function updatePaymentStatus(id: string, newStatus: string) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: updatedBooking, error } = await adminClient
    .from("bookings")
    .update({ payment_status: newStatus })
    .eq("id", id)
    .select('*, tours(title)')
    .single();

  if (error) {
    console.error("Error updating payment status:", error);
    throw new Error(error.message || "Failed to update payment status.");
  }

  // Generate automated outbound email pipeline
  try {
     // Fetch email from auth since profiles doesn't have it
     const authData = await adminClient.auth.admin.getUserById(updatedBooking.user_id || '');
     const emailDestination = authData.data.user?.email || updatedBooking.guest_email;
     
     // Correcting profile field access
     const { data: profile } = await adminClient.from('profiles').select('first_name').eq('id', updatedBooking.user_id || '').single();
     const travelerName = profile?.first_name || updatedBooking.guest_name || 'Traveler';
     const tourTitle = updatedBooking.tours?.title || 'Your upcoming journey';
     
     if (emailDestination) {
        await resend.emails.send({
           from: 'Root & Rhythm Travels <concierge@rootsandrhythmtravel.com>',
           to: emailDestination,
           subject: `Payment Status Update: ${newStatus.replace('_', ' ')}`,
           html: `
             <div style="font-family: sans-serif; background-color: #131A14; color: #FAFAF8; padding: 40px; text-align: center;">
               <h1 style="color: #B8860B; font-weight: normal; letter-spacing: 2px;">ROOTS & RHYTHM</h1>
               <div style="background-color: #1A241B; padding: 40px; border-radius: 12px; margin-top: 30px; border: 1px solid rgba(255,255,255,0.1);">
                 <h2 style="margin-bottom: 20px;">Financial Ledger Update</h2>
                 <p style="color: #A0A0A0; line-height: 1.6;">Hello ${travelerName},</p>
                 <p style="color: #A0A0A0; line-height: 1.6;">The payment ledger for your reservation <strong>${tourTitle}</strong> has been officially logged as:</p>
                 <div style="background-color: rgba(184,134,11,0.1); border: 1px solid rgba(184,134,11,0.3); color: #E8D3A2; display: inline-block; padding: 10px 24px; border-radius: 50px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin: 20px 0; font-size: 12px;">
                    ${newStatus.replace('_', ' ')}
                 </div>
                 <p style="color: #A0A0A0; line-height: 1.6; font-size: 14px;">If this status is unexpected, please contact your concierge team immediately.</p>
                  <a href="${await getSiteURL()}/dashboard" style="display: inline-block; margin-top: 20px; text-decoration: none; background-color: #B8860B; color: #000; padding: 12px 24px; border-radius: 50px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">View Dashboard</a>
               </div>
             </div>
           `
        });
        console.log("Successfully fired Resend Payment Update Email to: ", emailDestination);
     }
  } catch (emailErr) {
     console.error("Resend Pipeline Error (Payment Status):", emailErr);
  }

  revalidatePath("/admin/bookings");
  return updatedBooking;
}

export async function deleteBooking(id: string) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { error } = await adminClient
    .from("bookings")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting booking:", error);
    throw new Error(error.message || "Failed to delete booking.");
  }

  revalidatePath("/admin/bookings");
  return { success: true };
}

// ==========================================
// 3. Global Travelers Matrix (User Actions)
// ==========================================

export async function getAllUsers() {
  await requireAdmin();
  const adminClient = getAdminClient();

  // 1. Fetch public profiles
  const { data: users, error } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !users) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users.");
  }

  // 2. Fetch secure auth identities bypassing all RLS constraints
  const { data: authData, error: authError } = await adminClient.auth.admin.listUsers();

  if (authError || !authData?.users) {
    console.warn("Could not fetch auth metadata for emails, returning raw profiles.");
    return users;
  }

  // 3. Fast mapping dictionary
  const emailMap = new Map();
  authData.users.forEach(u => emailMap.set(u.id, u.email));

  // 4. Stitching
  return users.map(user => ({
    ...user,
    email: emailMap.get(user.id) || null
  }));
}

export async function updateUserRole(id: string, newRole: string) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: updatedUser, error } = await adminClient
    .from("profiles")
    .update({ role: newRole })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user role:", error);
    throw new Error(error.message || "Failed to update user role.");
  }  revalidatePath("/admin/users");
  return updatedUser;
}

export async function deleteUser(id: string) {
  await requireAdmin();
  const adminClient = getAdminClient();

  // Delete from auth.users (cascades to profiles)
  const { error } = await adminClient.auth.admin.deleteUser(id);

  if (error) {
    console.error("Error deleting user:", error);
    throw new Error(error.message || "Failed to delete user.");
  }

  revalidatePath("/admin/users");
  return { success: true };
}

// ==========================================
// 4. Support Tickets (Tickets Actions)
// ==========================================

export async function getAllTickets() {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: tickets, error } = await adminClient
    .from("support_tickets")
    .select(`
      *,
      profiles(first_name, last_name, phone)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    throw new Error("Failed to fetch support tickets.");
  }

  return tickets;
}

export async function uploadTourImage(formData: FormData) {
  // Ultra-Secure Server-Side Upload bypassing restrictive Storage RLS 
  await requireAdmin();
  const adminClient = getAdminClient();
  
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `tours/${fileName}`;

  const { error: uploadError } = await adminClient.storage
    .from('images') // Ensure 'images' bucket exists inside Supabase
    .upload(filePath, file);

  if (uploadError) {
    console.error("Storage Error:", uploadError);
    return { success: false, error: uploadError.message };
  }

  const { data: { publicUrl } } = adminClient.storage
    .from('images')
    .getPublicUrl(filePath);

  return { success: true, url: publicUrl };
}

export async function updateTicketStatus(id: string, newStatus: string) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { data: updatedTicket, error } = await adminClient
    .from("support_tickets")
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating ticket status:", error);
    throw new Error(error.message || "Failed to update ticket status.");
  }

  revalidatePath("/admin/tickets");
  return updatedTicket;
}

export async function deleteTicket(id: string) {
  await requireAdmin();
  const adminClient = getAdminClient();

  const { error } = await adminClient
    .from("support_tickets")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting ticket:", error);
    throw new Error(error.message || "Failed to delete ticket.");
  }

  revalidatePath("/admin/tickets");
  return { success: true };
}

// ==========================================
// 5. Admin Settings (Settings Actions)
// ==========================================

export async function updateAdminProfile(formData: { first_name: string; last_name: string; phone: string }) {
  const { supabase, user } = await requireAdmin();

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating admin profile:", error);
    throw new Error(error.message || "Failed to update profile.");
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  return updatedProfile;
}

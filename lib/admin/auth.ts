import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string | null;
}

// The real gate. Middleware only confirms "there's a session" —  this is
// what confirms "and that session belongs to an admin," by checking the
// public.users.role column, same thing the is_admin() RLS function
// checks at the database layer. Call this at the top of the admin
// layout (page-level) and again inside every server action that
// mutates data (defense in depth — never trust that the layout check
// alone is enough, since a server action can in principle be invoked
// without going through the page that renders its form).
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "admin") {
    redirect("/admin/login?error=not-authorized");
  }

  return { id: user.id, email: user.email ?? null };
}

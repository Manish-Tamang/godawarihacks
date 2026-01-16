import { requireAdmin } from "@/app/lib/supabase/auth-helpers";
import { EmailSenderClient } from "@/app/components/admin/EmailSenderClient";

export default async function EmailSenderPage() {
    // Require admin authentication
    await requireAdmin();

    return <EmailSenderClient />;
}

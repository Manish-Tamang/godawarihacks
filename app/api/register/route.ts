import { createAdminClient } from "@/app/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const supabase = createAdminClient();

    // Extract team name
    const teamName = formData.get("teamName") as string;
    if (!teamName?.trim()) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 },
      );
    }

    // Extract member data
    const members: Array<{
      name: string;
      email: string;
      phone: string;
      documentType: string;
      document: File | null;
    }> = [];

    for (let i = 1; i <= 3; i++) {
      const name = formData.get(`member${i}_name`) as string;
      const email = formData.get(`member${i}_email`) as string;
      const phone = formData.get(`member${i}_phone`) as string;
      const documentType = formData.get(`member${i}_documentType`) as string;
      const document = formData.get(`member${i}_document`) as File | null;

      if (!name || !email || !phone || !documentType || !document) {
        return NextResponse.json(
          { error: `All fields are required for member ${i}` },
          { status: 400 },
        );
      }

      // Validate file size (5MB)
      if (document.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Document for member ${i} exceeds 5MB limit` },
          { status: 400 },
        );
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(document.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type for member ${i}. Only PDF, JPG, PNG allowed.`,
          },
          { status: 400 },
        );
      }

      members.push({ name, email, phone, documentType, document });
    }

    // Create team in database
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        team_name: teamName.trim(),
        status: "pending",
      })
      .select()
      .single();

    if (teamError || !team) {
      console.error("Error creating team:", teamError);
      return NextResponse.json(
        { error: "Failed to create team registration" },
        { status: 500 },
      );
    }

    // Upload documents and create team members
    interface TeamMemberResponse {
      full_name: string;
      email: string;
      phone: string;
    }
    const teamMembers: TeamMemberResponse[] = [];
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const file = member.document!;

      // Generate file path: registrations/{team_id}/member{i+1}_{filename}
      const fileExt = file.name.split(".").pop();
      const fileName = `member${i + 1}_${Date.now()}.${fileExt}`;
      const filePath = `registrations/${team.id}/${fileName}`;

      // Convert File to ArrayBuffer for upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("team-documents")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        // Clean up: delete team if document upload fails
        await supabase.from("teams").delete().eq("id", team.id);
        return NextResponse.json(
          { error: `Failed to upload document for member ${i + 1}` },
          { status: 500 },
        );
      }

      // Get public URL (or signed URL for private buckets)
      const { data: urlData } = supabase.storage
        .from("team-documents")
        .getPublicUrl(filePath);

      // Create team member record
      const { data: teamMember, error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          member_number: i + 1,
          full_name: member.name.trim(),
          email: member.email.toLowerCase().trim(),
          phone: member.phone.trim(),
          document_type: member.documentType,
          document_url: urlData.publicUrl,
          document_path: filePath,
        })
        .select()
        .single();

      if (memberError || !teamMember) {
        console.error("Error creating team member:", memberError);
        // Clean up: delete team and uploaded documents
        await supabase.from("teams").delete().eq("id", team.id);
        // Note: Storage cleanup would require listing and deleting files
        return NextResponse.json(
          { error: `Failed to create member ${i + 1} record` },
          { status: 500 },
        );
      }

      teamMembers.push({
        full_name: teamMember.full_name,
        email: teamMember.email,
        phone: teamMember.phone,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Team registration successful",
        team: {
          id: team.id,
          team_name: team.team_name,
          status: team.status,
          registration_date: team.registration_date,
        },
        members: teamMembers.map((m) => ({
          name: m.full_name,
          email: m.email,
          phone: m.phone,
        })),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

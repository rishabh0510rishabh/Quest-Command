import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QuestDashboardClient } from "@/components/quest-dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch initial quests
  const { data: quests } = await supabase
    .from("quests")
    .select("*")
    .eq("user_id", user.id)
    .order("deadline", { ascending: true })

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <QuestDashboardClient
      user={user}
      initialQuests={quests || []}
      userProfile={profile || {
        id: user.id,
        email: user.email!,
        display_name: "OPERATIVE",
        xp: 0,
        level: 1
      }}
    />
  )
}

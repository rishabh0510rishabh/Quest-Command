export type QuestStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"

export type QuestFrequency = "SINGLE" | "DAILY" | "WEEKLY" | "MONTHLY"

export interface Quest {
  id: string
  user_id: string
  title: string
  status: QuestStatus
  deadline: string // Supabase returns ISO string for timestamptz
  notion_url?: string | null
  notes?: string | null
  frequency: QuestFrequency
  created_at: string
}

export interface Profile {
  id: string
  email: string
  display_name: string
  avatar_url?: string | null
  xp: number
  level: number
  updated_at?: string | null
}

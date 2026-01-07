"use client"

import { useState, useMemo, useEffect } from "react"
import { SyncBar } from "@/components/sync-bar"
import { ProfileStats } from "@/components/profile-stats"
import { QuestGrid } from "@/components/quest-grid"
import { ArchiveSection } from "@/components/archive-section"
import { NewQuestButton } from "@/components/new-quest-button"
import { QuestModal } from "@/components/new-quest-modal"
import { SettingsModal } from "@/components/settings-modal"
import { AnalyticsModal } from "@/components/analytics-modal"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Quest, QuestStatus, Profile } from "@/lib/types"
import type { User } from "@supabase/supabase-js"


function getNextDeadline(currentDeadline: string | Date, frequency: Quest["frequency"]): Date {
  const next = new Date(currentDeadline)
  switch (frequency) {
    case "DAILY":
      next.setDate(next.getDate() + 1)
      break
    case "WEEKLY":
      next.setDate(next.getDate() + 7)
      break
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1)
      break
    default:
      break
  }
  return next
}

function categorizeByDate(quests: Quest[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const categories = {
    overdue: [] as Quest[],
    today: [] as Quest[],
    tomorrow: [] as Quest[],
    thisWeek: [] as Quest[],
    later: [] as Quest[],
  }

  quests.forEach((quest) => {
    const deadline = new Date(quest.deadline)
    const deadlineDate = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())

    if (deadline < now) {
      categories.overdue.push(quest)
    } else if (deadlineDate.getTime() === today.getTime()) {
      categories.today.push(quest)
    } else if (deadlineDate.getTime() === tomorrow.getTime()) {
      categories.tomorrow.push(quest)
    } else if (deadline < nextWeek) {
      categories.thisWeek.push(quest)
    } else {
      categories.later.push(quest)
    }
  })

  return categories
}


interface QuestDashboardClientProps {
  user: User
  initialQuests: Quest[]
  userProfile: Profile
}

export function QuestDashboardClient({ user, initialQuests, userProfile }: QuestDashboardClientProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [quests, setQuests] = useState<Quest[]>(initialQuests)
  const [profile, setProfile] = useState<Profile>(userProfile)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  const [streak, setStreak] = useState(0)
  const supabase = createClient()

  // Streak Logic
  useEffect(() => {
    const today = new Date().toDateString()
    const lastLogin = localStorage.getItem(`last_login_${user.id}`)
    const currentStreak = Number(localStorage.getItem(`streak_${user.id}`) || 0)

    if (lastLogin !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastLogin === yesterday.toDateString()) {
        // Continued streak
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem(`streak_${user.id}`, String(newStreak))
      } else {
        // Broken streak (except if first time)
        const newStreak = lastLogin ? 1 : 1
        setStreak(newStreak)
        localStorage.setItem(`streak_${user.id}`, String(newStreak))
      }
      localStorage.setItem(`last_login_${user.id}`, today)
    } else {
      setStreak(currentStreak)
    }
  }, [user.id])

  // Offline Detection
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)
    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return

      if (e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsModalOpen(true)
      }

      if (e.key === 'Escape') {
        if (isModalOpen) handleModalClose()
        if (isSettingsOpen) setIsSettingsOpen(false)
        if (isAnalyticsOpen) setIsAnalyticsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, isSettingsOpen, isAnalyticsOpen])

  // Sync Mechanism: Auto-upload offline quests when connection returns
  const syncingIdsRef = useMemo(() => new Set<string>(), [])
  // Track IDs we just synced to prevent Realtime INSERT from creating duplicates
  const recentlySyncedIdsRef = useMemo(() => new Set<string>(), [])

  useEffect(() => {
    const syncPendingQuests = async () => {
      if (!isOnline) return

      // Find quests that are temp AND not currently syncing
      const pendingQuests = quests.filter(q =>
        q.id.startsWith("temp-") && !syncingIdsRef.has(q.id)
      )

      if (pendingQuests.length === 0) return

      toast.loading("SYNCING DATA...", { id: "sync-toast" })

      // Mark as syncing
      pendingQuests.forEach(q => syncingIdsRef.add(q.id))

      for (const quest of pendingQuests) {
        try {
          // Prepare for DB (remove temp ID)
          const { id, ...questData } = quest
          const dbQuest = {
            ...questData,
            user_id: user.id,
            deadline: typeof quest.deadline === 'string' ? quest.deadline : new Date(quest.deadline).toISOString()
          }

          const { data, error } = await supabase.from('quests').insert(dbQuest).select().single()

          if (error) throw error

          // Success: Update ID and remove from sync set
          // Track this ID so Realtime INSERT doesn't create duplicate
          recentlySyncedIdsRef.add(data.id)
          setTimeout(() => recentlySyncedIdsRef.delete(data.id), 5000) // Clean up after 5s

          setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, id: data.id } : q))
          syncingIdsRef.delete(quest.id) // Note: ID changed in state, but we delete the TEMP id from set

        } catch (e) {
          console.error("Sync failed for quest", quest.title, e)
          syncingIdsRef.delete(quest.id) // Allow retry later
        }
      }

      // Check if any temp IDs remain (e.g. failed ones), if not dismiss toast
      const remaining = quests.filter(q => q.id.startsWith("temp-"))
      if (remaining.length === 0) {
        toast.dismiss("sync-toast")
        toast.success("ALL SYSTEMS SYNCED")
      } else {
        toast.dismiss("sync-toast")
      }
    }

    syncPendingQuests()
  }, [isOnline, quests, user.id, syncingIdsRef]) // Re-run when quests change to pick up new ones

  // Load from LocalStorage on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission()
    }
  }, [])

  // Check for due quests every minute
  useEffect(() => {
    const checkDueQuests = () => {
      if (Notification.permission !== "granted") return

      const now = new Date()
      quests.forEach(quest => {
        if (quest.status !== "COMPLETED") {
          const deadline = new Date(quest.deadline)
          const diff = deadline.getTime() - now.getTime()
          // Notify if due in 15 minutes (approx 900000ms) or overdue
          if (diff > 0 && diff <= 900000 && !localStorage.getItem(`notified_${quest.id}`)) {
            new Notification("MISSION CRITICAL", {
              body: `Quest "${quest.title}" is due in ${Math.ceil(diff / 60000)} minutes!`,
              icon: "/icon.svg"
            })
            localStorage.setItem(`notified_${quest.id}`, "true")
          }
        }
      })
    }

    const interval = setInterval(checkDueQuests, 60000)
    return () => clearInterval(interval)
  }, [quests])

  // Real-time Sync & Smart Hydration
  useEffect(() => {
    // 1. Initial Hydration: Merge offline changes, don't overwrite server data
    const saved = localStorage.getItem("quests_" + user.id)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          // Identify quests created while offline (temp- IDs)
          const offlineQuests = parsed.filter((q: any) => q.id.startsWith("temp-"))

          if (offlineQuests.length > 0) {
            setQuests(prev => {
              // Merge offline quests into initialQuests (server data)
              const existingIds = new Set(prev.map(q => q.id))
              const uniqueOffline = offlineQuests.filter((q: any) => !existingIds.has(q.id))
              return [...uniqueOffline, ...prev]
            })
            toast.info(`SYNCED ${offlineQuests.length} OFFLINE ACTION(S)`)
          }
        }
      } catch (e) {
        console.error("Failed to parse local quests", e)
      }
    }

    // 2. Supabase Realtime Subscription
    const channel = supabase
      .channel('realtime-quests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Realtime change:', payload)

          if (payload.eventType === 'INSERT') {
            const newQuest = payload.new as Quest
            // Skip if we just synced this ourselves (prevents duplicate flash)
            if (recentlySyncedIdsRef.has(newQuest.id)) {
              recentlySyncedIdsRef.delete(newQuest.id) // Clean up
              return
            }
            setQuests(prev => {
              if (prev.some(q => q.id === newQuest.id)) return prev
              return [newQuest, ...prev]
            })
            toast.success("INCOMING TRANSMISSION: NEW OBJECTIVE")
          }
          else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Quest
            setQuests(prev => prev.map(q => q.id === updated.id ? updated : q))
          }
          else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id
            setQuests(prev => prev.filter(q => q.id !== deletedId))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user.id, supabase])

  // Persist to LocalStorage (throttled/debounced ideally, but direct for now)
  useEffect(() => {
    if (quests.length > 0) {
      localStorage.setItem("quests_" + user.id, JSON.stringify(quests))
    }
  }, [quests, user.id])

  const { activeQuests, archivedQuests } = useMemo(() => {
    const active = quests.filter((q) => q.status !== "COMPLETED")
    const archived = quests.filter((q) => q.status === "COMPLETED")
    return { activeQuests: active, archivedQuests: archived }
  }, [quests])

  const categorizedQuests = useMemo(() => categorizeByDate(activeQuests), [activeQuests])

  const completedCount = archivedQuests.length
  const activeCount = quests.filter((q) => q.status === "IN_PROGRESS").length
  const totalQuests = quests.length

  const handleStatusChange = async (id: string, newStatus: QuestStatus, isRecurringReset?: boolean) => {
    // Optimistic update
    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.id === id) {
          if (isRecurringReset && quest.frequency !== "SINGLE") {
            return {
              ...quest,
              status: newStatus,
              deadline: getNextDeadline(quest.deadline, quest.frequency).toISOString(),
            }
          }
          return { ...quest, status: newStatus }
        }
        return quest
      }),
    )

    // DB Update
    try {
      const quest = quests.find(q => q.id === id)
      if (!quest) return

      let updateData: any = { status: newStatus }

      if (isRecurringReset && quest.frequency !== "SINGLE") {
        updateData.deadline = getNextDeadline(quest.deadline, quest.frequency).toISOString()
      }

      const { error } = await supabase.from('quests').update(updateData).eq('id', id)
      if (error) throw error

      // Handle XP if completed
      if (newStatus === "COMPLETED") {
        const newXp = profile.xp + 1
        const newLevel = Math.floor(newXp / 3) + 1

        setProfile(prev => ({ ...prev, xp: newXp, level: newLevel }))

        await supabase.from('profiles').update({ xp: newXp, level: newLevel }).eq('id', user.id)
        toast.success("MISSION COMPLETE: XP GRANTED")
      }
    } catch (error) {
      toast.error("SYNC FAILED: RETRYING...")
      console.error(error)
      // Revert would go here
    }
  }

  const handleAddQuest = async (quest: Omit<Quest, "id" | "user_id" | "created_at" | "status">) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newQuest: Quest = {
      ...quest,
      id: tempId,
      user_id: user.id,
      status: "NOT_STARTED",
      created_at: new Date().toISOString(),
      deadline: typeof quest.deadline === 'string' ? quest.deadline : (quest.deadline as Date).toISOString()
    }

    // Pure Optimistic Save - The useEffect central sync will handle the DB insert!
    setQuests((prev) => [newQuest, ...prev])

    // Immediate feedback
    if (!navigator.onLine) {
      toast.info("OFFLINE: QUEUED FOR SYNC")
    } else {
      toast.success("OBJECTIVE ACQUIRED")
    }
  }

  const handleDeleteQuest = async (id: string) => {
    const prevQuests = [...quests]
    setQuests((prev) => prev.filter((quest) => quest.id !== id))

    try {
      const { error } = await supabase.from('quests').delete().eq('id', id)
      if (error) throw error
      toast.info("TARGET ELIMINATED")
    } catch (error) {
      setQuests(prevQuests)
      toast.error("DELETION FAILED")
    }
  }

  const handleRestoreQuest = async (id: string) => {
    setQuests((prev) =>
      prev.map((quest) => (quest.id === id ? { ...quest, status: "NOT_STARTED" as QuestStatus } : quest)),
    )

    // DB Update
    await supabase.from('quests').update({ status: "NOT_STARTED" }).eq('id', id)
  }

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest)
    setIsModalOpen(true)
  }

  const handleQuestSubmit = async (questData: Omit<Quest, "id" | "user_id" | "created_at" | "status">) => {
    if (editingQuest) {
      // Handle Update
      // Optimistic update
      setQuests(prev => prev.map(q => q.id === editingQuest.id ? { ...q, ...questData } : q))

      try {
        const { error } = await supabase
          .from('quests')
          .update({
            title: questData.title,
            notes: questData.notes,
            notion_url: questData.notion_url,
            deadline: questData.deadline,
            frequency: questData.frequency
          })
          .eq('id', editingQuest.id)

        if (error) throw error
        toast.success("PROTOCOL UPDATED")
      } catch (error) {
        // Revert on error
        setQuests(prev => prev.map(q => q.id === editingQuest.id ? editingQuest : q))
        toast.error("UPDATE FAILED")
      }

      setEditingQuest(null)
    } else {
      // Handle Create
      await handleAddQuest(questData)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingQuest(null)
  }

  const handleUpdateProfile = async (data: Partial<Profile>) => {
    // Optimistic Update
    const updatedProfile = { ...profile, ...data }
    setProfile(updatedProfile)

    try {
      const { error } = await supabase.from('profiles').update(data).eq('id', user.id)
      if (error) throw error
      toast.success("PROFILE UPDATED SUCCESSFULLY")
    } catch (error) {
      console.error(error)
      setProfile(profile) // Revert
      toast.error("UPDATE FAILED")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SyncBar isOnline={isOnline} onToggle={() => setIsOnline(!isOnline)} user={user} />

      <div
        className={`flex flex-col lg:flex-row gap-6 p-4 lg:p-6 ${isOnline ? "pt-20" : "pt-32"} transition-all duration-300`}
      >
        <ProfileStats
          completedQuests={profile.xp}
          activeQuests={activeCount}
          totalQuests={totalQuests}
          xp={profile.xp}
          level={profile.level}
          displayName={profile.display_name}
          streak={streak}
          onEditProfile={() => setIsSettingsOpen(true)}
          onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        />

        <main className="flex-1 space-y-8">
          <QuestGrid
            title="OVERDUE_MISSIONS://"
            quests={categorizedQuests.overdue}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteQuest}
            onEdit={handleEditQuest}
            variant="danger"
          />
          <QuestGrid
            title="TODAY_MISSIONS://"
            quests={categorizedQuests.today}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteQuest}
            onEdit={handleEditQuest}
            variant="urgent"
          />
          <QuestGrid
            title="TOMORROW_MISSIONS://"
            quests={categorizedQuests.tomorrow}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteQuest}
            onEdit={handleEditQuest}
          />
          <QuestGrid
            title="THIS_WEEK://"
            quests={categorizedQuests.thisWeek}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteQuest}
            onEdit={handleEditQuest}
          />
          <QuestGrid
            title="LATER_MISSIONS://"
            quests={categorizedQuests.later}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteQuest}
            onEdit={handleEditQuest}
            variant="muted"
          />

          <ArchiveSection quests={archivedQuests} onRestore={handleRestoreQuest} onDelete={handleDeleteQuest} />
        </main>
      </div>

      <NewQuestButton onClick={() => setIsModalOpen(true)} />
      <QuestModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleQuestSubmit}
        initialData={editingQuest}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSubmit={handleUpdateProfile}
        profile={profile}
        stats={{
          completed: archivedQuests.length,
          streak: streak,
          nightOwl: archivedQuests.some(q => {
            // Check if any completed quest was completed after 10 PM (22:00)
            // Since we don't have 'completed_at', we'll approximate with 'deadline' or assume false for now to avoid errors
            // For a real app, we'd enable a 'completed_at' field.
            // Let's just return false or map it to a "late deadline" for fun
            const d = new Date(q.deadline)
            return d.getHours() >= 22
          })
        }}
      />
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        quests={quests}
      />
    </div>
  )
}

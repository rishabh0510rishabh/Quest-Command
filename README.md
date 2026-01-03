# QUEST COMMAND // DEPLOYMENT_READY

![Quest Command Banner](public/bg-cyberpunk.png)

> **SYSTEM STATUS:** OPERATIONAL
>
> **PROTOCOL:** GAMIFIED TASK MANAGEMENT
>
> **VISUALS:** CYBERPUNK AESTHETIC

## // TRANSMISSION_START

Quest Command is a high-fidelity, cyberpunk-themed task management dashboard designed to gamify your productivity. Treat your daily tasks as missions, earn XP for completions, and level up your operative status. Built with modern web technologies and a focus on visual immersion.

## // CORE_FEATURES

-   **Gamified Productivity:** Earn XP and level up by completing tasks.
-   **Cyberpunk UI:** Fully immersive dark mode design with neon accents, glitch effects, and futuristic typography.
-   **PWA Ready:** Installable on mobile devices with offline support and push notifications.
-   **Real-time Sync:** Seamless synchronization across devices using Supabase Realtime.
-   **Smart Categorization:** Automatic sorting of quests into Overdue, Today, Tomorrow, and Later.
-   **Boss Fight Mode:** High-stakes visual changes for urgent tasks (due within 24h).
-   **Recurring Missions:** Support for daily, weekly, and monthly quest cycles.
-   **Mission Intel:** Link external resources (Notion, docs, etc.) directly to your quests.

## // TECH_STACK

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Backend:** [Supabase](https://supabase.com/) (Auth, Database, Realtime)
-   **PWA:** Service Workers, Web Manifest
-   **Icons:** [Lucide React](https://lucide.dev/) + Custom SVG Assets
-   **Fonts:** JetBrains Mono

## // INITIALIZATION_PROTOCOL (Installation)

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/rishabh0510rishabh/Quest-Command.git
    cd Quest-Command
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Launch Dev Terminal**
    ```bash
    npm run dev
    ```
    Access the system at `http://localhost:3000`

## // SYSTEM_ARCHITECTURE

-   **/app:** Core application routes and layouts.
-   **/components:** UI components (QuestCard, QuestGrid, etc.).
-   **/lib:** Utility functions and Supabase client configuration.
-   **/public:** Static assets (icons, manifest, service worker).

## // CONTRIBUTING

Operatives wishing to improve the system should refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## // LICENSE

This system is licensed under the [MIT License](LICENSE).

## // END_TRANSMISSION

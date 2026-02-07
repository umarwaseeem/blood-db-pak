# 🩸 Blood Donors Pakistan | بلڈ ڈونرز پاکستان

![Blood Donors Pakistan](public/main_image.png)

A mobile-first web application connecting blood donors with people in urgent need across Pakistan.

## Features

- **Donor Registration** – Register as a blood donor with your details
- **Blood Requests** – Create urgent blood requests with urgency levels (Normal/Urgent/Critical)
- **Real-time Updates** – Powered by Supabase for live data sync
- **Bilingual Support** – Full Urdu (اردو) and English support
- **WhatsApp Integration** – Contact donors/requesters directly via WhatsApp
- **Shareable Links** – Share specific donors or requests with deep linking
- **Access Code Auth** – Simple code-based authentication system

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Realtime)
- **State Management:** TanStack React Query

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key

# Run development server
npm run dev
```

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## License

MIT

---

Made with ❤️ by [Umar Waseem](https://umarwaseem.me)

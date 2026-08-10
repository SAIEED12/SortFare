import Chat from '@/components/Chat'

export const metadata = {
  title: 'Assistant — SortFare',
  description: 'Chat with the SortFare assistant about flights, fares, and travel tips.',
}

export default function ChatPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <Chat />
    </div>
  )
}
import Chat from '@/components/Chat'

export const metadata = {
  title: 'Assistant — SortFare',
  description: 'Chat with the SortFare assistant about flights, fares, and travel tips.',
}

export default function ChatPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-4 sm:py-6">
      <Chat />
    </div>
  )
}
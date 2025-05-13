export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Looking Glass</h1>
        <p className="text-xl mb-4">Welcome to Looking Glass - Real-time Video Chat</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Room
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Join Room
          </button>
        </div>
      </div>
    </main>
  )
} 
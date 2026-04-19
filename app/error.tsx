'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <button 
        onClick={() => reset()} 
        className="mt-4 p-2 bg-primary text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}
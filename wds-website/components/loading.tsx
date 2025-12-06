
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-pattern" />
      </div>

      {/* Purple glow orbs in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Main loading container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Spinning hexagon loader */}
        <div className="relative w-32 h-32">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-lg border-4 border-purple-500/30 animate-spin-slow" 
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
          
          {/* Middle ring */}
          <div className="absolute inset-4 rounded-lg border-4 border-purple-400/50 animate-spin-reverse" 
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
          
          {/* Inner glow */}
          <div className="absolute inset-8 bg-purple-500/40 rounded-full blur-xl animate-pulse" />
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-purple-400 rounded-full"
               style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)' }} />
        </div>

        {/* Loading text with glitch effect */}
        <div className="relative">
          <h2 className="text-3xl font-bold text-white font-mono tracking-wider glitch-text"
              style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}>
            LOADING
          </h2>
          
          {/* Animated dots */}
          <div className="flex justify-center gap-1 mt-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-progress"
               style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.6)' }} />
        </div>

        {/* Scanning line effect */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scan" />
      </div>

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-purple-500/50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-purple-500/50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-purple-500/50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-purple-500/50" />

     
    </div>
  );
}
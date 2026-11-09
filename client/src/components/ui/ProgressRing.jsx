export const ProgressRing = ({ percent, size = 112, stroke = 8, trackClass = "text-slate-200", barClass = "text-slate-900" }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius; // keliling lingkaran = panjang garis penuh
    const offset = circumference * (1 - percent / 100); // bagian garis yang "disembunyikan"
  
    return (
      <div className="relative" style={{ width: size, height: size }}>
        {/* -rotate-90 supaya garis progres mulai dari atas, bukan dari sisi kanan */}
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor"
            strokeWidth={stroke} className={trackClass} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor"
            strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className={`${barClass} transition-all duration-500`} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold">{percent}%</span>
      </div>
    );
  };
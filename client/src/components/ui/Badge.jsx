// client/src/components/ui/Badge.jsx
const tones = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    success: "bg-green-50 text-green-700 border-green-200",
  };
  
  export const Badge = ({ tone = "neutral", children }) => (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium border rounded ${tones[tone]}`}>{children}</span>
  );
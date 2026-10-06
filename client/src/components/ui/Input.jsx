export const Input = ({ label, error, className = "", ...props}) =>{
    <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input
      className={`px-3 py-2 text-sm border rounded outline-none focus:ring-1 focus:ring-slate-900 ${error ? "border-red-400" : "border-slate-300"} ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-600">{error}</span>}
  </div>
}
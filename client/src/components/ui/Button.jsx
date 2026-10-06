const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 border border-slate-900",
    secondary: "bg-white text-slate-900 hover:bg-slate-50 border border-slate-300",
    danger: "bg-white text-red-700 hover:bg-red-50 border border-red-300",
  };
  
  // ...props menangkap semua atribut HTML native (onClick, type, disabled, dll)
  // supaya Button bisa dipakai persis seperti <button> biasa, tinggal tambah variant.
export const Button = ({ variant = "primary", className = "", ...props }) => (
    <button
      className={`px-4 py-2 text-sm font-medium rounded transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
);
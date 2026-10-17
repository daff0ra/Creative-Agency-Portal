const initials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  
  const sizes = { sm: "h-6 w-6 text-[10px]", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" };
  
  export const Avatar = ({ name, size = "md" }) => (
    <span title={name}
      className={`inline-flex items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold ${sizes[size]}`}>
      {initials(name)}
    </span>
  );
export const Card = ({className = "", ...props}) => (
    <div className={`bg-white border border-slate-200 rounded shadow-card ${className}`} {...props} />
)
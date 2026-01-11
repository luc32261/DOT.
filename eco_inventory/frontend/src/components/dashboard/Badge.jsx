export function Badge({ children, variant = "default", icon: Icon }) {
    const variants = {
        default: "bg-white/10 text-secondary border-white/10",
        success: "bg-red-500/10 text-red-400 border-red-500/20",
        warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        danger: "bg-red-500/10 text-red-400 border-red-500/20",
        info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${variants[variant] || variants.default}`}>
            {Icon && <Icon size={12} />}
            {children}
        </span>
    );
}

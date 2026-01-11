export function Button({ children, variant = "primary", size = "md", icon: Icon, className = "", ...props }) {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] border border-red-400",
        secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
        danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
        ghost: "hover:bg-white/5 text-secondary hover:text-white",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
            {children}
        </button>
    );
}

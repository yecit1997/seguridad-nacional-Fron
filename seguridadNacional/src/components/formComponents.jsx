import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => (
    <div className={`mb-4 ${className}`}>
        {label && (
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500 ${error ? 'border-red-500' : ''}`}
            {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export const Select = ({ label, error, options = [], className = '', ...props }) => (
    <div className={`mb-4 ${className}`}>
        {label && (
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <select
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500 ${error ? 'border-red-500' : ''}`}
            {...props}
        >
            <option value="">Seleccionar...</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export const Textarea = ({ label, error, className = '', ...props }) => (
    <div className={`mb-4 ${className}`}>
        {label && (
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <textarea
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500 h-32 resize-none ${error ? 'border-red-500' : ''}`}
            {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export const Button = ({ variant = 'primary', size = 'md', loading = false, className = '', children, ...props }) => {
    const variants = {
        primary: 'bg-sky-700 hover:bg-sky-800 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    };

    const sizes = {
        sm: 'py-1 px-3 text-sm',
        md: 'py-2 px-4',
        lg: 'py-3 px-6 text-lg',
    };

    return (
        <button
            className={`${variants[variant]} ${sizes[size]} font-bold rounded-lg transition-colors focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {children}
        </button>
    );
};

export const Card = ({ title, children, className = '', actions }) => (
    <div className={`bg-white rounded-lg shadow ${className}`}>
        {(title || actions) && (
            <div className="px-6 py-4 border-b flex justify-between items-center">
                {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
        )}
        <div className="p-6">{children}</div>
    </div>
);

export const Badge = ({ variant = 'default', children }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-sky-100 text-sky-800',
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    );
};

export const Loading = ({ size = 'md', text = 'Cargando...' }) => {
    const sizes = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-200 border-t-sky-700`}></div>
            <p className="text-gray-600">{text}</p>
        </div>
    );
};

export const EmptyState = ({ icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        {icon && <div className="text-gray-400 mb-4">{icon}</div>}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-gray-500 mb-4">{description}</p>}
        {action}
    </div>
);

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', isLoading, className, ...props }) => {
    const baseStyles = 'w-full flex justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

    const variants = {
        primary: 'text-white bg-brand-600 hover:bg-brand-700 hover:shadow-md focus:ring-brand-500 shadow-brand-500/30',
        secondary: 'text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 focus:ring-brand-500',
        danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-red-500/30',
        ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 shadow-none',
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant]), className)}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-current'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                >
                    <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                    ></circle>
                    <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;

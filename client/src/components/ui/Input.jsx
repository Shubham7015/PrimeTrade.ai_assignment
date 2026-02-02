import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
    return (
        <div className='mb-5'>
            {label && (
                <label className='block text-sm font-semibold text-gray-700 mb-1.5 ml-1'>
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={twMerge(
                    clsx(
                        'w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 outline-none text-gray-900 bg-white placeholder-gray-500',
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500/20'
                    ),
                    className
                )}
                {...props}
            />
            {error && <p className='mt-1.5 text-sm text-red-600 font-medium ml-1 animate-slide-up'>{error.message}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ label, id, name, className = '', children, ...props }: SelectProps) {
  const selectId = id ?? name;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
      <select
        id={selectId}
        name={name}
        className={`rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

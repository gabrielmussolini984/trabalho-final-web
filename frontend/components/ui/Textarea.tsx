import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, id, name, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? name;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={textareaId} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
      <textarea
        id={textareaId}
        name={name}
        className={`min-h-20 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 ${className}`}
        {...props}
      />
    </div>
  );
}

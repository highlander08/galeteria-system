export default function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`
        w-full px-4 py-2.5 text-base text-gray-900
        placeholder:text-gray-400
        bg-white border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
        transition-all duration-200
        ${className}
      `}
      {...props}
    />
  );
}
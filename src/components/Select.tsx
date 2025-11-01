export default function Select({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`
        w-full px-4 py-2.5 text-base text-gray-900 bg-white
        border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
        transition-all duration-200 cursor-pointer
        ${className}
      `}
      {...props}
    />
  );
}
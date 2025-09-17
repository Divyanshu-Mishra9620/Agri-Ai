
export default function LoadingSpinner({ label }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
      {label ? <span className="text-gray-600">{label}</span> : null}
    </div>
  );
}

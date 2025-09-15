export default function Input({ className = '', ...props }) {
  return <input {...props} className={`form-input w-full p-3 rounded-lg ${className}`} />;
}

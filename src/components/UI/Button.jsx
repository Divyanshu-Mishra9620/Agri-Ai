
export default function Button({ className = '', ...props }) {
  return <button {...props} className={`btn-primary rounded-lg px-4 py-2 ${className}`} />;
}

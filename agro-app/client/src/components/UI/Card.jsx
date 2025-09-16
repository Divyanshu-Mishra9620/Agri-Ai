export default function Card({ className = '', ...props }) {
  return <div {...props} className={`card p-6 rounded-2xl shadow-lg ${className}`} />;
}

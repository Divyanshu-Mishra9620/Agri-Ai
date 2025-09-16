import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20 animate-fadeIn">
      <div className="text-6xl mb-4">🤔</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary px-6 py-3 rounded-lg text-white font-medium">🏠 Go Home</Link>
    </div>
  );
}
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
        <h1 className="mt-4 text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-xl text-gray-600">Page not found</p>
        <p className="mt-4 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

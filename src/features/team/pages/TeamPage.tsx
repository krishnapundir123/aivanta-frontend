import { Users } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-primary-600" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Team</h2>
      <p className="text-gray-500 max-w-sm">
        Manage agents, roles, and team assignments for your support organization. Coming soon.
      </p>
    </div>
  );
}

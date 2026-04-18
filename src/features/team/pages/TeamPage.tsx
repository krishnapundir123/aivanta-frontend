import { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Ticket,
  Circle,
  Clock,
  Award,
} from 'lucide-react';
import { format } from 'date-fns';
import { useDummyData } from '../../../shared/mocks/useDummyData';
import Badge from '../../../shared/components/ui/Badge';
import Avatar from '../../../shared/components/ui/Avatar';

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  ONLINE: 'success',
  AWAY: 'warning',
  OFFLINE: 'default',
};

export default function TeamPage() {
  const dummy = useDummyData();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const teamMembers = dummy.enabled ? dummy.teamMembers : [];
  const teamStats = dummy.enabled ? dummy.teamStats : null;

  const roles = Array.from(new Set(teamMembers.map((m) => m.role)));

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      !searchQuery ||
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = !roleFilter || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500">Manage agents and view team performance</p>
        </div>
      </div>

      {/* Stats */}
      {teamStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Total Agents</p>
                <p className="text-xl font-bold text-gray-900">
                  {teamStats.totalAgents}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Circle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Online</p>
                <p className="text-xl font-bold text-gray-900">
                  {teamStats.onlineAgents}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Away</p>
                <p className="text-xl font-bold text-gray-900">
                  {teamStats.awayAgents}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Ticket className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Open Tickets</p>
                <p className="text-xl font-bold text-gray-900">
                  {teamStats.totalOpenTickets}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No team members found</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar
                    name={`${member.firstName} ${member.lastName}`}
                    size="lg"
                  />
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <Badge variant={statusColors[member.status] || 'default'} size="sm">
                  {member.status}
                </Badge>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <Badge variant="info" size="sm">
                  {member.role}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-gray-900">
                    {member.openTickets}
                  </p>
                  <p className="text-xs text-gray-500">Open Tickets</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-gray-900">
                    {member.resolvedThisWeek}
                  </p>
                  <p className="text-xs text-gray-500">Resolved This Week</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-50 text-purple-700"
                    >
                      <Award className="w-3 h-3 mr-1" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Joined {format(new Date(member.joinedAt), 'MMM yyyy')}</span>
                <button className="flex items-center text-primary-600 hover:text-primary-700">
                  <Mail className="w-3 h-3 mr-1" />
                  Contact
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

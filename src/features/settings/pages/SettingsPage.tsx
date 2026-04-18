import { useState } from 'react';
import {
  Settings,
  Bell,
  Clock,
  Brain,
  Plug,
  Save,
  Globe,
  Image,
} from 'lucide-react';
import { useDummyData } from '../../../shared/mocks/useDummyData';
import Button from '../../../shared/components/ui/Button';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const dummy = useDummyData();
  const settings = dummy.enabled ? dummy.settings : null;

  const [workspace, setWorkspace] = useState(
    settings?.workspace || {
      name: '',
      domain: '',
      timezone: 'UTC',
      language: 'en',
      logoUrl: '',
    }
  );

  const [notifications, setNotifications] = useState(
    settings?.notifications || {
      emailOnNewTicket: true,
      emailOnSlaBreach: true,
      emailOnAssignment: true,
      slackWebhookUrl: '',
      slackOnCritical: false,
    }
  );

  const [sla, setSla] = useState(
    settings?.sla || {
      criticalResponseHours: 1,
      highResponseHours: 4,
      mediumResponseHours: 24,
      lowResponseHours: 72,
      businessHoursOnly: false,
    }
  );

  const [ai, setAi] = useState(
    settings?.ai || {
      autoCategorizationEnabled: true,
      autoRoutingEnabled: true,
      suggestedResponsesEnabled: true,
      copilotEnabled: true,
      confidenceThreshold: 0.75,
    }
  );

  const [integrations] = useState(settings?.integrations || []);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">
          Configure your workspace, notifications, and AI preferences
        </p>
      </div>

      {/* Workspace Settings */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
          <Settings className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">Workspace</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspace.name}
                onChange={(e) =>
                  setWorkspace({ ...workspace, name: e.target.value })
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <input
                type="text"
                value={workspace.domain}
                onChange={(e) =>
                  setWorkspace({ ...workspace, domain: e.target.value })
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <select
                  value={workspace.timezone}
                  onChange={(e) =>
                    setWorkspace({ ...workspace, timezone: e.target.value })
                  }
                  className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="UTC">UTC</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={workspace.language}
                onChange={(e) =>
                  setWorkspace({ ...workspace, language: e.target.value })
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={workspace.logoUrl || ''}
                onChange={(e) =>
                  setWorkspace({ ...workspace, logoUrl: e.target.value })
                }
                placeholder="https://example.com/logo.png"
                className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SLA Settings */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
          <Clock className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">SLA Configuration</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Critical Response (hours)
              </label>
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={sla.criticalResponseHours}
                onChange={(e) =>
                  setSla({
                    ...sla,
                    criticalResponseHours: parseFloat(e.target.value),
                  })
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                High Response (hours)
              </label>
              <input
                type="number"
                min={1}
                value={sla.highResponseHours}
                onChange={(e) =>
                  setSla({
                    ...sla,
                    highResponseHours: parseFloat(e.target.value),
                  })
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medium Response (hours)
              </label>
              <input
                type="number"
                min={1}
                value={sla.mediumResponseHours}
                onChange={(e) =>
                  setSla({
                    ...sla,
                    mediumResponseHours: parseFloat(e.target.value),
                  })
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Low Response (hours)
              </label>
              <input
                type="number"
                min={1}
                value={sla.lowResponseHours}
                onChange={(e) =>
                  setSla({
                    ...sla,
                    lowResponseHours: parseFloat(e.target.value),
                  })
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              id="business-hours"
              type="checkbox"
              checked={sla.businessHoursOnly}
              onChange={(e) =>
                setSla({ ...sla, businessHoursOnly: e.target.checked })
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="business-hours"
              className="ml-2 block text-sm text-gray-900"
            >
              Calculate SLA based on business hours only
            </label>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
          <Brain className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">AI Configuration</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {[
              {
                key: 'autoCategorizationEnabled',
                label: 'Auto-Categorization',
                desc: 'Automatically categorize incoming tickets',
              },
              {
                key: 'autoRoutingEnabled',
                label: 'Smart Routing',
                desc: 'AI-suggested agent assignments',
              },
              {
                key: 'suggestedResponsesEnabled',
                label: 'Suggested Responses',
                desc: 'AI-generated response suggestions',
              },
              {
                key: 'copilotEnabled',
                label: 'Copilot',
                desc: 'Enable AI Copilot assistant',
              },
            ].map((item) => (
              <div key={item.key} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={item.key}
                    type="checkbox"
                    checked={
                      ai[item.key as keyof typeof ai] as boolean
                    }
                    onChange={(e) =>
                      setAi({ ...ai, [item.key]: e.target.checked })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor={item.key}
                    className="font-medium text-gray-700"
                  >
                    {item.label}
                  </label>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confidence Threshold: {Math.round(ai.confidenceThreshold * 100)}%
            </label>
            <input
              type="range"
              min={0.5}
              max={0.95}
              step={0.05}
              value={ai.confidenceThreshold}
              onChange={(e) =>
                setAi({
                  ...ai,
                  confidenceThreshold: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum confidence level for AI actions to be applied automatically
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
          <Bell className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            {
              key: 'emailOnNewTicket',
              label: 'New Ticket Email',
              desc: 'Receive an email when a new ticket is created',
            },
            {
              key: 'emailOnSlaBreach',
              label: 'SLA Breach Alert',
              desc: 'Get notified when a ticket breaches SLA',
            },
            {
              key: 'emailOnAssignment',
              label: 'Assignment Notification',
              desc: 'Email when a ticket is assigned to you',
            },
          ].map((item) => (
            <div key={item.key} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={item.key}
                  type="checkbox"
                  checked={
                    notifications[item.key as keyof typeof notifications] as boolean
                  }
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor={item.key}
                  className="font-medium text-gray-700"
                >
                  {item.label}
                </label>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slack Webhook URL
            </label>
            <input
              type="text"
              value={notifications.slackWebhookUrl}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  slackWebhookUrl: e.target.value,
                })
              }
              placeholder="https://hooks.slack.com/services/..."
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="slackOnCritical"
                type="checkbox"
                checked={notifications.slackOnCritical}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    slackOnCritical: e.target.checked,
                  })
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="slackOnCritical"
                className="font-medium text-gray-700"
              >
                Slack Critical Alerts
              </label>
              <p className="text-gray-500">
                Send Slack notifications for critical priority tickets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
          <Plug className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">Integrations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plug className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {integration.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {integration.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  integration.connected
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                {integration.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}

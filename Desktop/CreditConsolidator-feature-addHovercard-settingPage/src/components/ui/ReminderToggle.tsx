import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

interface ReminderToggleProps {
  type: 'email' | 'sms' | 'push';
  initialState: boolean;
  onChange: (type: 'email' | 'sms' | 'push', enabled: boolean) => void;
}

const ReminderToggle: React.FC<ReminderToggleProps> = ({ type, initialState, onChange }) => {
  const [enabled, setEnabled] = useState(initialState);
  
  const toggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onChange(type, newState);
  };
  
  const getLabel = () => {
    switch (type) {
      case 'email':
        return 'Email Reminders';
      case 'sms':
        return 'SMS Alerts';
      case 'push':
        return 'Push Notifications';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center">
        <div className={`p-2 rounded-full mr-3 ${enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {enabled ? (
            <Bell className={`h-5 w-5 ${enabled ? 'text-blue-600' : 'text-gray-400'}`} />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-800">{getLabel()}</p>
          <p className="text-sm text-gray-500">
            {enabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>
      </div>
      <button
        onClick={toggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
          enabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></div>
      </button>
    </div>
  );
};

export default ReminderToggle;
import React from 'react';
import { ContactManager } from '../components/sos/ContactManager';
import { EmergencyServicesInfo } from '../components/sos/EmergencyServicesInfo';
import { EmergencyContact } from '../types/sos';

interface ContactsPageProps {
  contacts: EmergencyContact[];
  onSaveContacts: (contacts: EmergencyContact[]) => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ contacts, onSaveContacts }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Emergency Contacts Directory</h1>
        <p className="text-sm text-slate-400">
          Manage your personal emergency contacts and review official 112 response channels.
        </p>
      </div>

      <ContactManager contacts={contacts} onSaveContacts={onSaveContacts} />
      <EmergencyServicesInfo />
    </div>
  );
};

import React, { useState } from 'react';
import { SosButton } from '../components/sos/SosButton';
import { SosModal } from '../components/sos/SosModal';
import { ContactManager } from '../components/sos/ContactManager';
import { EmergencyServicesInfo } from '../components/sos/EmergencyServicesInfo';
import { EmergencyContact } from '../types/sos';
import { LocationCoordinates } from '../types/location';
import { ShieldAlert } from 'lucide-react';

interface SosPageProps {
  contacts: EmergencyContact[];
  onSaveContacts: (contacts: EmergencyContact[]) => void;
  userLocation?: LocationCoordinates;
  destinationName?: string;
}

export const SosPage: React.FC<SosPageProps> = ({
  contacts,
  onSaveContacts,
  userLocation,
  destinationName,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="glass-panel rounded-3xl p-8 border border-red-500/30 bg-gradient-to-r from-slate-900 via-red-950/20 to-slate-900 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Emergency Response Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Emergency SOS Dispatch</h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          1-tap location alert generation for family emergency contacts & official 112 dispatches.
        </p>

        <div className="pt-4">
          <SosButton onClick={() => setModalOpen(true)} size="large" />
        </div>
      </div>

      {/* Emergency Contacts Management */}
      <ContactManager contacts={contacts} onSaveContacts={onSaveContacts} />

      {/* Official Hotlines Grid */}
      <EmergencyServicesInfo />

      {/* Confirmation Modal */}
      <SosModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contacts={contacts}
        userLocation={userLocation}
        destinationName={destinationName}
      />
    </div>
  );
};

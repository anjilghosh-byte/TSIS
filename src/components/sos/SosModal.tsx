import React, { useState } from 'react';
import { EmergencyContact } from '../../types/sos';
import { LocationCoordinates } from '../../types/location';
import {
  formatSosEmergencyMessage,
  generateSmsDeepLink,
  generateTelDeepLink,
} from '../../services/emergencyService';
import { AlertTriangle, MapPin, Send, PhoneCall, Copy, Check, X, ShieldCheck } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  userLocation?: LocationCoordinates;
  destinationName?: string;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  contacts,
  userLocation,
  destinationName,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(
    contacts.find((c) => c.isPrimary) || contacts[0] || null
  );

  if (!isOpen) return null;

  const { messageText, mapsUrl } = formatSosEmergencyMessage(
    contacts,
    userLocation?.lat,
    userLocation?.lng,
    destinationName
  );

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const primaryContact = selectedContact || contacts[0];
  const smsLink = primaryContact ? generateSmsDeepLink(primaryContact.phone, messageText) : '#';
  const telLink = primaryContact ? generateTelDeepLink(primaryContact.phone) : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 border-2 border-red-500/50 shadow-2xl space-y-6 relative bg-slate-900/95 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 border border-red-500/30 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Emergency SOS Confirmation</h3>
            <p className="text-xs text-red-300">
              Confirm sending location alert to emergency contacts & authorities.
            </p>
          </div>
        </div>

        {/* User Location Acquirement Status */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-sky-400">
              <MapPin className="w-4 h-4" />
              <span>Current GPS Location</span>
            </span>
            {userLocation ? (
              <span className="text-emerald-400 font-mono">Permission Granted</span>
            ) : (
              <span className="text-amber-400 font-mono">Location Pending</span>
            )}
          </div>

          {userLocation ? (
            <div className="text-xs font-mono text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 break-all">
              Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
              {mapsUrl && (
                <div className="mt-1">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 underline hover:text-sky-300 font-sans font-semibold"
                  >
                    Open Google Maps Link &rarr;
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              Allow location access in your browser to attach live Google Maps link to your emergency message.
            </div>
          )}
        </div>

        {/* Select Emergency Contact */}
        {contacts.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Select Emergency Recipient:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedContact(c)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedContact?.id === c.id
                      ? 'bg-sky-500/20 border-sky-500/50 text-white font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{c.name} ({c.relationship})</div>
                    <div className="font-mono text-slate-400">{c.phone}</div>
                  </div>
                  {c.isPrimary && (
                    <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-bold">
                      Primary
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pre-filled Message Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Prepared Emergency Message:</span>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-normal"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Message'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={messageText}
            rows={4}
            className="w-full bg-slate-950 text-slate-300 text-xs font-mono p-3 rounded-xl border border-slate-800 focus:outline-none resize-none"
          />
        </div>

        {/* Status compliance note */}
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            <strong>Status:</strong> SOS message prepared. Click below to launch your phone messaging/dialer app.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href={smsLink}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Send SOS Message</span>
          </a>

          <a
            href={telLink}
            className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Contact ({primaryContact?.phone || 'Selected'})</span>
          </a>
        </div>
      </div>
    </div>
  );
};

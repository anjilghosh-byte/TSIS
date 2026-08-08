import React, { useState } from 'react';
import { EmergencyContact } from '../../types/sos';
import { Users, Plus, Trash2, Edit3, Shield, Check, Phone, AlertCircle } from 'lucide-react';

interface ContactManagerProps {
  contacts: EmergencyContact[];
  onSaveContacts: (contacts: EmergencyContact[]) => void;
}

export const ContactManager: React.FC<ContactManagerProps> = ({
  contacts,
  onSaveContacts,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<EmergencyContact['relationship']>('Father');
  const [phone, setPhone] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setRelationship('Father');
    setPhone('');
    setIsPrimary(false);
    setError(null);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleOpenEdit = (contact: EmergencyContact) => {
    setName(contact.name);
    setRelationship(contact.relationship);
    setPhone(contact.phone);
    setIsPrimary(contact.isPrimary || false);
    setEditingId(contact.id);
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter contact name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Please enter a valid phone number with country code (e.g. +919876543210).');
      return;
    }

    let updatedContacts = [...contacts];

    if (editingId) {
      updatedContacts = updatedContacts.map((c) =>
        c.id === editingId ? { ...c, name: name.trim(), relationship, phone: phone.trim(), isPrimary } : c
      );
    } else {
      const newContact: EmergencyContact = {
        id: `contact-${Date.now()}`,
        name: name.trim(),
        relationship,
        phone: phone.trim(),
        isPrimary,
      };
      updatedContacts.push(newContact);
    }

    // Ensure only one primary contact exists if set
    if (isPrimary) {
      const targetId = editingId || updatedContacts[updatedContacts.length - 1].id;
      updatedContacts = updatedContacts.map((c) => ({
        ...c,
        isPrimary: c.id === targetId,
      }));
    }

    onSaveContacts(updatedContacts);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (contacts.length <= 1) {
      alert('At least one emergency contact is recommended for SOS functionality.');
    }
    const updated = contacts.filter((c) => c.id !== id);
    onSaveContacts(updated);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" />
            <h3 className="text-xl font-bold text-white">Emergency Contacts</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Store family & trusted numbers on your device. Never shared or made public.
          </p>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Emergency Contact</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-white text-sm">
            {editingId ? 'Edit Emergency Contact' : 'Add New Emergency Contact'}
          </h4>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Relationship</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as any)}
                className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (With Country Code)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +919876543210"
                className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrimaryCheck"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="rounded border-slate-800 text-sky-500 focus:ring-sky-500 bg-slate-950"
            />
            <label htmlFor="isPrimaryCheck" className="text-xs text-slate-300 cursor-pointer">
              Set as Primary Emergency Recipient
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-500 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Contact</span>
            </button>
          </div>
        </form>
      )}

      {/* Contacts List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between group hover:border-sky-500/30 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{contact.name}</span>
                {contact.isPrimary && (
                  <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">
                    Primary
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="font-medium text-slate-300">{contact.relationship}</span>
                <span>&bull;</span>
                <span className="font-mono text-sky-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {contact.phone}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleOpenEdit(contact)}
                className="p-2 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800"
                title="Edit Contact"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(contact.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                title="Delete Contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  User, MapPin, Calendar, Clock, BookOpen, LogOut,
  Trash2, PlusCircle, CheckCircle, Globe, Star, ChevronRight
} from 'lucide-react';
import { UserProfile, updateProfile } from '../services/authService';
import { getTravelHistory, addVisitedPlace, deleteVisitedPlace, TravelHistoryRecord } from '../services/travelHistoryService';
import { getSavedItineraries, deleteSavedItinerary, SavedItineraryRecord } from '../services/savedItineraryService';
import { DestinationInfo } from '../types/location';

interface UserProfilePageProps {
  user: UserProfile;
  onLogout: () => void;
  onSelectDestination: (dest: DestinationInfo) => void;
  onPlanTrip: (dest: DestinationInfo) => void;
}

// ---- Mark Visited Modal ----
const MarkVisitedModal: React.FC<{
  onClose: () => void;
  onSave: (data: { destinationName: string; country: string; startDate: string; endDate: string }) => void;
}> = ({ onClose, onSave }) => {
  const [destName, setDestName] = useState('');
  const [country, setCountry] = useState('India');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName.trim() || !startDate || !endDate) {
      setError('Please fill all fields.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date.');
      return;
    }
    onSave({ destinationName: destName.trim(), country, startDate, endDate });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          Mark as Visited
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Destination Name</label>
            <input
              type="text"
              value={destName}
              onChange={(e) => setDestName(e.target.value)}
              placeholder="e.g. Darjeeling"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-600 text-slate-400 hover:border-slate-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
            >
              Save Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---- Main Profile Page ----
export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  onLogout,
  onSelectDestination,
  onPlanTrip,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'saved' | 'settings'>('history');
  const [history, setHistory] = useState<TravelHistoryRecord[]>([]);
  const [savedPlans, setSavedPlans] = useState<SavedItineraryRecord[]>([]);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState('');

  const refreshData = () => {
    try {
      setHistory(getTravelHistory(user.id));
    } catch {
      setHistory([]);
    }
    try {
      setSavedPlans(getSavedItineraries(user.id));
    } catch {
      setSavedPlans([]);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user.id]);

  const handleMarkVisited = async (data: {
    destinationName: string;
    country: string;
    startDate: string;
    endDate: string;
  }) => {
    const days =
      Math.ceil(
        (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    try {
      addVisitedPlace(user.id, {
        destinationId: `manual-${Date.now()}`,
        destinationName: data.destinationName,
        country: data.country,
        latitude: 0,
        longitude: 0,
        startDate: data.startDate,
        endDate: data.endDate,
        days,
      });
      refreshData();
      setShowMarkModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteHistory = (id: string) => {
    try {
      deleteVisitedPlace(user.id, id);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeletePlan = (id: string) => {
    try {
      deleteSavedItinerary(user.id, id);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveProfile = () => {
    setIsSavingProfile(true);
    try {
      updateProfile(user.id, editName, user.preferences);
      setSettingsMsg('Profile updated successfully!');
    } catch (err: any) {
      setSettingsMsg(err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const totalDays = history.reduce((sum, h) => sum + h.days, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {showMarkModal && (
        <MarkVisitedModal
          onClose={() => setShowMarkModal(false)}
          onSave={handleMarkVisited}
        />
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 pt-16 pb-10">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #38bdf8 0%, transparent 70%)' }}
        />
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-xl border-4 border-slate-800 text-4xl font-bold text-white select-none">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-sky-300 mt-1">{user.email}</p>
            <p className="text-slate-400 text-sm mt-1">Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="sm:ml-auto flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{history.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Trips</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{totalDays}</p>
              <p className="text-xs text-slate-400 mt-0.5">Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{savedPlans.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Saved Plans</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          {(['history', 'saved', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize transition border-b-2 ${
                activeTab === tab
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'history' ? '🗺️ Travel History' : tab === 'saved' ? '💾 Saved Plans' : '⚙️ Settings'}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="ml-auto flex items-center gap-1.5 px-4 py-3 text-sm text-red-400 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* --- Travel History Tab --- */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-sky-400" /> My Travel History
              </h2>
              <button
                onClick={() => setShowMarkModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition"
              >
                <PlusCircle className="w-4 h-4" /> Mark as Visited
              </button>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No trips recorded yet.</p>
                <p className="text-slate-600 text-sm mt-1">Click "Mark as Visited" to add a trip you've completed.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{rec.destinationName}</p>
                      <p className="text-slate-400 text-sm">{rec.country}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(rec.startDate).toLocaleDateString('en-IN')} – {new Date(rec.endDate).toLocaleDateString('en-IN')}
                        </span>
                        <span className="text-xs text-sky-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {rec.days} day{rec.days !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteHistory(rec.id)}
                      title="Remove from history"
                      className="p-2 text-slate-600 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Saved Plans Tab --- */}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Saved Itineraries
            </h2>

            {savedPlans.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No saved itineraries yet.</p>
                <p className="text-slate-600 text-sm mt-1">Generate a trip plan and save it to see it here.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {savedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-600 transition group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg">{plan.destinationName}</h3>
                        <p className="text-slate-500 text-sm">
                          {plan.days} days · Saved {new Date(plan.savedAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const dest: DestinationInfo = {
                              id: plan.destinationId,
                              name: plan.destinationName,
                              country: plan.country || 'India',
                              coordinates: plan.coordinates ?? { lat: 22.5726, lng: 88.3639 },
                              popularActivities: [],
                            };
                            onPlanTrip(dest);
                          }}
                          className="p-2 text-indigo-400 hover:text-indigo-300 transition"
                          title="Re-open planner"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-2 text-slate-600 hover:text-red-400 transition"
                          title="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(plan.highlights || []).slice(0, 4).map((h, i) => (
                        <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Settings Tab --- */}
        {activeTab === 'settings' && (
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-slate-400" /> Account Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
                />
              </div>

              {settingsMsg && (
                <p className={`text-sm ${settingsMsg.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {settingsMsg}
                </p>
              )}

              <button
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold transition disabled:opacity-50"
              >
                {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </button>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 border border-red-800 text-red-400 hover:bg-red-900/30 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;

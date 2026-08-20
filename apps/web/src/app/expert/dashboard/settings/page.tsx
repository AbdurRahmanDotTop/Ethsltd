"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ExpertSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: "",
    experienceYears: 0,
    languages: [] as string[],
    categories: [] as string[],
    availabilityStatus: "OFFLINE"
  });

  // For managing arrays in UI
  const [newLanguage, setNewLanguage] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.expertGetMe();
        if (res.success && res.data) {
          setFormData({
            bio: res.data.bio || "",
            experienceYears: res.data.experienceYears || 0,
            languages: res.data.languages || [],
            categories: res.data.categories || [],
            availabilityStatus: res.data.availabilityStatus || "OFFLINE"
          });
        }
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await apiClient.expertUpdateMe(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({ ...prev, languages: [...prev.languages, newLanguage.trim()] }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({ ...prev, categories: [...prev.categories, newCategory.trim()] }));
      setNewCategory("");
    }
  };

  const removeCategory = (cat: string) => {
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }));
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Expert Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your public profile and availability.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm text-green-600 font-medium">Profile updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
        
        {/* Availability */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground">Availability Status</label>
          <select 
            value={formData.availabilityStatus}
            onChange={e => setFormData({ ...formData, availabilityStatus: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="AVAILABLE">Available (Accepting new bookings)</option>
            <option value="BUSY">Busy (Currently booked)</option>
            <option value="OFFLINE">Offline (Not accepting bookings)</option>
          </select>
          <p className="text-xs text-muted-foreground">Controls whether users can see you as available for bookings.</p>
        </div>

        {/* Bio */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground">Bio / About Me</label>
          <textarea 
            rows={5}
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell potential clients about your expertise and background..."
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
            required
          />
        </div>

        {/* Experience */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground">Years of Experience</label>
          <input 
            type="number" 
            min="0"
            max="50"
            value={formData.experienceYears}
            onChange={e => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categories */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-foreground">Expertise Categories</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                placeholder="e.g. Day Trading, DeFi..."
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <button 
                type="button" 
                onClick={addCategory}
                className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 font-medium rounded-lg text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map(cat => (
                <span key={cat} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-md text-xs font-semibold uppercase border border-primary/20">
                  {cat}
                  <button type="button" onClick={() => removeCategory(cat)} className="text-primary hover:text-red-500 ml-1">
                    &times;
                  </button>
                </span>
              ))}
              {formData.categories.length === 0 && (
                <span className="text-sm text-muted-foreground italic">No categories added.</span>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-foreground">Languages</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newLanguage}
                onChange={e => setNewLanguage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                placeholder="e.g. English, Spanish..."
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <button 
                type="button" 
                onClick={addLanguage}
                className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 font-medium rounded-lg text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map(lang => (
                <span key={lang} className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-3 py-1.5 rounded-md text-sm font-medium border border-border">
                  {lang}
                  <button type="button" onClick={() => removeLanguage(lang)} className="hover:text-red-500 ml-1">
                    &times;
                  </button>
                </span>
              ))}
              {formData.languages.length === 0 && (
                <span className="text-sm text-muted-foreground italic">No languages added.</span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-primary-foreground hover:bg-brand-primary/90 font-medium rounded-lg shadow-sm transition-all hover:shadow-md disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

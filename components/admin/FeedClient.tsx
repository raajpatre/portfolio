"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FeedEntry = {
  id: string;
  content: string;
  category: 'win' | 'launch' | 'event' | 'contribution';
  entry_date: string;
  link_url: string | null;
};

export default function FeedClient({ initialFeed }: { initialFeed: FeedEntry[] }) {
  const [feed, setFeed] = useState<FeedEntry[]>(initialFeed);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FeedEntry | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    content: "", category: "win", entry_date: "", link_url: ""
  });

  const openModal = (entry?: FeedEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        content: entry.content,
        category: entry.category,
        entry_date: entry.entry_date,
        link_url: entry.link_url || ""
      });
    } else {
      setEditingEntry(null);
      setFormData({ content: "", category: "win", entry_date: "", link_url: "" });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      link_url: formData.link_url || null,
    };

    try {
      const url = editingEntry ? `/api/admin/feed/${editingEntry.id}` : "/api/admin/feed";
      const method = editingEntry ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save feed entry");

      if (editingEntry) {
        setFeed(feed.map(f => f.id === editingEntry.id ? data : f));
      } else {
        setFeed([data, ...feed].sort((a,b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()));
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feed entry? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/admin/feed/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete feed entry");
      setFeed(feed.filter(f => f.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const categoryColors: Record<string, string> = {
    win: "bg-accent-gold/20 text-accent-gold",
    launch: "bg-accent-teal/20 text-accent-teal",
    event: "bg-accent-violet/20 text-accent-violet",
    contribution: "bg-text-primary/20 text-text-primary"
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feed</h1>
          <p className="text-text-primary/70 mt-1">Manage timeline updates and events</p>
        </div>
        <Button onClick={() => openModal()} className="bg-accent-violet text-bg-base hover:bg-accent-violet/90">
          <Plus className="mr-2 h-4 w-4" /> New Entry
        </Button>
      </div>

      <div className="rounded-xl border border-border-pixel bg-bg-base overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-border-pixel/30 border-b border-border-pixel text-text-primary/70">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Content</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-pixel">
            {feed.map(entry => (
              <tr key={entry.id} className="hover:bg-border-pixel/10 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-text-primary/60">{entry.entry_date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${categoryColors[entry.category]}`}>
                    {entry.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="line-clamp-2 max-w-lg">{entry.content}</div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {entry.link_url && (
                    <a href={entry.link_url} target="_blank" className="inline-block p-2 text-text-primary/60 hover:text-accent-violet">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Button onClick={() => openModal(entry)} className="h-8 px-2 bg-transparent hover:bg-border-pixel/50">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(entry.id)} className="h-8 px-2 text-accent-red bg-transparent hover:bg-accent-red/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {feed.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-text-primary/50">No feed entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-bg-base border border-border-pixel rounded-xl w-full max-w-xl shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-border-pixel">
              <h2 className="text-xl font-bold">{editingEntry ? "Edit Feed Entry" : "New Feed Entry"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-primary/50 hover:text-text-primary">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-accent-red/10 text-accent-red border border-accent-red/20 rounded-md text-sm">{error}</div>}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <textarea 
                  required 
                  maxLength={1000}
                  className="flex min-h-[100px] w-full rounded-md border border-border-pixel bg-bg-base px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet disabled:cursor-not-allowed disabled:opacity-50 text-text-primary"
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                />
                <div className="text-xs text-text-primary/50 text-right">{formData.content.length}/1000</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-border-pixel bg-bg-base px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet text-text-primary"
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option value="win">Win 🏆</option>
                    <option value="launch">Launch 🚀</option>
                    <option value="event">Event 📅</option>
                    <option value="contribution">Contribution 💻</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entry Date</label>
                  <Input required type="date" value={formData.entry_date} onChange={e => setFormData({...formData, entry_date: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Link URL (optional)</label>
                <Input type="url" value={formData.link_url} onChange={e => setFormData({...formData, link_url: e.target.value})} />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border-pixel mt-6">
                <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-transparent border border-border-pixel hover:bg-border-pixel/30">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-accent-violet text-bg-base hover:bg-accent-violet/90">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingEntry ? "Save Changes" : "Add Entry"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

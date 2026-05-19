"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, Star, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImage } from "@/lib/cloudinary-upload";

type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  live_url: string | null;
  repo_url: string | null;
  screenshots: string[];
  status: 'shipped' | 'in_progress';
  featured: boolean;
  created_at: string;
};

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "", tagline: "", description: "", stack: "", live_url: "", repo_url: "",
    status: "shipped", featured: false, screenshots: [] as string[]
  });

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        tagline: project.tagline,
        description: project.description,
        stack: project.stack.join(", "),
        live_url: project.live_url || "",
        repo_url: project.repo_url || "",
        status: project.status,
        featured: project.featured,
        screenshots: project.screenshots
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "", tagline: "", description: "", stack: "", live_url: "", repo_url: "",
        status: "shipped", featured: false, screenshots: []
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    setError(null);
    try {
      const file = e.target.files[0];
      const url = await uploadImage(file, "raaj-portfolio/projects");
      setFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, url] }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newScreenshots = [...prev.screenshots];
      newScreenshots.splice(index, 1);
      return { ...prev, screenshots: newScreenshots };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      stack: formData.stack.split(",").map(s => s.trim()).filter(Boolean),
      live_url: formData.live_url || null,
      repo_url: formData.repo_url || null,
    };

    try {
      const url = editingProject ? `/api/admin/projects/${editingProject.id}` : "/api/admin/projects";
      const method = editingProject ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project");

      if (editingProject) {
        setProjects(projects.map(p => p.id === editingProject.id ? data : p));
      } else {
        setProjects([data, ...projects]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-text-primary/70 mt-1">Manage your portfolio projects</p>
        </div>
        <Button onClick={() => openModal()} className="bg-accent-teal text-bg-base hover:bg-accent-teal/90">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="rounded-xl border border-border-pixel bg-bg-base overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-border-pixel/30 border-b border-border-pixel text-text-primary/70">
            <tr>
              <th className="px-6 py-4 font-semibold">Project</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Links</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-pixel">
            {projects.map(project => (
              <tr key={project.id} className="hover:bg-border-pixel/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-base flex items-center gap-2">
                    {project.title}
                    {project.featured && <Star className="h-4 w-4 text-accent-gold fill-accent-gold" />}
                  </div>
                  <div className="text-text-primary/60 mt-1 line-clamp-1">{project.tagline}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'shipped' ? 'bg-accent-teal/20 text-accent-teal' : 'bg-accent-violet/20 text-accent-violet'}`}>
                    {project.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {project.live_url && <a href={project.live_url} target="_blank" className="text-text-primary/60 hover:text-accent-teal"><ExternalLink className="h-4 w-4" /></a>}
                    {project.repo_url && <a href={project.repo_url} target="_blank" className="text-text-primary/60 hover:text-accent-violet"><ExternalLink className="h-4 w-4" /></a>}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button onClick={() => openModal(project)} className="mr-2 h-8 px-2 bg-transparent hover:bg-border-pixel/50">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(project.id)} className="h-8 px-2 text-accent-red bg-transparent hover:bg-accent-red/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-text-primary/50">No projects found. Create one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-bg-base border border-border-pixel rounded-xl w-full max-w-2xl shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-border-pixel">
              <h2 className="text-xl font-bold">{editingProject ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-primary/50 hover:text-text-primary">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-accent-red/10 text-accent-red border border-accent-red/20 rounded-md text-sm">{error}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tagline</label>
                  <Input required value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  required 
                  className="flex min-h-[100px] w-full rounded-md border border-border-pixel bg-bg-base px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal disabled:cursor-not-allowed disabled:opacity-50 text-text-primary"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stack (comma separated)</label>
                <Input required value={formData.stack} onChange={e => setFormData({...formData, stack: e.target.value})} placeholder="Next.js, Tailwind, Supabase" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Live URL (optional)</label>
                  <Input type="url" value={formData.live_url} onChange={e => setFormData({...formData, live_url: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Repo URL (optional)</label>
                  <Input type="url" value={formData.repo_url} onChange={e => setFormData({...formData, repo_url: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-border-pixel bg-bg-base px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal text-text-primary"
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="shipped">Shipped</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="flex items-center space-x-2 h-10 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-accent-gold"
                      checked={formData.featured} 
                      onChange={e => setFormData({...formData, featured: e.target.checked})} 
                    />
                    <span className="text-sm font-medium">Featured Project ⭐</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  Screenshots
                  <label className="cursor-pointer flex items-center text-accent-teal hover:text-accent-teal/80 text-xs">
                    {uploadingImage ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <ImageIcon className="mr-1 h-3 w-3" />}
                    Upload Image
                    <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleImageUpload} disabled={uploadingImage || formData.screenshots.length >= 10} />
                  </label>
                </label>
                
                {formData.screenshots.length > 0 ? (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {formData.screenshots.map((url, idx) => (
                      <div key={idx} className="relative group aspect-video bg-border-pixel/30 rounded overflow-hidden">
                        <img src={url} alt={`Screenshot ${idx+1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4 text-accent-red" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-text-primary/40 border border-dashed border-border-pixel rounded p-4 text-center">
                    No screenshots added yet. Max 10.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border-pixel mt-6">
                <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-transparent border border-border-pixel hover:bg-border-pixel/30">Cancel</Button>
                <Button type="submit" disabled={loading || uploadingImage} className="bg-accent-teal text-bg-base hover:bg-accent-teal/90">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingProject ? "Save Changes" : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

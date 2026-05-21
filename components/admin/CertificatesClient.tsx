"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImage } from "@/lib/cloudinary-upload";
import { optimizeCloudinaryUrl } from "@/lib/utils";

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issued_date: string;
  credential_url: string | null;
  image_url: string | null;
};

export default function CertificatesClient({ initialCertificates }: { initialCertificates: Certificate[] }) {
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "", issuer: "", issued_date: "", credential_url: "", image_url: ""
  });

  const openModal = (cert?: Certificate) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        title: cert.title,
        issuer: cert.issuer,
        issued_date: cert.issued_date,
        credential_url: cert.credential_url || "",
        image_url: cert.image_url || ""
      });
    } else {
      setEditingCert(null);
      setFormData({ title: "", issuer: "", issued_date: "", credential_url: "", image_url: "" });
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
      const url = await uploadImage(file, "raaj-portfolio/certificates");
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      credential_url: formData.credential_url || null,
      image_url: formData.image_url || null,
    };

    try {
      const url = editingCert ? `/api/admin/certificates/${editingCert.id}` : "/api/admin/certificates";
      const method = editingCert ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save certificate");

      if (editingCert) {
        setCertificates(certificates.map(c => c.id === editingCert.id ? data : c));
      } else {
        setCertificates([data, ...certificates].sort((a,b) => new Date(b.issued_date).getTime() - new Date(a.issued_date).getTime()));
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete certificate");
      setCertificates(certificates.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
          <p className="text-text-primary/70 mt-1">Manage your professional credentials</p>
        </div>
        <Button onClick={() => openModal()} className="bg-accent-gold text-bg-base hover:bg-accent-gold/90">
          <Plus className="mr-2 h-4 w-4" /> Add Certificate
        </Button>
      </div>

      <div className="rounded-xl border border-border-pixel bg-bg-base overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-border-pixel/30 border-b border-border-pixel text-text-primary/70">
            <tr>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Issuer</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-pixel">
            {certificates.map(cert => (
              <tr key={cert.id} className="hover:bg-border-pixel/10 transition-colors">
                <td className="px-6 py-4 font-medium">{cert.title}</td>
                <td className="px-6 py-4">{cert.issuer}</td>
                <td className="px-6 py-4 text-text-primary/60">{cert.issued_date}</td>
                <td className="px-6 py-4 text-right">
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" className="inline-block p-2 text-text-primary/60 hover:text-accent-gold">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Button onClick={() => openModal(cert)} className="h-8 px-2 bg-transparent hover:bg-border-pixel/50">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(cert.id)} className="h-8 px-2 text-accent-red bg-transparent hover:bg-accent-red/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {certificates.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-text-primary/50">No certificates found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-bg-base border border-border-pixel rounded-xl w-full max-w-xl shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-border-pixel">
              <h2 className="text-xl font-bold">{editingCert ? "Edit Certificate" : "New Certificate"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-primary/50 hover:text-text-primary">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-accent-red/10 text-accent-red border border-accent-red/20 rounded-md text-sm">{error}</div>}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issuer</label>
                  <Input required value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Date</label>
                  <Input required type="date" value={formData.issued_date} onChange={e => setFormData({...formData, issued_date: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Credential URL (optional)</label>
                <Input type="url" value={formData.credential_url} onChange={e => setFormData({...formData, credential_url: e.target.value})} />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  Certificate Image (optional)
                  <label className="cursor-pointer flex items-center text-accent-gold hover:text-accent-gold/80 text-xs">
                    {uploadingImage ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <ImageIcon className="mr-1 h-3 w-3" />}
                    Upload Image
                    <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </label>
                
                {formData.image_url ? (
                  <div className="relative group aspect-[4/3] w-full max-w-sm bg-border-pixel/30 rounded overflow-hidden mt-2">
                    <img src={optimizeCloudinaryUrl(formData.image_url)} alt="Certificate" className="w-full h-full object-contain" />
                    <button type="button" onClick={() => setFormData({...formData, image_url: ""})} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-6 w-6 text-accent-red" />
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-text-primary/40 border border-dashed border-border-pixel rounded p-4 text-center mt-2">
                    No image uploaded.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border-pixel mt-6">
                <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-transparent border border-border-pixel hover:bg-border-pixel/30">Cancel</Button>
                <Button type="submit" disabled={loading || uploadingImage} className="bg-accent-gold text-bg-base hover:bg-accent-gold/90">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCert ? "Save Changes" : "Add Certificate"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

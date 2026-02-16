import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import {
  Plus, Trash2, Edit3, Save, X, Download, Search, Filter, Clock,
  CheckCircle, AlertCircle, Calendar, User, Briefcase, FileText,
  TrendingUp, BarChart3, ChevronDown, ChevronUp, Star, MapPin
} from "lucide-react";

const CATEGORIES = [
  "Administrasi", "Meeting", "Pengembangan", "Riset", "Pelaporan",
  "Koordinasi", "Operasional", "Training", "Maintenance", "Lainnya"
];

const PRIORITIES = [
  { label: "Rendah", color: "bg-green-100 text-green-800", dot: "bg-green-500" },
  { label: "Sedang", color: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500" },
  { label: "Tinggi", color: "bg-orange-100 text-orange-800", dot: "bg-orange-500" },
  { label: "Urgent", color: "bg-red-100 text-red-800", dot: "bg-red-500" }
];

const STATUS_OPTIONS = [
  { label: "Belum Mulai", color: "bg-gray-100 text-gray-700", icon: "⏳" },
  { label: "Sedang Dikerjakan", color: "bg-blue-100 text-blue-700", icon: "🔄" },
  { label: "Selesai", color: "bg-green-100 text-green-700", icon: "✅" },
  { label: "Tertunda", color: "bg-red-100 text-red-700", icon: "⛔" }
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6", "#f97316", "#64748b"];

const initialData = [
  {
    id: 1, tanggal: "2026-02-16", nama: "Ahmad Fauzi", jabatan: "Staff IT",
    lokasi: "Kantor Pusat", jamMulai: "08:00", jamSelesai: "10:00",
    kegiatan: "Maintenance server dan update sistem keamanan",
    kategori: "Maintenance", prioritas: 2, status: 2,
    hasil: "Server berhasil diperbarui, patch keamanan terpasang",
    kendala: "Downtime 30 menit untuk restart", catatan: "Perlu monitoring 24 jam",
    rating: 4, persentase: 100
  },
  {
    id: 2, tanggal: "2026-02-16", nama: "Siti Rahmawati", jabatan: "HRD",
    lokasi: "Kantor Pusat", jamMulai: "09:00", jamSelesai: "11:30",
    kegiatan: "Rekap data absensi karyawan bulan Januari",
    kategori: "Administrasi", prioritas: 1, status: 2,
    hasil: "Data absensi 150 karyawan berhasil direkap",
    kendala: "Beberapa data tidak lengkap", catatan: "Follow up ke 5 divisi",
    rating: 3, persentase: 100
  },
  {
    id: 3, tanggal: "2026-02-15", nama: "Budi Santoso", jabatan: "Marketing",
    lokasi: "Lapangan", jamMulai: "10:00", jamSelesai: "15:00",
    kegiatan: "Presentasi proposal ke klien PT Maju Bersama",
    kategori: "Meeting", prioritas: 3, status: 2,
    hasil: "Klien tertarik, akan follow up minggu depan",
    kendala: "Jadwal klien terbatas", catatan: "Siapkan revisi proposal",
    rating: 5, persentase: 100
  },
  {
    id: 4, tanggal: "2026-02-15", nama: "Ahmad Fauzi", jabatan: "Staff IT",
    lokasi: "Remote", jamMulai: "13:00", jamSelesai: "16:00",
    kegiatan: "Pengembangan modul dashboard laporan",
    kategori: "Pengembangan", prioritas: 2, status: 1,
    hasil: "Progress 70%, UI selesai, backend belum",
    kendala: "API belum ready dari tim backend", catatan: "Target selesai Jumat",
    rating: 3, persentase: 70
  }
];

const emptyForm = {
  tanggal: new Date().toISOString().split("T")[0],
  nama: "", jabatan: "", lokasi: "", jamMulai: "", jamSelesai: "",
  kegiatan: "", kategori: "Administrasi", prioritas: 1, status: 0,
  hasil: "", kendala: "", catatan: "", rating: 3, persentase: 0
};

function Badge({ children, className }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>;
}

function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={readonly ? 14 : 20}
          className={`${s <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} ${!readonly ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onClick={() => !readonly && onChange && onChange(s)}
        />
      ))}
    </div>
  );
}

function ProgressBar({ value }) {
  const color = value === 100 ? "bg-green-500" : value >= 50 ? "bg-blue-500" : value >= 25 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function DailyWorkReport() {
  const [data, setData] = useState(initialData);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [sortField, setSortField] = useState("tanggal");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedId, setExpandedId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = () => {
    if (!form.nama || !form.kegiatan || !form.tanggal || !form.jamMulai || !form.jamSelesai) {
      showNotif("Harap isi semua field wajib (*)", "error");
      return;
    }
    if (form.jamSelesai <= form.jamMulai) {
      showNotif("Jam selesai harus lebih besar dari jam mulai!", "error");
      return;
    }
    if (editId) {
      setData(prev => prev.map(d => d.id === editId ? { ...form, id: editId } : d));
      showNotif("Data berhasil diperbarui! ✏️");
      setEditId(null);
    } else {
      setData(prev => [...prev, { ...form, id: Date.now() }]);
      showNotif("Data berhasil ditambahkan! 🎉");
    }
    setForm({ ...emptyForm });
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setForm({ ...item });
    setEditId(item.id);
    setShowForm(true);
    setActiveTab("input");
  };

  const handleDelete = (id) => {
    setData(prev => prev.filter(d => d.id !== id));
    showNotif("Data berhasil dihapus! 🗑️");
  };

  const hitungDurasi = (mulai, selesai) => {
    if (!mulai || !selesai) return "—";
    const [h1, m1] = mulai.split(":").map(Number);
    const [h2, m2] = selesai.split(":").map(Number);
    const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff <= 0) return "—";
    const jam = Math.floor(diff / 60);
    const mnt = diff % 60;
    return `${jam}j ${mnt}m`;
  };

  const hitungDurasiMenit = (mulai, selesai) => {
    if (!mulai || !selesai) return 0;
    const [h1, m1] = mulai.split(":").map(Number);
    const [h2, m2] = selesai.split(":").map(Number);
    return Math.max(0, (h2 * 60 + m2) - (h1 * 60 + m1));
  };

  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(d =>
        d.nama.toLowerCase().includes(s) || d.kegiatan.toLowerCase().includes(s) ||
        d.hasil.toLowerCase().includes(s) || d.jabatan.toLowerCase().includes(s)
      );
    }
    if (filterKategori !== "Semua") result = result.filter(d => d.kategori === filterKategori);
    if (filterStatus !== "Semua") result = result.filter(d => STATUS_OPTIONS[d.status]?.label === filterStatus);
    if (filterTanggal) result = result.filter(d => d.tanggal === filterTanggal);
    result.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [data, searchTerm, filterKategori, filterStatus, filterTanggal, sortField, sortDir]);

  // Stats
  const stats = useMemo(() => {
    const totalKegiatan = data.length;
    const selesai = data.filter(d => d.status === 2).length;
    const totalMenit = data.reduce((s, d) => s + hitungDurasiMenit(d.jamMulai, d.jamSelesai), 0);
    const avgRating = data.length ? (data.reduce((s, d) => s + d.rating, 0) / data.length).toFixed(1) : 0;
    const avgProgress = data.length ? Math.round(data.reduce((s, d) => s + d.persentase, 0) / data.length) : 0;

    const byKategori = CATEGORIES.map(k => ({
      name: k, value: data.filter(d => d.kategori === k).length
    })).filter(x => x.value > 0);

    const byStatus = STATUS_OPTIONS.map((s, i) => ({
      name: s.label, value: data.filter(d => d.status === i).length
    })).filter(x => x.value > 0);

    const byTanggal = {};
    data.forEach(d => {
      if (!byTanggal[d.tanggal]) byTanggal[d.tanggal] = { tanggal: d.tanggal, kegiatan: 0, durasi: 0 };
      byTanggal[d.tanggal].kegiatan++;
      byTanggal[d.tanggal].durasi += hitungDurasiMenit(d.jamMulai, d.jamSelesai);
    });
    const dailyTrend = Object.values(byTanggal).sort((a, b) => a.tanggal.localeCompare(b.tanggal));

    const byNama = {};
    data.forEach(d => {
      if (!byNama[d.nama]) byNama[d.nama] = { nama: d.nama, total: 0, selesai: 0, durasi: 0 };
      byNama[d.nama].total++;
      if (d.status === 2) byNama[d.nama].selesai++;
      byNama[d.nama].durasi += hitungDurasiMenit(d.jamMulai, d.jamSelesai);
    });
    const karyawanStats = Object.values(byNama);

    return { totalKegiatan, selesai, totalMenit, avgRating, avgProgress, byKategori, byStatus, dailyTrend, karyawanStats };
  }, [data]);

  const exportCSV = () => {
    const headers = "Tanggal,Nama,Jabatan,Lokasi,Jam Mulai,Jam Selesai,Durasi,Kegiatan,Kategori,Prioritas,Status,Hasil,Kendala,Catatan,Rating,Progress(%)";
    const rows = data.map(d =>
      `${d.tanggal},"${d.nama}","${d.jabatan}","${d.lokasi}",${d.jamMulai},${d.jamSelesai},"${hitungDurasi(d.jamMulai, d.jamSelesai)}","${d.kegiatan}",${d.kategori},${PRIORITIES[d.prioritas]?.label},${STATUS_OPTIONS[d.status]?.label},"${d.hasil}","${d.kendala}","${d.catatan}",${d.rating},${d.persentase}`
    ).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Laporan_Kerja_Harian_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    showNotif("File CSV berhasil diunduh! 📥");
  };

  const tabs = [
    { id: "input", label: "📋 Data & Input", icon: FileText },
    { id: "dashboard", label: "📊 Dashboard", icon: BarChart3 },
    { id: "karyawan", label: "👥 Per Karyawan", icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all animate-bounce ${notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Briefcase size={28} /> Laporan Kerja Harian
              </h1>
              <p className="text-blue-100 text-sm mt-1">Sistem Input & Monitoring Data Kerja Karyawan</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur rounded-lg px-3 py-1.5 text-sm">
                <Calendar size={14} className="inline mr-1" />
                {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            {[
              { label: "Total Kegiatan", val: stats.totalKegiatan, icon: "📋" },
              { label: "Selesai", val: stats.selesai, icon: "✅" },
              { label: "Total Jam Kerja", val: `${Math.floor(stats.totalMenit / 60)}j ${stats.totalMenit % 60}m`, icon: "⏱️" },
              { label: "Rata-rata Rating", val: stats.avgRating, icon: "⭐" },
              { label: "Avg Progress", val: `${stats.avgProgress}%`, icon: "📈" }
            ].map((s, i) => (
              <div key={i} className="bg-white/15 backdrop-blur rounded-xl px-3 py-2.5 text-center">
                <div className="text-lg">{s.icon}</div>
                <div className="text-xl font-bold">{s.val}</div>
                <div className="text-xs text-blue-100">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* TAB: INPUT & DATA */}
        {activeTab === "input" && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-2 flex-1">
                <div className="relative flex-1 min-w-48">
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="Cari nama, kegiatan, hasil..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400" value={filterKategori} onChange={e => setFilterKategori(e.target.value)}>
                  <option>Semua</option>
                  {CATEGORIES.map(k => <option key={k}>{k}</option>)}
                </select>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option>Semua</option>
                  {STATUS_OPTIONS.map(s => <option key={s.label}>{s.label}</option>)}
                </select>
                <input type="date" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400" value={filterTanggal} onChange={e => setFilterTanggal(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <button onClick={exportCSV} className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  <Download size={16} /> Export CSV
                </button>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...emptyForm }); }} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Tutup" : "Tambah Data"}
                </button>
              </div>
            </div>

            {/* Input Form */}
            {showForm && (
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    {editId ? <Edit3 size={18} /> : <Plus size={18} />}
                    {editId ? "Edit Data Kerja" : "Input Data Kerja Baru"}
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal *</label>
                    <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Karyawan *</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="Nama lengkap" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Jabatan</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="Jabatan/Posisi" value={form.jabatan} onChange={e => setForm({ ...form, jabatan: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Lokasi Kerja</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="Kantor/Remote/Lapangan" value={form.lokasi} onChange={e => setForm({ ...form, lokasi: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Jam Mulai *</label>
                    <input type="time" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={form.jamMulai} onChange={e => setForm({ ...form, jamMulai: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Jam Selesai *</label>
                    <input type="time" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={form.jamSelesai} onChange={e => setForm({ ...form, jamSelesai: e.target.value })} />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Uraian Kegiatan *</label>
                    <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none" placeholder="Deskripsikan kegiatan kerja secara detail..." value={form.kegiatan} onChange={e => setForm({ ...form, kegiatan: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Kategori</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400" value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}>
                      {CATEGORIES.map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Prioritas</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400" value={form.prioritas} onChange={e => setForm({ ...form, prioritas: Number(e.target.value) })}>
                      {PRIORITIES.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400" value={form.status} onChange={e => setForm({ ...form, status: Number(e.target.value) })}>
                      {STATUS_OPTIONS.map((s, i) => <option key={i} value={i}>{s.icon} {s.label}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Hasil / Output</label>
                    <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none" placeholder="Hasil yang dicapai..." value={form.hasil} onChange={e => setForm({ ...form, hasil: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Progress (%)</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="100" step="5" className="flex-1 accent-indigo-600" value={form.persentase} onChange={e => setForm({ ...form, persentase: Number(e.target.value) })} />
                      <span className="text-sm font-bold text-indigo-600 w-12 text-right">{form.persentase}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Kendala / Hambatan</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="Kendala yang dihadapi..." value={form.kendala} onChange={e => setForm({ ...form, kendala: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Catatan Tambahan</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="Catatan atau tindak lanjut..." value={form.catatan} onChange={e => setForm({ ...form, catatan: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Rating Kinerja</label>
                    <StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
                  </div>
                </div>
                <div className="px-6 pb-5 flex gap-2">
                  <button onClick={handleSubmit} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md">
                    <Save size={16} /> {editId ? "Update Data" : "Simpan Data"}
                  </button>
                  <button onClick={() => { setShowForm(false); setEditId(null); setForm({ ...emptyForm }); }} className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  📋 Data Kerja Harian ({filteredData.length} data)
                </h3>
                <div className="flex gap-1 text-xs">
                  {["tanggal", "nama", "kategori", "prioritas"].map(f => (
                    <button key={f} onClick={() => { setSortField(f); setSortDir(sortField === f && sortDir === "asc" ? "desc" : "asc"); }}
                      className={`px-2 py-1 rounded ${sortField === f ? "bg-indigo-100 text-indigo-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
                      {f.charAt(0).toUpperCase() + f.slice(1)} {sortField === f && (sortDir === "asc" ? <ChevronUp size={10} className="inline" /> : <ChevronDown size={10} className="inline" />)}
                    </button>
                  ))}
                </div>
              </div>
              {filteredData.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <FileText size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">Tidak ada data</p>
                  <p className="text-sm">Tambahkan data kerja baru atau ubah filter pencarian</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredData.map(item => (
                    <div key={item.id} className="hover:bg-indigo-50/30 transition-colors">
                      <div className="px-5 py-3 flex items-start gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-3 h-3 rounded-full ${PRIORITIES[item.prioritas]?.dot}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900 text-sm">{item.nama}</span>
                            <Badge className="bg-gray-100 text-gray-600">{item.jabatan}</Badge>
                            <Badge className={STATUS_OPTIONS[item.status]?.color}>
                              {STATUS_OPTIONS[item.status]?.icon} {STATUS_OPTIONS[item.status]?.label}
                            </Badge>
                            <Badge className={PRIORITIES[item.prioritas]?.color}>
                              {PRIORITIES[item.prioritas]?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mt-1 line-clamp-1">{item.kegiatan}</p>
                          <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                            <span><Calendar size={11} className="inline mr-1" />{item.tanggal}</span>
                            <span><Clock size={11} className="inline mr-1" />{item.jamMulai} - {item.jamSelesai} ({hitungDurasi(item.jamMulai, item.jamSelesai)})</span>
                            <span><MapPin size={11} className="inline mr-1" />{item.lokasi || "—"}</span>
                            <span className="text-indigo-600 font-medium">{item.kategori}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <div className="text-right mr-2 hidden sm:block">
                            <div className="w-20"><ProgressBar value={item.persentase} /></div>
                            <span className="text-xs text-gray-500">{item.persentase}%</span>
                          </div>
                          <StarRating value={item.rating} readonly />
                          <button onClick={e => { e.stopPropagation(); handleEdit(item); }} className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-500 transition-colors"><Edit3 size={15} /></button>
                          <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }} className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors"><Trash2 size={15} /></button>
                          {expandedId === item.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </div>
                      </div>
                      {expandedId === item.id && (
                        <div className="px-5 pb-4 ml-7 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-green-50 rounded-xl p-3">
                            <h4 className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1"><CheckCircle size={12} /> Hasil / Output</h4>
                            <p className="text-sm text-green-900">{item.hasil || "—"}</p>
                          </div>
                          <div className="bg-orange-50 rounded-xl p-3">
                            <h4 className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1"><AlertCircle size={12} /> Kendala</h4>
                            <p className="text-sm text-orange-900">{item.kendala || "—"}</p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-3">
                            <h4 className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1"><FileText size={12} /> Catatan</h4>
                            <p className="text-sm text-blue-900">{item.catatan || "—"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Kegiatan per Kategori */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-4">📊 Kegiatan per Kategori</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stats.byKategori}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" name="Jumlah" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Status Pie */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-4">📈 Distribusi Status</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={stats.byStatus} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {stats.byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Trend Harian */}
              <div className="bg-white rounded-2xl shadow-lg p-5 lg:col-span-2">
                <h3 className="font-semibold text-gray-800 mb-4">📉 Trend Aktivitas Harian</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.dailyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="tanggal" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="kegiatan" stroke="#6366f1" strokeWidth={3} name="Jumlah Kegiatan" dot={{ r: 5 }} />
                    <Line yAxisId="right" type="monotone" dataKey="durasi" stroke="#22c55e" strokeWidth={3} name="Durasi (menit)" dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PER KARYAWAN */}
        {activeTab === "karyawan" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.karyawanStats.map((k, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                      {k.nama.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{k.nama}</h4>
                      <p className="text-xs text-gray-500">{data.find(d => d.nama === k.nama)?.jabatan || "—"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-indigo-50 rounded-xl p-2">
                      <div className="text-xl font-bold text-indigo-600">{k.total}</div>
                      <div className="text-xs text-gray-500">Kegiatan</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-2">
                      <div className="text-xl font-bold text-green-600">{k.selesai}</div>
                      <div className="text-xs text-gray-500">Selesai</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-2">
                      <div className="text-xl font-bold text-blue-600">{Math.floor(k.durasi / 60)}j</div>
                      <div className="text-xs text-gray-500">Durasi</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Completion Rate</span>
                      <span className="font-bold">{k.total ? Math.round((k.selesai / k.total) * 100) : 0}%</span>
                    </div>
                    <ProgressBar value={k.total ? Math.round((k.selesai / k.total) * 100) : 0} />
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    Kegiatan terbaru:
                    {data.filter(d => d.nama === k.nama).slice(0, 2).map((d, j) => (
                      <div key={j} className="text-gray-600 mt-1 flex items-start gap-1">
                        <span className="text-indigo-400">•</span> {d.kegiatan.substring(0, 50)}{d.kegiatan.length > 50 ? "..." : ""}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bar Chart per Karyawan */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="font-semibold text-gray-800 mb-4">📊 Perbandingan Kinerja Karyawan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.karyawanStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="nama" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total Kegiatan" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="selesai" name="Selesai" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="text-center text-xs text-gray-400 mt-4">
          💼 Sistem Laporan Kerja Harian v2.0 — Dibangun untuk produktivitas & monitoring kinerja
        </div>
      </div>
    </div>
  );
}

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Kerja Harian</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="//unpkg.com/alpinejs" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
    <link rel="manifest" href="manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <style>
        [x-cloak] {
            display: none !important;
        }
    </style>
</head>

<body class="bg-slate-50 min-h-screen font-sans text-slate-800" x-data="appData()" x-init="initApp()">

    <!-- Notification -->
    <div x-show="notification" x-transition
        class="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium text-white"
        :class="notification?.type === 'error' ? 'bg-red-500' : 'bg-green-500'" x-text="notification?.msg" x-cloak>
    </div>

    <!-- Header -->
    <header class="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xl">
        <div class="max-w-7xl mx-auto px-4 py-5">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 class="text-2xl font-bold flex items-center gap-2">
                        <i data-lucide="briefcase"></i> Laporan Kerja Harian
                    </h1>
                    <p class="text-blue-100 text-sm mt-1">Sistem Input & Monitoring Data Kerja Karyawan</p>
                </div>
                <div class="bg-white/20 backdrop-blur rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
                    <i data-lucide="calendar" class="w-4 h-4"></i>
                    <span
                        x-text="new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })"></span>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
                <template x-for="stat in statsList">
                    <div class="bg-white/10 backdrop-blur rounded-xl p-3 text-center border border-white/10">
                        <div class="text-2xl mb-1" x-text="stat.icon"></div>
                        <div class="text-xl font-bold" x-text="stat.value"></div>
                        <div class="text-xs text-blue-100" x-text="stat.label"></div>
                    </div>
                </template>
            </div>
        </div>
    </header>

    <!-- Navigation -->
    <div class="max-w-7xl mx-auto px-4 mt-6">
        <div class="bg-white rounded-xl p-1.5 shadow-sm flex gap-2 overflow-x-auto">
            <template x-for="tab in tabs">
                <button @click="activeTab = tab.id; $nextTick(() => updateCharts())"
                    class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2"
                    :class="activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'">
                    <i :data-lucide="tab.iconName" class="w-4 h-4"></i>
                    <span x-text="tab.label"></span>
                </button>
            </template>
        </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6">

        <!-- INPUT TAB -->
        <div x-show="activeTab === 'input'" x-transition>
            <!-- Filters -->
            <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                <div class="flex flex-wrap gap-2 flex-1 w-full">
                    <div class="relative flex-1 min-w-[200px]">
                        <i data-lucide="search" class="absolute left-3 top-2.5 text-gray-400 w-4 h-4"></i>
                        <input type="text" x-model="searchTerm" placeholder="Cari nama, kegiatan..."
                            class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none">
                    </div>
                    <select x-model="filterKategori"
                        class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400">
                        <option value="Semua">Semua Kategori</option>
                        <template x-for="k in categories" :key="k">
                            <option :value="k" x-text="k"></option>
                        </template>
                    </select>
                    <select x-model="filterStatus"
                        class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400">
                        <option value="Semua">Semua Status</option>
                        <template x-for="s in statusOptions" :key="s.label">
                            <option :value="s.label" x-text="s.label"></option>
                        </template>
                    </select>
                </div>
                <div class="flex gap-2">
                    <button @click="exportCSV"
                        class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                        <i data-lucide="download" class="w-4 h-4"></i> Export CSV
                    </button>
                    <button @click="exportPDF"
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                        <i data-lucide="file-text" class="w-4 h-4"></i> Export PDF
                    </button>
                    <button @click="sendEmail"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                        <i data-lucide="mail" class="w-4 h-4"></i> Email Recap
                    </button>
                    <button @click="toggleForm()"
                        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                        <i :data-lucide="showForm ? 'x' : 'plus'" class="w-4 h-4"></i>
                        <span x-text="showForm ? 'Tutup' : 'Tambah Data'"></span>
                    </button>
                </div>
            </div>

            <!-- Form -->
            <div x-show="showForm" x-transition
                class="mb-6 bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
                <div
                    class="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3 text-white font-semibold flex items-center gap-2">
                    <i :data-lucide="editId ? 'edit-3' : 'plus'" class="w-4 h-4"></i>
                    <span x-text="editId ? 'Edit Data Kerja' : 'Input Data Kerja Baru'"></span>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Fields -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Tanggal *</label>
                        <input type="date" x-model="formData.tanggal"
                            class="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Karyawan *</label>
                        <input type="text" x-model="formData.nama" placeholder="Nama Lengkap"
                            class="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Jabatan</label>
                        <input type="text" x-model="formData.jabatan" placeholder="Posisi"
                            class="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Departemen</label>
                        <select x-model="formData.departemen"
                            class="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400">
                            <option value="IT">IT</option>
                            <option value="HRD">HRD</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Operasional">Operasional</option>
                            <option value="Keuangan">Keuangan</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Jam Mulai *</label>
                        <input type="time" x-model="formData.jamMulai"
                            class="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Jam Selesai *</label>
                        <input type="time" x-model="formData.jamSelesai"
                            class="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Kategori</label>
                        <select x-model="formData.kategori"
                            class="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400">
                            <template x-for="k in categories" :key="k">
                                <option :value="k" x-text="k"></option>
                            </template>
                        </select>
                    </div>
                </div>
                <div class="md:col-span-3">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Kegiatan *</label>
                    <textarea x-model="formData.kegiatan" rows="2"
                        class="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
                        placeholder="Deskripsi kegiatan..."></textarea>
                </div>
                <div class="md:col-span-3">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Komentar / Feedback (Atasan)</label>
                    <textarea x-model="formData.komentar" rows="1"
                        class="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
                        placeholder="Catatan dari atasan..."></textarea>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                    <select x-model="formData.status"
                        class="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400">
                        <template x-for="(s, index) in statusOptions" :key="index">
                            <option :value="index" x-text="s.label"></option>
                        </template>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Rating</label>
                    <div class="flex gap-1">
                        <template x-for="i in 5">
                            <button @click="formData.rating = i"
                                class="text-xl focus:outline-none transition-transform hover:scale-110"
                                :class="i <= formData.rating ? 'text-yellow-400' : 'text-gray-300'">★</button>
                        </template>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Progress (<span
                            x-text="formData.persentase + '%'"></span>)</label>
                    <input type="range" x-model="formData.persentase" min="0" max="100"
                        class="w-full accent-indigo-600">
                </div>
            </div>
            <div class="px-6 pb-5 flex gap-2">
                <button @click="saveData()"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-colors">Simpan</button>
                <button @click="showForm = false"
                    class="text-gray-600 hover:bg-gray-100 px-6 py-2 rounded-lg transition-colors">Batal</button>
            </div>
        </div>

        <!-- List -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 class="font-semibold text-gray-800">📋 Data Kerja Harian (<span
                        x-text="filteredData.length"></span>)</h3>
            </div>

            <template x-if="filteredData.length === 0">
                <div class="text-center py-16 text-gray-400">
                    <i data-lucide="file-text" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
                    <p>Tidak ada data ditemukan.</p>
                </div>
            </template>

            <div class="divide-y divide-gray-50">
                <template x-for="item in filteredData" :key="item.id">
                    <div class="hover:bg-indigo-50/30 transition-colors">
                        <div class="px-5 py-3 cursor-pointer" @click="toggleExpand(item.id)">
                            <div class="flex items-start gap-4">
                                <div class="mt-1 w-3 h-3 rounded-full" :class="getPriorityColor(item.prioritas)">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex flex-wrap gap-2 items-center mb-1">
                                        <span class="font-semibold text-gray-900" x-text="item.nama"></span>
                                        <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                                            x-text="item.jabatan"></span>
                                        <span
                                            class="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full border border-blue-100"
                                            x-text="item.departemen || '-'"></span>
                                        <span class="text-xs px-2 py-0.5 rounded-full"
                                            :class="statusOptions[item.status].color"
                                            x-text="statusOptions[item.status].label"></span>
                                    </div>
                                    <p class="text-sm text-gray-800 line-clamp-1" x-text="item.kegiatan"></p>
                                    <div class="flex gap-4 mt-2 text-xs text-gray-500">
                                        <span class="flex items-center gap-1"><i data-lucide="calendar"
                                                class="w-3 h-3"></i> <span x-text="item.tanggal"></span></span>
                                        <span class="flex items-center gap-1"><i data-lucide="clock"
                                                class="w-3 h-3"></i> <span
                                                x-text="item.jamMulai + ' - ' + item.jamSelesai"></span></span>
                                    </div>
                                    <div x-show="item.komentar"
                                        class="mt-2 text-xs bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-100">
                                        <strong>💬 Feedback:</strong> <span x-text="item.komentar"></span>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end gap-2">
                                    <div class="flex text-yellow-400 text-xs">
                                        <template x-for="i in 5">
                                            <span x-text="i <= item.rating ? '★' : '☆'" class="text-sm"></span>
                                        </template>
                                    </div>
                                    <div class="text-xs font-bold text-gray-500" x-text="item.persentase + '%'">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Actions -->
                        <div class="px-5 pb-3 flex justify-end gap-2 border-t border-gray-50 pt-2"
                            x-show="expandedId === item.id">
                            <button @click.stop="addToCalendar(item)"
                                class="text-indigo-600 text-xs hover:underline flex items-center gap-1"><i
                                    data-lucide="calendar-plus" class="w-3 h-3"></i> Sync Calendar</button>
                            <button @click.stop="editItem(item)"
                                class="text-blue-600 text-xs hover:underline flex items-center gap-1"><i
                                    data-lucide="edit-3" class="w-3 h-3"></i> Edit</button>
                            <button @click.stop="deleteItem(item.id)"
                                class="text-red-600 text-xs hover:underline flex items-center gap-1"><i
                                    data-lucide="trash-2" class="w-3 h-3"></i> Hapus</button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        </div>

        <!-- DASHBOARD TAB -->
        <div x-show="activeTab === 'dashboard'" x-transition>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- AI Insights Panel -->
                <div
                    class="lg:col-span-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4 opacity-10">
                        <i data-lucide="brain-circuit" class="w-32 h-32"></i>
                    </div>
                    <div class="relative z-10">
                        <h2 class="text-xl font-bold flex items-center gap-2 mb-2">
                            <i data-lucide="sparkles"></i> AI Analitik Lanjutan
                        </h2>
                        <p class="text-violet-100 text-sm mb-4">Prediksi beban kerja & analisis performa berbasis data
                            historis.</p>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                                <div class="text-xs text-violet-200">Risiko Burnout</div>
                                <div class="text-lg font-bold" x-text="aiInsights.burnoutRisk"></div>
                                <div class="w-full bg-white/20 h-1.5 rounded-full mt-2">
                                    <div class="h-1.5 rounded-full bg-white transition-all"
                                        :style="`width: ${aiInsights.burnoutScore}%`"></div>
                                </div>
                            </div>
                            <div class="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                                <div class="text-xs text-violet-200">Prediksi Selesai Besok</div>
                                <div class="text-lg font-bold" x-text="aiInsights.completionRate + '%'"></div>
                                <div class="text-[10px] text-violet-200 mt-1">Estimasi berdasarkan tren sebelumnya</div>
                            </div>
                            <div class="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                                <div class="text-xs text-violet-200">Saran Produktivitas</div>
                                <div class="text-sm font-medium italic">"<span x-text="aiInsights.suggestion"></span>"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 class="font-semibold mb-4">Kegiatan per Kategori</h3>
                    <div class="h-64"><canvas id="chartKategori"></canvas></div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 class="font-semibold mb-4">Status Pekerjaan</h3>
                    <div class="h-64"><canvas id="chartStatus"></canvas></div>
                </div>
            </div>
        </div>

    </main>

    <!-- Footer -->
    <footer class="max-w-7xl mx-auto px-4 py-8 text-center text-xs text-gray-400">
        <p>Sistem Laporan Kerja Harian &copy; 2026 — Dibuat dengan ❤️ oleh Rifqy Malikh Hanapi</p>
        <p class="mt-1">Dideploy dengan PHP CodeIgniter 4 di Vercel</p>
    </footer>

    <script>
        const initialData = [
            { id: 1, tanggal: "2026-02-16", nama: "Ahmad Fauzi", jabatan: "Staff IT", departemen: "IT", jamMulai: "08:00", jamSelesai: "10:00", kegiatan: "Maintenance server", komentar: "Kerja bagus, server lancar.", kategori: "Maintenance", prioritas: 1, status: 2, rating: 4, persentase: 100 },
            { id: 2, tanggal: "2026-02-16", nama: "Siti Rahma", jabatan: "HRD", departemen: "HRD", jamMulai: "09:00", jamSelesai: "11:30", kegiatan: "Rekap absen", komentar: "", kategori: "Administrasi", prioritas: 0, status: 2, rating: 5, persentase: 100 },
            { id: 3, tanggal: "2026-02-15", nama: "Budi Santoso", jabatan: "Marketing", departemen: "Marketing", jamMulai: "10:00", jamSelesai: "15:00", kegiatan: "Mitings Klien", komentar: "Tolong follow up lagi lusa.", kategori: "Meeting", prioritas: 2, status: 1, rating: 3, persentase: 50 },
        ];

        function appData() {
            return {
                data: JSON.parse(localStorage.getItem('laporan_data')) || initialData,
                activeTab: 'input',
                showForm: false,
                editId: null,
                searchTerm: '',
                filterKategori: 'Semua',
                filterStatus: 'Semua',
                expandedId: null,
                notification: null,

                categories: ["Administrasi", "Meeting", "Pengembangan", "Riset", "Pelaporan", "Koordinasi", "Operasional", "Training", "Maintenance", "Lainnya"],
                statusOptions: [
                    { label: "Belum Mulai", color: "bg-gray-100 text-gray-700" },
                    { label: "Sedang Dikerjakan", color: "bg-blue-100 text-blue-700" },
                    { label: "Selesai", color: "bg-green-100 text-green-700" },
                    { label: "Tertunda", color: "bg-red-100 text-red-700" }
                ],
                tabs: [
                    { id: 'input', label: 'Data & Input', iconName: 'file-text' },
                    { id: 'dashboard', label: 'Dashboard', iconName: 'bar-chart-3' }
                ],

                formData: {
                    id: null, tanggal: new Date().toISOString().split('T')[0], nama: '', jabatan: '', departemen: 'IT',
                    jamMulai: '', jamSelesai: '', kegiatan: '', komentar: '', kategori: 'Administrasi',
                    prioritas: 0, status: 0, rating: 3, persentase: 0
                },

                aiInsights: { burnoutRisk: 'Rendah', burnoutScore: 20, completionRate: 85, suggestion: 'Pertahankan ritme kerja!' },

                initApp() {
                    this.init();
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.register('/sw.js').then(() => console.log('Service Worker Registered'));
                    }
                },

                init() {
                    this.$watch('data', (val) => localStorage.setItem('laporan_data', JSON.stringify(val)));
                    this.$watch('activeTab', () => { setTimeout(() => lucide.createIcons(), 100); });
                    lucide.createIcons();
                },

                get filteredData() {
                    return this.data.filter(item => {
                        const matchSearch = item.nama.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            item.kegiatan.toLowerCase().includes(this.searchTerm.toLowerCase());
                        const matchKat = this.filterKategori === 'Semua' || item.kategori === this.filterKategori;
                        const matchStat = this.filterStatus === 'Semua' || this.statusOptions[item.status].label === this.filterStatus;
                        return matchSearch && matchKat && matchStat;
                    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
                },

                get statsList() {
                    return [
                        { label: 'Total Kegiatan', value: this.data.length, icon: '📋' },
                        { label: 'Selesai', value: this.data.filter(d => d.status === 2).length, icon: '✅' },
                        { label: 'Avg Rating', value: (this.data.reduce((acc, curr) => acc + curr.rating, 0) / (this.data.length || 1)).toFixed(1), icon: '⭐' }
                    ];
                },

                toggleForm() {
                    this.showForm = !this.showForm;
                    if (!this.showForm) this.resetForm();
                },

                resetForm() {
                    this.editId = null;
                    this.formData = {
                        id: null, tanggal: new Date().toISOString().split('T')[0], nama: '', jabatan: '', departemen: 'IT',
                        jamMulai: '', jamSelesai: '', kegiatan: '', komentar: '', kategori: 'Administrasi',
                        prioritas: 0, status: 0, rating: 3, persentase: 0
                    };
                },

                saveData() {
                    if (!this.formData.nama || !this.formData.kegiatan) {
                        this.showNotif('Mohon lengkapi data wajib (*)', 'error');
                        return;
                    }

                    if (this.editId) {
                        const index = this.data.findIndex(d => d.id === this.editId);
                        this.data[index] = { ...this.formData, id: this.editId };
                        this.showNotif('Data berhasil diperbarui!');
                    } else {
                        this.data.push({ ...this.formData, id: Date.now() });
                        this.showNotif('Data berhasil ditambahkan!');
                    }
                    this.showForm = false;
                    this.resetForm();
                    setTimeout(() => this.updateCharts(), 500);
                },

                editItem(item) {
                    this.formData = { ...item };
                    this.editId = item.id;
                    this.showForm = true;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },

                deleteItem(id) {
                    if (confirm('Hapus data ini?')) {
                        this.data = this.data.filter(d => d.id !== id);
                        this.showNotif('Data dihapus', 'error');
                        setTimeout(() => this.updateCharts(), 500);
                    }
                },

                toggleExpand(id) {
                    this.expandedId = this.expandedId === id ? null : id;
                    setTimeout(() => lucide.createIcons(), 50);
                },

                getPriorityColor(p) {
                    return ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'][p] || 'bg-gray-400';
                },

                showNotif(msg, type = 'success') {
                    this.notification = { msg, type };
                    setTimeout(() => this.notification = null, 3000);
                },

                exportCSV() {
                    const headers = "Tanggal,Nama,Jabatan,Kegiatan,Kategori,Status,Rating\n";
                    const rows = this.data.map(d =>
                        `${d.tanggal},"${d.nama}","${d.jabatan}","${d.kegiatan}",${d.kategori},${this.statusOptions[d.status].label},${d.rating}`
                    ).join("\n");
                    const blob = new Blob([headers + rows], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "Laporan_Kerja.csv";
                    a.click();
                },

                exportPDF() {
                    if (!window.jspdf) return;
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();

                    // Header (Kop Surat Simulasi)
                    doc.setFontSize(18);
                    doc.text("PT. MAJU MUNDUR SEJAHTERA", 105, 15, { align: "center" });
                    doc.setFontSize(10);
                    doc.text("Jl. Teknologi No. 123, Jakarta Selatan, Indonesia", 105, 22, { align: "center" });
                    doc.line(15, 25, 195, 25);

                    doc.setFontSize(14);
                    doc.text("LAPORAN KERJA HARIAN", 105, 35, { align: "center" });

                    const head = [['Tanggal', 'Nama', 'Dept', 'Kegiatan', 'Status', 'Feedback']];
                    const body = this.filteredData.map(d => [
                        d.tanggal, d.nama, d.departemen || '-', d.kegiatan, this.statusOptions[d.status].label, d.komentar || '-'
                    ]);

                    doc.autoTable({
                        head: head,
                        body: body,
                        startY: 40,
                        styles: { fontSize: 8 },
                        headStyles: { fillColor: [79, 70, 229] }
                    });

                    doc.save("Laporan_Kerja.pdf");
                    this.showNotif('PDF berhasil diunduh! 📄');
                },

                sendEmail() {
                    // Simulasi pengiriman email
                    const recipient = "atasan@perusahaan.com";
                    const subject = `Laporan Kerja Harian - ${new Date().toLocaleDateString('id-ID')}`;
                    const body = `Berikut terlampir laporan kerja tim hari ini.\n\nTotal Kegiatan: ${this.data.length}\nSelesai: ${this.statsList[1].value}\n\nTerima kasih.`;

                    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    this.showNotif('Membuka aplikasi email... 📧');
                },

                // Charts
                chartInstance1: null,
                chartInstance2: null,

                initCharts() {
                    // Placeholder for chart init logic
                },

                updateCharts() {
                    if (this.activeTab !== 'dashboard') return;

                    this.calculateAI();

                    const ctx1 = document.getElementById('chartKategori');
                    const ctx2 = document.getElementById('chartStatus');

                    if (!ctx1 || !ctx2) return;

                    // Destroy old charts
                    if (this.chartInstance1) this.chartInstance1.destroy();
                    if (this.chartInstance2) this.chartInstance2.destroy();

                    // Prepare Data
                    const katCounts = this.categories.map(c => this.data.filter(d => d.kategori === c).length);
                    const statCounts = this.statusOptions.map((s, i) => this.data.filter(d => d.status === i).length);

                    this.chartInstance1 = new Chart(ctx1, {
                        type: 'bar',
                        data: {
                            labels: this.categories,
                            datasets: [{ label: 'Jumlah Kegiatan', data: katCounts, backgroundColor: '#6366f1', borderRadius: 5 }]
                        },
                        options: { responsive: true, maintainAspectRatio: false }
                    });

                    this.chartInstance2 = new Chart(ctx2, {
                        type: 'doughnut',
                        data: {
                            labels: this.statusOptions.map(s => s.label),
                            datasets: [{
                                data: statCounts,
                                backgroundColor: ['#f3f4f6', '#dbeafe', '#dcfce7', '#fee2e2']
                            }]
                        },
                        options: { responsive: true, maintainAspectRatio: false }
                    });
                },

                addToCalendar(item) {
                    const start = item.tanggal.replace(/-/g, '') + 'T' + item.jamMulai.replace(':', '') + '00';
                    const end = item.tanggal.replace(/-/g, '') + 'T' + item.jamSelesai.replace(':', '') + '00';
                    const details = encodeURIComponent(`Status: ${this.statusOptions[item.status].label}\nPrioritas: ${item.prioritas}\n\n${item.kegiatan}`);
                    const location = encodeURIComponent(item.departemen || 'Kantor');
                    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(item.kegiatan)}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
                    window.open(url, '_blank');
                    this.showNotif('Membuka Google Calendar... 📅');
                },

                calculateAI() {
                    // Logika AI Sederhana (Simulasi)
                    const totalHours = this.data.reduce((acc, curr) => {
                        const [h1, m1] = curr.jamMulai.split(':').map(Number);
                        const [h2, m2] = curr.jamSelesai.split(':').map(Number);
                        return acc + ((h2 * 60 + m2) - (h1 * 60 + m1));
                    }, 0) / 60;

                    let burnout = 'Rendah';
                    let score = 20;
                    let suggest = 'Pertahankan ritme kerja!';

                    if (totalHours > 8) {
                        burnout = 'Sedang';
                        score = 60;
                        suggest = 'Coba ambil jeda istirahat singkat.';
                    }
                    if (totalHours > 12) {
                        burnout = 'Tinggi ⚠️';
                        score = 90;
                        suggest = 'Stop! Segera istirahat sebelum kelelahan.';
                    }

                    const completion = Math.round(this.data.filter(d => d.status === 2).length / (this.data.length || 1) * 100);

                    this.aiInsights = {
                        burnoutRisk: burnout,
                        burnoutScore: score,
                        completionRate: completion > 80 ? 95 : completion + 10,
                        suggestion: suggest
                    };
                }
            }
        }
    </script>
</body>

</html>
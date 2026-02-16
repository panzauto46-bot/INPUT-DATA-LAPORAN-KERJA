<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateLaporanKerjaTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'tanggal' => [
                'type' => 'DATE',
            ],
            'nama' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'jabatan' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'kegiatan' => [
                'type' => 'TEXT',
            ],
            'jam_mulai' => [
                'type' => 'TIME',
            ],
            'jam_selesai' => [
                'type' => 'TIME',
            ],
            'kategori' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'prioritas' => [
                'type' => 'INT',
                'constraint' => 1,
                'default' => 1, // 0-3 (Rendah-Urgent)
            ],
            'status' => [
                'type' => 'INT',
                'constraint' => 1,
                'default' => 0, // 0-3 (Belum-Tertunda)
            ],
            'rating' => [
                'type' => 'INT',
                'constraint' => 1,
                'default' => 3,
            ],
            'persentase' => [
                'type' => 'INT',
                'constraint' => 3,
                'default' => 0,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('laporan_kerja');
    }

    public function down()
    {
        $this->forge->dropTable('laporan_kerja');
    }
}

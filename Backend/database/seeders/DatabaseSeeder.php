<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Voter;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Admin::create([
            'name' => 'Administrador',
            'email' => 'admin@votacion.test',
            'password' => 'Admin123!',
        ]);

        $votantes = [
            ['12345678', 'Maria', 'Gonzalez'],
            ['23456789', 'Juan', 'Perez'],
            ['34567890', 'Ana', 'Rodriguez'],
            ['45678901', 'Carlos', 'Lopez'],
            ['56789012', 'Lucia', 'Martinez'],
            ['67890123', 'Diego', 'Sanchez'],
            ['78901234', 'Sofia', 'Fernandez'],
            ['89012345', 'Pedro', 'Diaz'],
        ];

        foreach ($votantes as [$documento, $nombre, $apellido]) {
            Voter::create([
                'documento' => $documento,
                'tipo' => 'votante',
                'nombre' => $nombre,
                'apellido' => $apellido,
                'dob' => '1990-01-01',
                'direccion' => 'Direccion de prueba',
                'telefono' => '099000000',
                'sexo' => 'M',
            ]);
        }

        $candidatos = [
            ['90123456', 'Laura', 'Ramirez'],
            ['01234567', 'Miguel', 'Torres'],
        ];

        foreach ($candidatos as [$documento, $nombre, $apellido]) {
            Voter::create([
                'documento' => $documento,
                'tipo' => 'candidato',
                'nombre' => $nombre,
                'apellido' => $apellido,
                'dob' => '1985-05-05',
                'direccion' => 'Direccion de prueba',
                'telefono' => '099000001',
                'sexo' => 'F',
            ]);
        }
    }
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('voters', function (Blueprint $table) {
            $table->id();
            $table->string('documento', 20)->unique();
            $table->enum('tipo', ['votante', 'candidato']);
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->date('dob');
            $table->string('direccion', 255);
            $table->string('telefono', 20);
            $table->enum('sexo', ['M', 'F', 'Otro']);
            $table->timestamps();

            $table->index('tipo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};

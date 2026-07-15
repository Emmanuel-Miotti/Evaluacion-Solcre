<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voter extends Model
{
    protected $fillable = [
        'documento',
        'tipo',
        'nombre',
        'apellido',
        'dob',
        'direccion',
        'telefono',
        'sexo',
    ];

    protected $casts = [ // para convertir automáticamente el campo 'dob' a un objeto de fecha
        'dob' => 'date',
    ];

    public function voteCast() // para obtener el voto emitido por el votante
    {
        return $this->hasOne(Vote::class, 'voter_id');
    }

    public function votesReceived() // para obtener los votos recibidos por el candidato
    {
        return $this->hasMany(Vote::class, 'candidate_id');
    }
}
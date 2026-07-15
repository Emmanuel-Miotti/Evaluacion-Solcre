<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = [
        'voter_id',
        'candidate_id',
        'voted_at',
    ];

    protected $casts = [ // para convertir automáticamente el campo 'voted_at' a un objeto de fecha
        'voted_at' => 'datetime',
    ];

    public function voter() // para obtener el votante que emitió el voto
    {
        return $this->belongsTo(Voter::class, 'voter_id');
    }

    public function candidate() // para obtener el candidato al que se le emitió el voto
    {
        return $this->belongsTo(Voter::class, 'candidate_id');
    }
}
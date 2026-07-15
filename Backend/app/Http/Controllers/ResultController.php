<?php

namespace App\Http\Controllers;

use App\Models\Voter;

class ResultController extends Controller
{
    public function candidatosMasVotados()
    {
        return Voter::where('tipo', 'candidato')
            ->withCount('votesReceived')
            ->orderByDesc('votes_received_count')
            ->get(['id', 'nombre', 'apellido']);
    }
}
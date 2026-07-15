<?php

namespace App\Http\Controllers;

use App\Models\Voter;
use App\Models\Vote;

class ResultController extends Controller
{
    public function candidatosMasVotados()
    {
        return Voter::where('tipo', 'candidato')
            ->withCount('votesReceived')
            ->orderByDesc('votes_received_count')
            ->get(['id', 'nombre', 'apellido']);
    }

     public function votosPorSexo()
    {
        return Vote::join('voters', 'votes.voter_id', '=', 'voters.id')
            ->selectRaw('voters.sexo, count(*) as total')
            ->groupBy('voters.sexo')
            ->get();
    }
}
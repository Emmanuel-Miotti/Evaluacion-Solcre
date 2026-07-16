<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Voter;
use App\Http\Requests\StoreVoteRequest;
use App\Services\VoteService;

class VoteController extends Controller
{
    public function __construct(private VoteService $voteService)
    {
    }

    public function store(StoreVoteRequest $request)
    {
        $data = $request->validated();

        $this->voteService->emitirVoto($data['documento'], (int) $data['candidato_id'], $request->ip());

        return response()->json([
            'message' => 'El voto se proceso correctamente.',
        ], 201);
    }

    public function index()
    {
        $candidatos = Voter::where('tipo', 'candidato')
            ->withCount('votesReceived')
            ->get(['id', 'nombre', 'apellido']);

        $maxVotos = $candidatos->max('votes_received_count');
        $liderando = $candidatos->where('votes_received_count', $maxVotos);
        $empate = $maxVotos > 0 && $liderando->count() > 1;
        $ganador = ($maxVotos > 0 && ! $empate) ? $liderando->first() : null;

        $votos = Vote::with(['voter:id,nombre,apellido', 'candidate:id,nombre,apellido'])
            ->orderByDesc('voted_at')
            ->paginate(10);

        return response()->json([
            'va_ganando' => $ganador,
            'empate' => $empate,
            'votos' => $votos,
        ]);
    }

    public function show(Vote $vote)
    {
        $vote->load(['voter', 'candidate:id,nombre,apellido']);

        return response()->json($vote);
    }
}
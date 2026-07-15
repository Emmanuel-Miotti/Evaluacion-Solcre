<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'documento' => ['required', 'string'],
            'candidato_id' => ['required', 'integer'],
        ]);

        $voter = Voter::where('documento', $data['documento'])->first();

        if (! $voter) {
            return response()->json([
                'message' => 'El documento ingresado no existe en el padron.',
            ], 404);
        }

        if (Vote::where('voter_id', $voter->id)->exists()) {
            return response()->json([
                'message' => 'Ya fue registrado un voto con anterioridad.',
            ], 409);
        }

        $candidato = Voter::where('id', $data['candidato_id'])
            ->where('tipo', 'candidato')
            ->first();

        if (! $candidato) {
            return response()->json([
                'message' => 'El candidato seleccionado no es valido.',
            ], 422);
        }

        try {
            Vote::create([
                'voter_id' => $voter->id,
                'candidate_id' => $candidato->id,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Ya fue registrado un voto con anterioridad.',
            ], 409);
        }

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
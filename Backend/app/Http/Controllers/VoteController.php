<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\RateLimiter;
use App\Http\Requests\StoreVoteRequest;

class VoteController extends Controller
{
    public function store(StoreVoteRequest  $request)
    {
        $data = $request->validated();

        // Si alguien va probando documentos al azar (no encontrados en el padron),
        // despues de 5 intentos fallidos se bloquea esa IP por 5 minutos.
        $claveIntentos = 'documento-fallido:' . $request->ip();

        if (RateLimiter::tooManyAttempts($claveIntentos, 5)) {
            $segundos = RateLimiter::availableIn($claveIntentos);
            return response()->json([
                'message' => 'Demasiados intentos con documentos invalidos. Volve a intentar en ' . ceil($segundos / 60) . ' minuto(s).',
            ], 429);
        }

        $voter = Voter::where('documento', $data['documento'])->first();

        if (! $voter) {
            RateLimiter::hit($claveIntentos, 300);

            return response()->json([
                'message' => 'El documento ingresado no existe en el padron.',
            ], 404);
        }

        // Documento real encontrado: no es alguien probando al azar, se limpia el contador.
        RateLimiter::clear($claveIntentos);

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
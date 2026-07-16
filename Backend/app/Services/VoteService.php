<?php

namespace App\Services;

use App\Exceptions\ReglaDeNegocioException;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\RateLimiter;

class VoteService
{
    
    //  registra el voto de un documento a un candidato, aplicando las reglas
    //  de negocio: rate limiting por IP, documento en el padron, voto unico
    //  y candidato valido.
     
    public function emitirVoto(string $documento, int $candidatoId, string $ip): void
    {
        // Si alguien va probando documentos al azar (no encontrados en el padron),
        // despues de 5 intentos fallidos se bloquea esa IP por 5 minutos.
        $claveIntentos = 'documento-fallido:' . $ip;

        if (RateLimiter::tooManyAttempts($claveIntentos, 5)) {
            $segundos = RateLimiter::availableIn($claveIntentos);
            throw new ReglaDeNegocioException(
                'Demasiados intentos con documentos invalidos. Volve a intentar en ' . ceil($segundos / 60) . ' minuto(s).',
                429
            );
        }

        $voter = Voter::where('documento', $documento)->first();

        if (! $voter) {
            RateLimiter::hit($claveIntentos, 300);
            throw new ReglaDeNegocioException('El documento ingresado no existe en el padron.', 404);
        }

        // Documento real encontrado: no es alguien probando al azar, se limpia el contador.
        RateLimiter::clear($claveIntentos);

        if (Vote::where('voter_id', $voter->id)->exists()) {
            throw new ReglaDeNegocioException('Ya fue registrado un voto con anterioridad.', 409);
        }

        $candidato = Voter::where('id', $candidatoId)
            ->where('tipo', 'candidato')
            ->first();

        if (! $candidato) {
            throw new ReglaDeNegocioException('El candidato seleccionado no es valido.', 422);
        }

        try {
            Vote::create([
                'voter_id' => $voter->id,
                'candidate_id' => $candidato->id,
            ]);
        } catch (QueryException) {
            // El unique de voter_id en la base atrapa la carrera de dos requests simultaneos.
            throw new ReglaDeNegocioException('Ya fue registrado un voto con anterioridad.', 409);
        }
    }
}
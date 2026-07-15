<?php

use App\Http\Controllers\ResultController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VoterController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;


// Sin throttle no habia ningun limite de intentos: 5 por minuto para frenar fuerza bruta sobre el login.
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/candidatos-mas-votados', [ResultController::class, 'candidatosMasVotados']);
    Route::get('/votos', [VoteController::class, 'index']);
    Route::get('/votos/{vote}', [VoteController::class, 'show']);
    Route::post('/votantes', [VoterController::class, 'store']);
    Route::patch('/clave', [AuthController::class, 'updatePassword']);
    Route::get('/estadisticas-sexo', [ResultController::class, 'votosPorSexo']);
});

// Rutas publicas: sin auth, pero con limite para evitar spam/DoS sobre el padron y la emision de votos.
Route::middleware('throttle:30,1')->group(function () {
    Route::get('/candidatos', [VoterController::class, 'candidatos']);
    Route::post('/votos', [VoteController::class, 'store']);
});

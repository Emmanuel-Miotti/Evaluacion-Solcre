<?php

use App\Http\Controllers\ResultController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VoterController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/candidatos-mas-votados', [ResultController::class, 'candidatosMasVotados']);
    Route::get('/votos', [VoteController::class, 'index']);
    Route::get('/votos/{vote}', [VoteController::class, 'show']);
});

Route::get('/candidatos', [VoterController::class, 'candidatos']);
Route::post('/votos', [VoteController::class, 'store']);

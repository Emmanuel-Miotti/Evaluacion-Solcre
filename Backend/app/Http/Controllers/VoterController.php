<?php

namespace App\Http\Controllers;

use App\Models\Voter;

class VoterController extends Controller
{
    public function candidatos()
    {
        return Voter::where('tipo', 'candidato')
            ->select('id', 'nombre', 'apellido')
            ->get();
    }
}
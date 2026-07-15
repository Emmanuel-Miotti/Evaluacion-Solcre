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

     public function store(Request $request)
    {
        $data = $request->validate([
            'documento' => ['required', 'string', 'unique:voters,documento'],
            'tipo' => ['required', 'in:votante,candidato'],
            'nombre' => ['required', 'string', 'max:100'],
            'apellido' => ['required', 'string', 'max:100'],
            'dob' => ['required', 'date'],
            'direccion' => ['required', 'string', 'max:255'],
            'telefono' => ['required', 'string', 'max:20'],
            'sexo' => ['required', 'in:M,F,Otro'],
        ]);

        $voter = Voter::create($data);

        return response()->json($voter, 201);
    }
}
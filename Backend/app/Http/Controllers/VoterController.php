<?php

namespace App\Http\Controllers;
use App\Models\Voter;
use Illuminate\Http\Request;

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
        'documento' => ['required', 'string', 'regex:/^[0-9]+$/', 'max:20', 'unique:voters,documento'],
        'tipo' => ['required', 'in:votante,candidato'],
        'nombre' => ['required', 'string', 'max:100', 'regex:/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/'],
        'apellido' => ['required', 'string', 'max:100', 'regex:/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/'],
        'dob' => ['required', 'date', 'before_or_equal:-18 years'],
        'direccion' => ['required', 'string', 'max:255'],
        'telefono' => ['required', 'string', 'regex:/^[0-9]+$/', 'max:20'],
        'sexo' => ['required', 'in:M,F,Otro'],
        ], [
            'documento.regex' => 'El documento solo puede contener numeros.',
            'telefono.regex' => 'El telefono solo puede contener numeros.',
            'nombre.regex' => 'El nombre solo puede contener letras.',
            'apellido.regex' => 'El apellido solo puede contener letras.',
            'dob.before_or_equal' => 'El votante debe ser mayor de 18 anos.',
        ]);

        $voter = Voter::create($data);

        return response()->json($voter, 201);
    }
}
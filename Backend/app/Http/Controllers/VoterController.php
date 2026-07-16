<?php

namespace App\Http\Controllers;
use App\Models\Voter;
use App\Http\Requests\StoreVoterRequest;

class VoterController extends Controller
{
    public function candidatos()
    {
        return Voter::where('tipo', 'candidato')
            ->select('id', 'nombre', 'apellido')
            ->get();
    }

     public function store(StoreVoterRequest  $request)
    {
        $data = $request->validated();

        $voter = Voter::create($data);

        return response()->json($voter, 201);
    }
}
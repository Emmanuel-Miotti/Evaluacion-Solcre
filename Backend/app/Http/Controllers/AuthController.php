<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\UpdatePasswordRequest;

class AuthController extends Controller
{
    public function login (LoginRequest $request)
    {
        $credentials = $request->validated();

        $admin = Admin::where('email', $credentials['email'])->first();

          if (! $admin || ! Hash::check($credentials['password'], $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no son correctas.'],
            ]);
        }

        $token = $admin->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesion cerrada']);
    }

    public function updatePassword(UpdatePasswordRequest  $request)
    {
        $data = $request->validated();

        $admin = $request->user();

        if (! Hash::check($data['clave_actual'], $admin->password)) {
            throw ValidationException::withMessages([
                'clave_actual' => ['La clave actual no es correcta.'],
            ]);
        }

        $admin->update(['password' => $data['clave_nueva']]);

        return response()->json(['message' => 'Clave actualizada correctamente.']);
    }

}
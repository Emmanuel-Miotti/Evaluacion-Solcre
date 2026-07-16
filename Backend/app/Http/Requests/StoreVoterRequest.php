<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreVoterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'documento' => ['required', 'string', 'regex:/^[0-9]+$/', 'max:20', 'unique:voters,documento'],
            'tipo' => ['required', 'in:votante,candidato'],
            'nombre' => ['required', 'string', 'max:100', 'regex:/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/'],
            'apellido' => ['required', 'string', 'max:100', 'regex:/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/'],
            'dob' => ['required', 'date', 'before_or_equal:-18 years'],
            'direccion' => ['required', 'string', 'max:255'],
            'telefono' => ['required', 'string', 'regex:/^[0-9]+$/', 'max:20'],
            'sexo' => ['required', 'in:M,F,Otro'],
        ];
    }

    public function messages(): array
    {
        return [
            'documento.regex' => 'El documento solo puede contener numeros.',
            'telefono.regex' => 'El telefono solo puede contener numeros.',
            'nombre.regex' => 'El nombre solo puede contener letras.',
            'apellido.regex' => 'El apellido solo puede contener letras.',
            'dob.before_or_equal' => 'El votante debe ser mayor de 18 anos.',
        ];
    }
}

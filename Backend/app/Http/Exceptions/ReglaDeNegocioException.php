<?php

namespace App\Exceptions;

use Exception;


    // Error de regla de negocio (documento no existe, ya voto, etc.)
    // Lleva el codigo HTTP con el que debe responder la API
class ReglaDeNegocioException extends Exception
{
    public function __construct(string $mensaje, private int $status)
    {
        parent::__construct($mensaje);
    }

    public function getStatus(): int
    {
        return $this->status;
    }
}
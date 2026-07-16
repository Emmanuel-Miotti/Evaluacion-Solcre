<?php

namespace App\Exceptions;

use Exception;

 // el status es el código de estado HTTP que se desea devolver en la respuesta
 
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

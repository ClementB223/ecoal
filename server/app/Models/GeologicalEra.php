<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeologicalEra extends Model
{
    protected $fillable = ['name'];

    public function fossils()
    {
        return $this->hasMany(Fossil::class);
    }
}

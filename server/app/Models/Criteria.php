<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    protected $table = 'criteria';

    protected $fillable = [
        'fossil_id',
        'size_cm',
        'age_myo',
        'preservation',
    ];

    protected $casts = [
        'size_cm'      => 'float',
        'age_myo'      => 'float',
        'preservation' => 'integer',
    ];

    public function fossil()
    {
        return $this->belongsTo(Fossil::class);
    }
}

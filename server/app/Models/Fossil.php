<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fossil extends Model
{
    protected $fillable = [
        'collection_id',
        'geological_era_id',
        'name',
        'description',
        'image_path',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }

    public function geologicalEra()
    {
        return $this->belongsTo(GeologicalEra::class);
    }

    public function criteria()
    {
        return $this->hasOne(Criteria::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path
            ? config('app.url') . '/' . $this->image_path
            : null;
    }
}

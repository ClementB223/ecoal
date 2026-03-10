<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GeologicalEra;

class GeologicalEraSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Paleozoic', 'Mesozoic', 'Cenozoic'] as $era) {
            GeologicalEra::create(['name' => $era]);
        }
    }
}

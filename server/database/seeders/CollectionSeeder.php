<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Collection;
use App\Models\User;

class CollectionSeeder extends Seeder
{
    public function run(): void
    {
        $alice = User::where('email', 'alice@example.com')->first();
        $bob   = User::where('email', 'bob@example.com')->first();

        Collection::create([
            'user_id'     => $alice->id,
            'name'        => "Alice's Fossil Collection",
            'description' => 'A curated collection of remarkable fossils.',
        ]);

        Collection::create([
            'user_id'     => $bob->id,
            'name'        => "Bob's Fossil Collection",
            'description' => 'A diverse collection of fossils from different eras.',
        ]);
    }
}

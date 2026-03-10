<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Alice Dupont',
            'email'    => 'alice@example.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name'     => 'Bob Martin',
            'email'    => 'bob@example.com',
            'password' => Hash::make('password'),
        ]);
    }
}

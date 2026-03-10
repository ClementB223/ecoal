<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Fossil;
use App\Models\Criteria;
use App\Models\Collection;
use App\Models\GeologicalEra;
use App\Models\User;

class FossilSeeder extends Seeder
{
    public function run(): void
    {
        $alice      = User::where('email', 'alice@example.com')->first();
        $bob        = User::where('email', 'bob@example.com')->first();
        $aliceCol   = Collection::where('user_id', $alice->id)->first();
        $bobCol     = Collection::where('user_id', $bob->id)->first();
        $paleozoic  = GeologicalEra::where('name', 'Paleozoic')->first();
        $mesozoic   = GeologicalEra::where('name', 'Mesozoic')->first();
        $cenozoic   = GeologicalEra::where('name', 'Cenozoic')->first();

        $fossils = [
            [
                'collection_id'     => $aliceCol->id,
                'geological_era_id' => $mesozoic->id,
                'name'              => 'Tyrannosaurus rex Tooth',
                'description'       => 'A well-preserved serrated tooth from the apex predator of the Cretaceous.',
                'is_public'         => true,
                'criteria'          => ['size_cm' => 22, 'age_myo' => 68, 'preservation' => 4],
            ],
            [
                'collection_id'     => $aliceCol->id,
                'geological_era_id' => $mesozoic->id,
                'name'              => 'Ammonite (Ammonites amaltheus)',
                'description'       => 'A beautifully iridescent ammonite from the Jurassic seas.',
                'is_public'         => true,
                'criteria'          => ['size_cm' => 14, 'age_myo' => 180, 'preservation' => 5],
            ],
            [
                'collection_id'     => $aliceCol->id,
                'geological_era_id' => $paleozoic->id,
                'name'              => 'Trilobite (Paradoxides gracilis)',
                'description'       => 'One of the most complete trilobite specimens from the Cambrian period.',
                'is_public'         => true,
                'criteria'          => ['size_cm' => 8, 'age_myo' => 510, 'preservation' => 5],
            ],
            [
                'collection_id'     => $aliceCol->id,
                'geological_era_id' => $paleozoic->id,
                'name'              => 'Lepidodendron Bark',
                'description'       => 'Fossilized bark from a giant clubmoss tree of Carboniferous forests.',
                'is_public'         => false,
                'criteria'          => ['size_cm' => 35, 'age_myo' => 300, 'preservation' => 3],
            ],
            [
                'collection_id'     => $bobCol->id,
                'geological_era_id' => $mesozoic->id,
                'name'              => 'Archaeopteryx lithographica',
                'description'       => 'A feathered dinosaur showing the link between dinosaurs and birds.',
                'is_public'         => true,
                'criteria'          => ['size_cm' => 50, 'age_myo' => 150, 'preservation' => 5],
            ],
            [
                'collection_id'     => $bobCol->id,
                'geological_era_id' => $cenozoic->id,
                'name'              => 'Megalodon Tooth',
                'description'       => 'A giant shark tooth from the largest predatory fish to have ever lived.',
                'is_public'         => true,
                'criteria'          => ['size_cm' => 18, 'age_myo' => 15, 'preservation' => 4],
            ],
            [
                'collection_id'     => $bobCol->id,
                'geological_era_id' => $cenozoic->id,
                'name'              => 'Woolly Mammoth Molar',
                'description'       => 'A large molar tooth from a woolly mammoth found in Siberia.',
                'is_public'         => true,
                'criteria'          => ['size_cm' => 28, 'age_myo' => 0.05, 'preservation' => 4],
            ],
        ];

        foreach ($fossils as $fossilData) {
            $criteriaData = $fossilData['criteria'];
            unset($fossilData['criteria']);

            $fossil = Fossil::create($fossilData);

            Criteria::create(array_merge(
                ['fossil_id' => $fossil->id],
                $criteriaData
            ));
        }
    }
}

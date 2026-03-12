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
        $alice = User::where('email', 'alice@example.com')->first();
        $bob = User::where('email', 'bob@example.com')->first();
        $aliceCol = Collection::where('user_id', $alice->id)->first();
        $bobCol = Collection::where('user_id', $bob->id)->first();
        $paleozoic = GeologicalEra::where('name', 'Paleozoic')->first();
        $mesozoic = GeologicalEra::where('name', 'Mesozoic')->first();
        $cenozoic = GeologicalEra::where('name', 'Cenozoic')->first();

        $fossil = Fossil::create([
            'collection_id' => $aliceCol->id,
            'geological_era_id' => $mesozoic->id,
            'name' => 'Ammonite Fossil 1',
            'description' => 'Marine ammonite fossil from Mesozoic sediments.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Ammonite%20fossil.JPG',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 10,
            'age_myo' => 170,
            'preservation' => 4,
            'continent' => 'Europe',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $bobCol->id,
            'geological_era_id' => $mesozoic->id,
            'name' => 'Ammonite Fossil 2',
            'description' => 'Marine ammonite fossil from Mesozoic sediments.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Ammonite-Fossil.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 12,
            'age_myo' => 165,
            'preservation' => 5,
            'continent' => 'Europe',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $aliceCol->id,
            'geological_era_id' => $mesozoic->id,
            'name' => 'Ammonite Fossil 3',
            'description' => 'Marine ammonite fossil from Mesozoic sediments.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/AmmoniteFossil.JPG',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 14,
            'age_myo' => 160,
            'preservation' => 4,
            'continent' => 'Europe',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $bobCol->id,
            'geological_era_id' => $mesozoic->id,
            'name' => 'Ammonite Fossil 4',
            'description' => 'Marine ammonite fossil from Mesozoic sediments.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Ammonite%20fossil%20%288606998286%29.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 16,
            'age_myo' => 155,
            'preservation' => 5,
            'continent' => 'Europe',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $bobCol->id,
            'geological_era_id' => $paleozoic->id,
            'name' => 'Trilobite Fossil 1',
            'description' => 'Paleozoic trilobite specimen with visible segmented exoskeleton.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Trilobite%20fossil.JPG',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 7,
            'age_myo' => 520,
            'preservation' => 4,
            'continent' => 'Europe',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $aliceCol->id,
            'geological_era_id' => $paleozoic->id,
            'name' => 'Trilobite Fossil 2',
            'description' => 'Paleozoic trilobite specimen with visible segmented exoskeleton.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Trilobite%20Fossil%20%2810151637926%29.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 8,
            'age_myo' => 500,
            'preservation' => 5,
            'continent' => 'Europe',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $bobCol->id,
            'geological_era_id' => $paleozoic->id,
            'name' => 'Trilobite Fossil 3',
            'description' => 'Paleozoic trilobite specimen with visible segmented exoskeleton.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Trilobites%20Fossils.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 9,
            'age_myo' => 480,
            'preservation' => 4,
            'continent' => 'Europe',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $aliceCol->id,
            'geological_era_id' => $paleozoic->id,
            'name' => 'Trilobite Fossil 4',
            'description' => 'Paleozoic trilobite specimen with visible segmented exoskeleton.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Fossil%20Trilobite%20Cast.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 10,
            'age_myo' => 460,
            'preservation' => 5,
            'continent' => 'Europe',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $aliceCol->id,
            'geological_era_id' => $cenozoic->id,
            'name' => 'Knightia eocaena (Fossil Fish)',
            'description' => 'Eocene fossil fish from the Green River Formation.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Knightia%20eocaena%20%28fossil%20fish%29%20%28Green%20River%20Formation%2C%20Lower%20Eocene%3B%20southwestern%20Wyoming%2C%20USA%29%201%20%2832941430804%29.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 14,
            'age_myo' => 56,
            'preservation' => 4,
            'continent' => 'North America',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $bobCol->id,
            'geological_era_id' => $cenozoic->id,
            'name' => 'Phareodus sp. (Fossil Fish)',
            'description' => 'Eocene fossil fish from the Green River Formation.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Phareodus%20sp.%20%28fossil%20fish%29%20%28Green%20River%20Formation%2C%20Lower%20Eocene%3B%20Wyoming%2C%20USA%29%20%2833741428175%29.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 16,
            'age_myo' => 54,
            'preservation' => 4,
            'continent' => 'North America',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $aliceCol->id,
            'geological_era_id' => $cenozoic->id,
            'name' => 'Priscacara serrata (Fossil Fish)',
            'description' => 'Eocene fossil fish from the Green River Formation.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Priscacara%20serrata%20fossil%20fish%20%28Green%20River%20Formation%2C%20Lower%20Eocene%3B%20Fossil%20Lake%20Basin%2C%20southwestern%20Wyoming%2C%20USA%29%203%20%2815335367689%29.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 18,
            'age_myo' => 52,
            'preservation' => 4,
            'continent' => 'North America',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $bobCol->id,
            'geological_era_id' => $cenozoic->id,
            'name' => 'Mioplosus labracoides (Fossil Fish)',
            'description' => 'Eocene fossil fish from the Green River Formation.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Mioplosus%20labracoides%20fossil%20fish%20%28Green%20River%20Formation%2C%20Lower%20Eocene%3B%20Fossil%20Lake%20Basin%2C%20southwestern%20Wyoming%2C%20USA%29%20%2815335281280%29.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 20,
            'age_myo' => 50,
            'preservation' => 4,
            'continent' => 'North America',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $bobCol->id,
            'geological_era_id' => $mesozoic->id,
            'name' => 'Tyrannosaurus Skull 1',
            'description' => 'Late Cretaceous tyrannosaur skull fossil.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Tyrannoskull.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 70,
            'age_myo' => 68,
            'preservation' => 5,
            'continent' => 'North America',
        ]);

        $fossil = Fossil::create([
            'collection_id' => $aliceCol->id,
            'geological_era_id' => $mesozoic->id,
            'name' => 'Tyrannosaurus Skull 2',
            'description' => 'Late Cretaceous tyrannosaur skull fossil.',
            'image_path' => 'https://commons.wikimedia.org/wiki/Special:FilePath/Tyrannosaurus-skull.jpg',
            'is_public' => true,
        ]);
        Criteria::create([
            'fossil_id' => $fossil->id,
            'size_cm' => 78,
            'age_myo' => 67,
            'preservation' => 5,
            'continent' => 'North America',
        ]);
    }
}

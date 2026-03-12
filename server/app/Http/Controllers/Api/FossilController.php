<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fossil;
use App\Models\Criteria;
use App\Models\GeologicalEra;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FossilController extends Controller
{
    private function isLocalUploadPath(?string $path): bool
    {
        return is_string($path)
            && str_starts_with($path, 'uploads/')
            && ! preg_match('/^https?:\/\//i', $path);
    }

    private function deleteLocalImage(?string $path): void
    {
        if (! $this->isLocalUploadPath($path)) {
            return;
        }

        $absolutePath = public_path($path);
        if (file_exists($absolutePath)) {
            unlink($absolutePath);
        }
    }

    private function saveUploadedImage(Request $request): ?string
    {
        if (! $request->hasFile('image')) {
            return null;
        }

        $fileName = $request->file('image')->hashName();
        $request->file('image')->move(public_path('uploads'), $fileName);

        return 'uploads/' . $fileName;
    }

    
    public function index(Request $request)
    {
        $query = Fossil::with(['collection.user:id,name', 'geologicalEra', 'criteria'])
            ->where('is_public', true);


        if ($request->filled('geological_era')) {
            $era = GeologicalEra::where('name', $request->geological_era)->first();
            if ($era) {
                $query->where('geological_era_id', $era->id);
            }
        }

        $allowedSorts = ['size_cm', 'age_myo', 'preservation'];

        if ($request->filled('sort')) {
            $sortParam = $request->sort;
            $direction = 'asc';

            if (str_starts_with($sortParam, '-')) {
                $direction = 'desc';
                $sortParam = ltrim($sortParam, '-');
            }

            if (in_array($sortParam, $allowedSorts)) {
                $query->join('criteria', 'fossils.id', '=', 'criteria.fossil_id')
                      ->orderBy('criteria.' . $sortParam, $direction)
                      ->select('fossils.*');
            }
        }

        return response()->json($query->get());
    }


    public function show($id)
    {
        $fossil = Fossil::with(['collection.user:id,name', 'geologicalEra', 'criteria'])
            ->where('is_public', true)
            ->findOrFail($id);

        return response()->json($fossil);
    }

    
    public function byCollection($collectionId)
    {
        $fossils = Fossil::with(['geologicalEra', 'criteria'])
            ->where('collection_id', $collectionId)
            ->where('is_public', true)
            ->get();

        return response()->json($fossils);
    }

    public function geologicalEras()
    {
        return response()->json(
            GeologicalEra::orderBy('name')->get()
        );
    }


    public function myFossils(Request $request)
    {
        $collection = Collection::where('user_id', $request->user()->id)->firstOrFail();

        $fossils = Fossil::with(['geologicalEra', 'criteria'])
            ->where('collection_id', $collection->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($fossils);
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'description'    => 'nullable|string',
            'geological_era' => 'required|string|exists:geological_eras,name',
            'size_cm'        => 'required|numeric|min:0',
            'age_myo'        => 'required|numeric',
            'preservation'   => 'required|integer|min:1|max:5',
            'continent'      => 'nullable|string|max:100',
            'is_public'      => 'required|boolean',
            'image'          => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'image_url'      => 'nullable|url|max:2048',
        ]);

        $collection = Collection::where('user_id', $request->user()->id)->firstOrFail();
        $era        = GeologicalEra::where('name', $request->geological_era)->firstOrFail();

        $imagePath = $request->input('image_url');
        $uploadedImagePath = $this->saveUploadedImage($request);
        if ($uploadedImagePath) {
            $imagePath = $uploadedImagePath;
        }

        $fossil = DB::transaction(function () use ($collection, $era, $request, $imagePath) {
            $fossil = Fossil::create([
                'collection_id'     => $collection->id,
                'geological_era_id' => $era->id,
                'name'              => $request->name,
                'description'       => $request->description,
                'image_path'        => $imagePath,
                'is_public'         => $request->is_public,
            ]);

            $criteriaPayload = [
                'fossil_id'    => $fossil->id,
                'size_cm'      => $request->size_cm,
                'age_myo'      => $request->age_myo,
                'preservation' => $request->preservation,
            ];
            if (Schema::hasColumn('criteria', 'continent')) {
                $criteriaPayload['continent'] = $request->input('continent', 'Unknown');
            }
            Criteria::create($criteriaPayload);

            return $fossil;
        });

        return response()->json(
            $fossil->load(['geologicalEra', 'criteria']),
            201
        );
    }


    public function update(Request $request, $id)
    {
        $collection = Collection::where('user_id', $request->user()->id)->firstOrFail();
        $fossil     = Fossil::where('collection_id', $collection->id)->findOrFail($id);

        $request->validate([
            'name'           => 'sometimes|string|max:255',
            'description'    => 'nullable|string',
            'geological_era' => 'sometimes|string|exists:geological_eras,name',
            'size_cm'        => 'sometimes|numeric|min:0',
            'age_myo'        => 'sometimes|numeric',
            'preservation'   => 'sometimes|integer|min:1|max:5',
            'continent'      => 'sometimes|string|max:100',
            'is_public'      => 'sometimes|boolean',
            'image'          => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'image_url'      => 'nullable|url|max:2048',
        ]);

        if ($request->filled('geological_era')) {
            $era = GeologicalEra::where('name', $request->geological_era)->firstOrFail();
            $fossil->geological_era_id = $era->id;
        }

        if ($request->has('image_url')) {
            $this->deleteLocalImage($fossil->image_path);
            $fossil->image_path = $request->input('image_url') ?: null;
        }

        $uploadedImagePath = $this->saveUploadedImage($request);
        if ($uploadedImagePath) {
            $this->deleteLocalImage($fossil->image_path);
            $fossil->image_path = $uploadedImagePath;
        }

        $fossil->fill($request->only('name', 'description', 'is_public'));
        $fossil->save();

        $criteriaPayload = $request->only('size_cm', 'age_myo', 'preservation');
        if (Schema::hasColumn('criteria', 'continent') && $request->has('continent')) {
            $criteriaPayload['continent'] = $request->input('continent');
        }

        $fossil->criteria()->updateOrCreate(
            ['fossil_id' => $fossil->id],
            $criteriaPayload
        );

        return response()->json($fossil->load(['geologicalEra', 'criteria']));
    }


    public function destroy(Request $request, $id)
    {
        $collection = Collection::where('user_id', $request->user()->id)->firstOrFail();
        $fossil     = Fossil::where('collection_id', $collection->id)->findOrFail($id);

        $this->deleteLocalImage($fossil->image_path);

        $fossil->delete();

        return response()->json(['message' => 'Fossil deleted successfully.']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collection;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($collections);
    }

    public function show($id)
    {
        $collection = Collection::with('user:id,name')
            ->findOrFail($id);

        return response()->json($collection);
    }
}

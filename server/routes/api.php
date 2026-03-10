<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FossilController;

/*
|--------------------------------------------------------------------------
| Public routes (no login required)
|--------------------------------------------------------------------------
*/

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Browse all public fossils (home page)
// Filter:   GET /api/fossils?geological_era=Mesozoic
// Sort:     GET /api/fossils?sort=age_myo
//           GET /api/fossils?sort=-age_myo       (descending)
//           GET /api/fossils?sort=size_cm
//           GET /api/fossils?sort=-size_cm
//           GET /api/fossils?sort=preservation
//           GET /api/fossils?sort=-preservation
// Combined: GET /api/fossils?geological_era=Paleozoic&sort=-size_cm
Route::get('/fossils',                          [FossilController::class, 'index']);
Route::get('/fossils/{id}',                     [FossilController::class, 'show']);
Route::get('/collections/{id}/fossils',         [FossilController::class, 'byCollection']);

/*
|--------------------------------------------------------------------------
| Protected routes (login required)
| Send token in header: Authorization: Bearer {token}
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Manage own fossils
    Route::get   ('/my-fossils',       [FossilController::class, 'myFossils']);
    Route::post  ('/my-fossils',       [FossilController::class, 'store']);
    Route::post  ('/my-fossils/{id}',  [FossilController::class, 'update']); // use _method=PUT
    Route::delete('/my-fossils/{id}',  [FossilController::class, 'destroy']);
});

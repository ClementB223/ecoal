<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FossilController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/fossils',                          [FossilController::class, 'index']);
Route::get('/fossils/{id}',                     [FossilController::class, 'show']);
Route::get('/collections/{id}/fossils',         [FossilController::class, 'byCollection']);



Route::middleware('auth:sanctum')->group(function () {

    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::get   ('/my-fossils',       [FossilController::class, 'myFossils']);
    Route::post  ('/my-fossils',       [FossilController::class, 'store']);
    Route::post  ('/my-fossils/{id}',  [FossilController::class, 'update']); 
    Route::delete('/my-fossils/{id}',  [FossilController::class, 'destroy']);
});

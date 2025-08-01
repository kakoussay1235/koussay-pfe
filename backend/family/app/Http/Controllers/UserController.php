<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //
   public function register(Request $request)
{
    try{
            $validated = $request->validate([
        'fullName' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6|confirmed',
    ]);

    $user = User::create([
        'fullName' => $validated['fullName'],
        'email' => $validated['email'],
        'password' => bcrypt($validated['password']),
    ]);
    return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);

    }

    catch(\Exception $e){
        return response()->json(['error' => 'Registration failed', 'message' => $e->getMessage()], 400);
    }

}
}

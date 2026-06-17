package com.passwordlesslogin.api;

import com.passwordlesslogin.model.ApiResponse;
import com.passwordlesslogin.model.LoginRequest;
import com.passwordlesslogin.model.RegisterRequest;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {

    @POST("api/register")
    Call<ApiResponse> register(@Body RegisterRequest request);

    @POST("api/login")
    Call<ApiResponse> login(@Body LoginRequest request);
}

package com.passwordlesslogin.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.passwordlesslogin.api.ApiService;
import com.passwordlesslogin.api.RetrofitClient;
import com.passwordlesslogin.model.RegisterRequest;
import com.passwordlesslogin.model.ApiResponse;
import com.passwordlesslogin.R;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {

    private TextInputEditText etName, etDob, etEmail;
    private MaterialButton btnRegister;
    private TextView tvLogin, tvStatus;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        apiService = RetrofitClient.getApiService();

        etName = findViewById(R.id.etName);
        etDob = findViewById(R.id.etDob);
        etEmail = findViewById(R.id.etEmail);
        btnRegister = findViewById(R.id.btnRegister);
        tvLogin = findViewById(R.id.tvLogin);
        tvStatus = findViewById(R.id.tvStatus);

        btnRegister.setOnClickListener(v -> registerUser());

        tvLogin.setOnClickListener(v -> {
            startActivity(new Intent(RegisterActivity.this, LoginActivity.class));
            finish();
        });
    }

    private void registerUser() {
        String name = etName.getText().toString().trim();
        String dob = etDob.getText().toString().trim();
        String email = etEmail.getText().toString().trim();

        if (name.isEmpty() || dob.isEmpty() || email.isEmpty()) {
            Toast.makeText(this, "Completa todos los campos", Toast.LENGTH_SHORT).show();
            return;
        }

        btnRegister.setEnabled(false);
        btnRegister.setText("Registrando...");
        tvStatus.setVisibility(android.view.View.GONE);

        RegisterRequest request = new RegisterRequest(name, dob, email);
        apiService.register(request).enqueue(new Callback<ApiResponse>() {
            @Override
            public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                btnRegister.setEnabled(true);
                btnRegister.setText("Registrarse");
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    tvStatus.setText("Registro exitoso. Revisa tu correo para obtener la contraseña.");
                    tvStatus.setTextColor(0xFF4CAF50);
                    tvStatus.setVisibility(android.view.View.VISIBLE);
                } else {
                    String msg = response.body() != null ? response.body().getMessage() : "Error al registrar";
                    tvStatus.setText(msg);
                    tvStatus.setTextColor(0xFFF44336);
                    tvStatus.setVisibility(android.view.View.VISIBLE);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse> call, Throwable t) {
                btnRegister.setEnabled(true);
                btnRegister.setText("Registrarse");
                tvStatus.setText("Error de conexión: " + t.getMessage());
                tvStatus.setTextColor(0xFFF44336);
                tvStatus.setVisibility(android.view.View.VISIBLE);
            }
        });
    }
}

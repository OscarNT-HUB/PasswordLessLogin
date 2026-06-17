package com.passwordlesslogin.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;
import com.passwordlesslogin.R;

public class HomeActivity extends AppCompatActivity {

    private TextView tvWelcomeName, tvUserEmail;
    private MaterialButton btnLogout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        tvWelcomeName = findViewById(R.id.tvWelcomeName);
        tvUserEmail = findViewById(R.id.tvUserEmail);
        btnLogout = findViewById(R.id.btnLogout);

        String name = getIntent().getStringExtra("name");
        String email = getIntent().getStringExtra("email");

        tvWelcomeName.setText(name != null ? name : "Usuario");
        tvUserEmail.setText(email != null ? email : "");

        btnLogout.setOnClickListener(v -> {
            Intent intent = new Intent(HomeActivity.this, LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();
        });
    }
}

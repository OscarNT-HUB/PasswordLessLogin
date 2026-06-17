package com.passwordlesslogin.model;

public class RegisterRequest {
    private String name;
    private String dob;
    private String email;

    public RegisterRequest(String name, String dob, String email) {
        this.name = name;
        this.dob = dob;
        this.email = email;
    }
}

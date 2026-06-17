package com.passwordlesslogin.model;

import com.google.gson.annotations.SerializedName;

public class ApiResponse {
    private boolean success;
    private String message;
    private String token;
    private UserData user;

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getToken() { return token; }
    public UserData getUser() { return user; }

    public static class UserData {
        private String name;
        private String email;
        private String dob;

        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getDob() { return dob; }
    }
}

package com.narvee.request.dto;

import lombok.Data;

@Data
public class LoginRequest {
	
	private String usernameOrEmail;
	private String password;
	
	
}

package com.mythiccompanions.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST) // 400
public class InvalidItemTargetException extends RuntimeException {
    public InvalidItemTargetException(String message) {
        super(message);
    }
}
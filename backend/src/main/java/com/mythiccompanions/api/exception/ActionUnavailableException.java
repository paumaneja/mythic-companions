package com.mythiccompanions.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ActionUnavailableException extends RuntimeException {
    public ActionUnavailableException(String message) {
        super(message);
    }
}
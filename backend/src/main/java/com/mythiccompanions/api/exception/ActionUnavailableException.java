package com.mythiccompanions.api.exception;


public class ActionUnavailableException extends RuntimeException {
    public ActionUnavailableException(String message) {
        super(message);
    }
}
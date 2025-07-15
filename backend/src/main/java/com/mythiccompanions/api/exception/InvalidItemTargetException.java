package com.mythiccompanions.api.exception;


public class InvalidItemTargetException extends RuntimeException {
    public InvalidItemTargetException(String message) {
        super(message);
    }
}
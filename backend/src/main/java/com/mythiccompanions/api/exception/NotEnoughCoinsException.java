package com.mythiccompanions.api.exception;

public class NotEnoughCoinsException extends RuntimeException {
    public NotEnoughCoinsException(String message) {
        super(message);
    }
}
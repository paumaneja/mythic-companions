package com.mythiccompanions.api.exception;


public class IncompatibleWeaponException extends RuntimeException {
    public IncompatibleWeaponException(String message) {
        super(message);
    }
}
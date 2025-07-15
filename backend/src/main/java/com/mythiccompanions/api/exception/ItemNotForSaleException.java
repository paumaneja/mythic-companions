package com.mythiccompanions.api.exception;

public class ItemNotForSaleException extends RuntimeException {
    public ItemNotForSaleException(String message) {
        super(message);
    }
}
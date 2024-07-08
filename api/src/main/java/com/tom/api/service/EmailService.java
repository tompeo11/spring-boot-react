package com.tom.api.service;

public interface EmailService {
    public void sendSimpleMessage (String to, String subject, String text);
}

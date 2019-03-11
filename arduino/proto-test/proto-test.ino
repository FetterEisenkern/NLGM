#include "Arduino.h"

// PROTOCOL (DO NOT CHANGE)
#define PROTO_BAUD 115200
#define PROTO_DELIMITER ';'
#define PROTO_EOF "\r\n"
#define PROTO_SYN "SYN"
#define PROTO_ACK "ACK"
#define PROTO_FIN "FIN"

// Connected hardware
#define SIGNAL_PIN A2

// Max points in buffer
#define MAX_POINTS 100    

// Max read time in microseconds
#define MAX_READ_TIME 8000 

// Measurement point
typedef struct {
    float volts;
    unsigned long us;
} point_t;

point_t* points;
int count = 0;

void clear_memory()
{
    count = 0;
    if (points) delete points;
    points = new point_t[MAX_POINTS];
}

void read_signal()
{
    auto start = micros();
    for (auto now = start; now - start < MAX_READ_TIME; now = micros()) {
        points[count].volts = analogRead(SIGNAL_PIN);
        points[count].us = now - start;
        count++;
        if (count >= MAX_POINTS) break;
        delayMicroseconds(1);
    }
}

void send_to_app()
{
    Serial.print(PROTO_ACK);
    Serial.print(PROTO_EOF);
    for (auto idx = 0; idx < count; ++idx) {
        Serial.print(points[idx].volts);
        Serial.print(PROTO_DELIMITER);
        Serial.print(points[idx].us);
        Serial.print(PROTO_EOF);
    }
    Serial.print(PROTO_FIN);
    Serial.print(PROTO_EOF);
}

void setup() {
    Serial.begin(PROTO_BAUD);
    pinMode(BUTTON_PIN, INPUT);
    pinMode(SIGNAL_PIN, INPUT);
}

void loop() {
    if (Serial.readString().equals(PROTO_SYN)) {
        clear_memory();
        read_signal();
        send_to_app();
    }
}

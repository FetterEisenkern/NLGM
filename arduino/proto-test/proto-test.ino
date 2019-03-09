#include "Arduino.h"

#define PROTO_BAUD 115200
#define PROTO_DELIMITER ';'
#define PROTO_EOF "\r\n"
#define PROTO_SYN "SYN"
#define PROTO_ACK "ACK"
#define PROTO_FIN "FIN"

#define BUTTON_PIN 2
#define SIGNAL_PIN A2

#define MAX_POINTS 100      // max points in buffer
#define DEBOUNCE_TIME 200   // in milliseconds
#define MAX_READ_TIME 8000  // in microseconds

typedef struct {
    float volts;
    unsigned long us;
} point_t;

point_t* points;
int count = 0;

unsigned long prevTime = 0;

const float level = 0.00489;
const float offset = 3.3;
const float amplification = 106;

void clear_memory()
{
    count = 0;
    if (points) delete points;
    points = new point_t[MAX_POINTS];
}

void read_signal()
{
    auto start = micros();
    for (auto now = start; now - start < 8000; now = micros()) {
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
        //auto result = ((points[idx].volts * level - offset) / amplification) * 1000;
        //Serial.print(result);
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
    prevTime = millis();
}

void loop() {
    auto data = Serial.readString();
    if (data.equals(PROTO_SYN)) {
        clear_memory();
        read_signal();
        send_to_app();
    }
}

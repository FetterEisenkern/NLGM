#define PROTO_BAUD 19200
#define PROTO_DELIMITER ','
#define PROTO_EOF "\r\n"
#define PROTO_ACK "ACK"
#define PROTO_FIN "FIN"

#define BUTTON_PIN 2
#define SIGNAL_PIN A2

#define MAX_POINTS 100          // max points in buffer
#define DEBOUNCE_TIME 200   // in milliseconds
#define MAX_READ_TIME 8000  // in microseconds

typedef struct {
    float voltage;
    unsigned long us;
} point_t;

point_t* points;
int count = 0;

unsigned long prevTime = 0;

const float level = 0.00489;
const float offset = 3.3;
const float amplification = 106;

inline void reset()
{
    count = 0;
    if (points) delete points;
    points = new point_t[MAX_POINTS];
}

void input()
{
    auto start = micros();
    auto last = start;
    for (auto now = start; now - start < 8000; now = micros()) {
        points[count].voltage = analogRead(SIGNAL_PIN);
        points[count].us = now - last;
        last = now;
        count++;
        if (count >= MAX_POINTS) break;
        delayMicroseconds(1);
    }
}

void output()
{
    //Serial.println(count);
    Serial.print(PROTO_ACK);
    Serial.print(PROTO_EOF);
    for (auto idx = 0; idx < count; ++idx) {
        //auto result = ((points[idx].voltage * level - offset) / amplification) * 1000;
        //Serial.print(result);
        Serial.print(points[idx].voltage);
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
    if (digitalRead(BUTTON_PIN) == HIGH) {
        auto curTime = millis();
        if (curTime - prevTime > DEBOUNCE_TIME) {
            reset();
            input();
            output();
        }
        prevTime = curTime;
    }
}


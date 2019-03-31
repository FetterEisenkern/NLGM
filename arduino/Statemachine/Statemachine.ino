#define AnalogInputPin A0
#define ImpulseOutputPin 8
#define Offset 1
#define Amplification 10
#define level 0.00489
#define MaxElements 100
#define SampleInterval 500

float aryVoltage[MaxElements];
float aryTime[MaxElements];
String startCommand;

int index = 0;
unsigned long startMillis;
byte State;

void setup() {
  Serial.begin(115200);
  pinMode(AnalogInputPin, INPUT);
  pinMode(ImpulseOutputPin, OUTPUT);
  State = 1;
}

void loop() {
 
  switch (State) {
    case 1:
      if (WaitForStart())
      {
        State = 2;
      }
      break;
    case 2:
      EmitPulse();
      State = 3;
      break;
    case 3:
      SampleSignal();
      State = 4;
      break;
    case 4:
      PrintOut();
      State = 5;
      break;
    case 5:
      ResetAll();
      break;
  }
}


// State 1
bool WaitForStart()
{
  while (Serial.available()) {
  }
  startCommand = Serial.readString();
  if (startCommand == "SYN")
  {
    Serial.println("ACK");
    return true;
  }
  return false;
}

// Function 1 in State 3
void EmitPulse() {
  digitalWrite(ImpulseOutputPin, HIGH); // Activate impulse
  startMillis = millis();              // Store time
}

// Function 2 in State 3
void SampleSignal() {
  while (millis() - startMillis < SampleInterval) // Sample signal
  {
    aryVoltage[index] = analogRead(AnalogInputPin); // Store voltage
    aryTime[index] = millis() - startMillis;        // Store time
    index++;
    delay(20);
  }
}

void PrintOut() {
  for (int i = 0; i < index; i++) // Send edited voltage and time to PC
  {
    aryVoltage[i] = ((aryVoltage[i] * level - Offset) / Amplification) * 1000;
    Serial.print(aryVoltage[i], 3); // Send original voltage value
    Serial.print(";");
    Serial.print(aryTime[i]); // Send time value
    Serial.println();
  }
  Serial.println("FIN");
}

void ResetAll() {
  digitalWrite(ImpulseOutputPin, LOW); // Deactivate impulse
  index = 0;
  startMillis = 0;
  State = 1;
  Serial.end(); // Disconnect
  delay(5000);
  Serial.begin(115200); // Establish connection
}

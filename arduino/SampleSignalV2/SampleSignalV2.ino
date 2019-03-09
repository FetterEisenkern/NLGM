
byte PS_16 = (1 << ADPS2);
byte PS_128 = (1 << ADPS2) | (1 << ADPS1) | (1 << ADPS0);

#define AnalogInputPin A2
#define DigitalOutputPin 8
#define Offset 3
#define Amplification 34

#define thresholdupperlimit 610
#define thresholdlowerlimit 620

float level = 0.00489;
float aryVolt[50];
float aryMS[50];
char receive;

bool routine = false;
bool output = false;
bool convert = false;

int aryVal[50];
long aryTim[50];

int requestvalue = 0;
//int samplevalue = 0;

byte zerovolt = 0;
byte count = 1;
byte amount = 0;

unsigned long startMicros;
unsigned long currentMicros1;
unsigned long currentMicros2;

void Request();
void Sample();
void Transform();
void PrintOut();
void ResetAll();

void setup() {
  ADCSRA &= ~ PS_128;
  ADCSRA |= PS_16;
  Serial.begin(115200);
  pinMode(AnalogInputPin, INPUT);
  pinMode(DigitalOutputPin, OUTPUT);
  digitalWrite(DigitalOutputPin, HIGH);
}

void loop() {

  if (Serial.available() > 0) {
    receive = Serial.read();
    if (receive == 's')
    {
      Serial.println('a');
      while (!routine)
      {
        Request();
        PrintOut();
      }

      /*
      if (convert)
       {
          Transform();
       }*/


      if (routine)
      {
        PrintOut();
        ResetAll();
      }

    }
  }
}

void Request()
{
  int mult = 0;
  while (!routine) {
    requestvalue = analogRead(AnalogInputPin);
    Serial.println(requestvalue);

    if (requestvalue < thresholdlowerlimit || requestvalue > thresholdupperlimit)
    {
      startMicros = micros();
      aryVal[0] = requestvalue;
      aryTim[0] = micros() - startMicros;
      while (micros() - startMicros < 4000)
      {
        int  samplevalue = analogRead(AnalogInputPin);
        if (micros() - startMicros > 350 + mult && micros() - startMicros < 400 + mult)
        {
          // 500, 800, mul200 / W 300, 500, 200 /  0, 400, 400

          aryVal[count] = samplevalue;
          aryTim[count] = micros() - startMicros;
          count++;
          mult += 400;
        }

      }
      routine = true;
    }
  }
  output = true;
}


void PrintOut()
{
 
  Serial.println("OUTPUT");
  for (int i = 0; i < count; i++)
  {
    aryVolt[i] = ((aryVal[i] * level - Offset)/Amplification)*1000;
    Serial.print(aryVolt[i], 3);
    Serial.print(" [mV], ");
    aryMS[i] = aryTim[i];
    aryMS[i] = aryMS[i]/1000;
    Serial.print(aryMS[i], 3);
    Serial.print(" [us]");
    Serial.println();
  }
 
}

void ResetAll()
{
  receive = 'e';
  output = false;
  convert = false;
  requestvalue = 0;
  //samplevalue = 0;
  count = 1;
  routine = false;
  Serial.println('f');
}



/*void Sample()
{

  int mult = 0;
  Serial.println("SAMPLE");
  while (micros() - startMicros < 4000)
  {
    int  samplevalue = analogRead(AnalogInputPin);
    if (micros() - startMicros > 500 + mult && micros() - startMicros < 800 + mult)
    {
      aryVal[count] = samplevalue;
      //Serial.println(samplevalue);
      aryTim[count] = micros() - startMicros;
      // Serial.println(aryTim[count]);
      // Serial.println("----------------------");

      count++;
      mult += 200;
    }

  }

  output = true;
  startprog = false;*/

/*}
  void Transform()
  {
  Serial.println("IN");
  delay(1119);
  for (int i = 0; i < count; i++)
  {
    float fvoltage = getValue(ary[i], ';', 0).toFloat();
    fvoltage = (fvoltage * (5 / 1023)) - Offset;
    String svoltage = (String) fvoltage;
    String period = getValue(ary[i], ';', 1);
    ary[i] = svoltage + ";" + period;
  }
  Serial.println("OUT");
  delay(1119);
  convert = false;
  output = true;
  }*/

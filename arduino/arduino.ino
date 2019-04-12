/*  Arduino Automatic Watering System for plant pot
    Author: Victor Montero and Pablo Rodriguez
    Description: The program controls a water pump based on information
    provided by a soil humidity sensor and a luminosity sensor.
    If humidity  is low, the pump will activate, but if luminosity is high, the pump
    will not activate, even if humidity is low.

*/

#define FIRST_PIN 2
#define ZERO 48
#define LENGTH 4

#if LENGTH > 10
#error "Length is higher than available"
#endif

void setup() {
  // initialize serial communication:
  Serial.begin(115200);
  // initialize all pins:
  for (int thisPin = FIRST_PIN; thisPin < FIRST_PIN + LENGTH; thisPin++) {
    pinMode(thisPin, OUTPUT);
  }
}

void tick(int pin){
  digitalWrite(pin+FIRST_PIN, HIGH);
  delay(500);
  digitalWrite(pin+FIRST_PIN, LOW);
  delay(500);
  Serial.print("p:" );
  Serial.println(pin+FIRST_PIN);
}

void loop() {
  // read the sensor:
  if (Serial.available() > 0) {
    int inByte = Serial.read();
    if(inByte >= ZERO && inByte <= ZERO+LENGTH-1){
      tick(inByte-ZERO);
    }
    else if(inByte == 't'){
      Serial.print("t:");
      Serial.println(analogRead(A0));
    }
    else if(inByte == 'a'){
      Serial.print("a:");
      Serial.println(analogRead(A1));
    }
    else if(inByte == 'b'){
      Serial.print("b:");
      Serial.println(analogRead(A2));
    }
    else if(inByte == 'c'){
      Serial.print("c:");
      Serial.println(analogRead(A3));
    }
    else if(inByte == 'd'){
      Serial.print("d:");
      Serial.println(analogRead(A4));
    }
  }

}

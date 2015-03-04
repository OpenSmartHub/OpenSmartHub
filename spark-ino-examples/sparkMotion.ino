int motion = D0;
// int light = A4;
// int temp = A2;

// This routine runs only once upon reset
void setup() {
  pinMode(motion, INPUT);
//   pinMode(light, INPUT);
//  pinMode(temp, INPUT);
}

// This routine gets called repeatedly, like once every 5-15 milliseconds.
// Spark firmware interleaves background CPU activity associated with WiFi + Cloud activity with your code. 
// Make sure none of your code delays or blocks for too long (like more than 5 seconds), or weird things can happen.
void loop() {
    int motionValue = digitalRead(motion);
    Spark.publish("motion", String(motionValue), 60, PRIVATE);

    // Spark.publish("light", String(analogRead(light)));
    // int tempValue = analogRead(temp);
    // Spark.publish("temp", String(tempValue));
    delay(1000);
}
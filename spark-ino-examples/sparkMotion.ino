int motion = D0;
int led = D1;

// This routine runs only once upon reset
void setup() {
  pinMode(motion, INPUT);
  pinMode(led, OUTPUT);
}

// This routine gets called repeatedly, like once every 5-15 milliseconds.
// Spark firmware interleaves background CPU activity associated with WiFi + Cloud activity with your code. 
// Make sure none of your code delays or blocks for too long (like more than 5 seconds), or weird things can happen.
void loop() {
    int motionValue = digitalRead(motion);
    if(motionValue == HIGH)
    {
        Spark.publish("motion", "triggeredOn", 60, PRIVATE);//String(motionValue), 60, PRIVATE);
        digitalWrite(led, HIGH);
        delay(5000); // stops it from triggering repetitively from the same trigger
    }else{
        Spark.publish("motion", "triggeredOff", 60, PRIVATE);
        digitalWrite(led, LOW);
    }
    delay(1000);
}
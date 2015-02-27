int button = D1; // pin 1 is where the Button Signal is located
int led = D5; // for feedback on the actual button device in case you are trying to troubleshoot the demo
bool lit = false;

// This routine runs only once upon reset
void setup() {
  pinMode(button, INPUT);
  pinMode(led, OUTPUT);
}

// This routine gets called repeatedly, like once every 5-15 milliseconds.
// Spark firmware interleaves background CPU activity associated with WiFi + Cloud activity with your code. 
// Make sure none of your code delays or blocks for too long (like more than 5 seconds), or weird things can happen.
void loop() {
    if(digitalRead(button) == 0)
    {
        lit = !lit;
        if(lit)
        {
            Spark.publish("button", "triggeredOn", 60, PRIVATE); // this will send the event to anyone subscribed to it
            digitalWrite(led, HIGH);
        }else{
            Spark.publish("button", "triggeredOff", 60, PRIVATE);
            digitalWrite(led, LOW);
        }
        delay(500); // debounce
    }
}
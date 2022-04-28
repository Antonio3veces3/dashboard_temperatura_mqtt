#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <DHT_U.h>
#include <cstring>

DHT dht( 4, DHT11 );

int temperatura;
String data;
const char* ssid = "tony";
const char* password = "tonyholamundo";

const char* mqtt_server = "test.mosquitto.org";

WiFiClient espClient;

PubSubClient client(espClient);

unsigned long lastMsg = 0;

#define MSG_BUFFER_SIZE (50)

char msg[MSG_BUFFER_SIZE];

int value = 0;

void setup_wifi() {
  delay(10);
  // Empezamos por conectarnos a una red WiFi
  Serial.println();
  Serial.print("Conectado a ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Dirección IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensaje del tema [");
  Serial.print(topic);
  Serial.print("] : ");
  
  String message;
  for (int i = 0; i < length; i++) {
    message = message + (char) payload[i];
  }
  Serial.print(message);
  Serial.println();
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Intentando la conexión MQTT...");
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("conectado");
      client.subscribe("carg/temperatura");
    } else {
      Serial.print("fallido, rc =");
      Serial.print(client.state());
      Serial.println(" inténtalo de nuevo en 5 segundos");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  pinMode(4, OUTPUT);
  dht.begin();
}

void loop() {
  if (!client.connected()) {  
    reconnect();
  }
  client.loop();
  temperatura = dht.readTemperature();
  data = String(temperatura);
  char dataChar[3];
  strcpy(dataChar, data.c_str());
  client.publish("carg/temperatura", dataChar);
  delay(5000);
}

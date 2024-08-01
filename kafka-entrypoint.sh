#!/bin/bash

# Start Kafka
/opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties &

# Wait for Kafka to start
sleep 10

# Create the topic
/opt/kafka/bin/kafka-topics.sh --create --if-not-exists --topic zap-events --bootstrap-server localhost:9092

# Keep the container running
tail -f /dev/null
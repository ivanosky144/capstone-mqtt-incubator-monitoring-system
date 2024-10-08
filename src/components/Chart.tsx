import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import mqtt, { MqttClient } from 'mqtt';
import { Inter } from 'next/font/google';

// Load the Inter font
const inter = Inter({
    weight: ['500'],
    subsets: ['latin']
});

// Dynamically load the chart to avoid server-side rendering issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SensorData {
  sensor1: {
    temperature: number;
    humidity: number;
  };
  sensor2: {
    temperature: number;
    humidity: number;
  };
  sensor3: {
    temperature: number;
    humidity: number;
  };
  sensor4: {
    temperature: number;
    humidity: number;
  };
}

const SensorChart: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [temperatureSeries, setTemperatureSeries] = useState<{
    name: string;
    data: { x: number; y: number }[];
  }[]>([
    { name: 'Sensor 1', data: [] },
    { name: 'Sensor 2', data: [] },
    { name: 'Sensor 3', data: [] },
    { name: 'Sensor 4', data: [] },
  ]);

  const [humiditySeries, setHumiditySeries] = useState<{
    name: string;
    data: { x: number; y: number }[];
  }[]>([
    { name: 'Sensor 1', data: [] },
    { name: 'Sensor 2', data: [] },
    { name: 'Sensor 3', data: [] },
    { name: 'Sensor 4', data: [] },
  ]);

  const mqttBrokerUrl = 'wss://test.mosquitto.org:8081';
  const [loading, setLoading] = useState(true);
  const topic = "sensor/dht";

  useEffect(() => {
    const client: MqttClient = mqtt.connect(mqttBrokerUrl);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      setLoading(false);
      client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error('Failed to subscribe to topic', err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });

    const sensorKeys: (keyof SensorData)[] = ['sensor1', 'sensor2', 'sensor3', 'sensor4'];

    client.on('message', (topic, message, packet) => {
      console.log(`Retained message: ${packet.retain}`);
      try {
        const parsedData: SensorData = JSON.parse(message.toString());
        console.log('Received message:', parsedData);
        setSensorData(parsedData);
        
        const timestamp = new Date().getTime(); // Current timestamp
        
        // Update temperature series data for each sensor
        setTemperatureSeries(prevSeries => {
          const updatedSeries = prevSeries.map((sensor, index) => {
            const sensorKey = sensorKeys[index]; // Use the mapping array
            // Create a new entry for the current timestamp and sensor's temperature
            const newDataPoint = { x: timestamp, y: parsedData[sensorKey].temperature };
            // Limit the data to the last 10 entries
            return {
              ...sensor,
              data: [...sensor.data, newDataPoint].slice(-10),
            };
          });
          return updatedSeries;
        });

        // Update humidity series data for each sensor
        setHumiditySeries(prevSeries => {
          const updatedSeries = prevSeries.map((sensor, index) => {
            const sensorKey = sensorKeys[index]; // Use the mapping array
            // Create a new entry for the current timestamp and sensor's humidity
            const newDataPoint = { x: timestamp, y: parsedData[sensorKey].humidity };
            // Limit the data to the last 10 entries
            return {
              ...sensor,
              data: [...sensor.data, newDataPoint].slice(-10),
            };
          });
          return updatedSeries;
        });
    
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });
    
    client.on('error', (error) => {
      console.log(`MQTT Client error: ${error}`);
    });

    client.on('close', () => {
      console.log('Disconnecting from MQTT server');
    });

    return () => {
      client.end();
    };
  }, []);

  // Chart options for temperature
  const temperatureOptions: ApexOptions = {
    chart: {
      id: 'temperature-realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Temperature Data Chart',
      align: 'left',
      style: {
        fontFamily: inter.style.fontFamily,
        fontSize: '24px',
        fontWeight: '800',
        color: '#4E3A9D'
      },
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime',
      range: 50000, // Adjust the range to show about 50 seconds of data
      labels: {
        formatter: (value: string) => new Date(Number(value)).toLocaleTimeString(),
        style: {
          fontFamily: inter.style.fontFamily,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 60,
      title: {
        text: 'Temperature (°C)',
        style: {
          fontFamily: inter.style.fontFamily,
          fontSize: '14px',
        },
      }
    },
    legend: {
      show: true,
      fontFamily: inter.style.fontFamily,
      fontSize: '12px',
    },
  };

  // Chart options for humidity
  const humidityOptions: ApexOptions = {
    chart: {
      id: 'humidity-realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Humidity Data Chart',
      align: 'left',
      style: {
        fontFamily: inter.style.fontFamily,
        fontSize: '24px',
        fontWeight: '800',
        color: '#4E3A9D'
      },
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime',
      range: 50000, // Adjust the range to show about 50 seconds of data
      labels: {
        formatter: (value: string) => new Date(Number(value)).toLocaleTimeString(),
        style: {
          fontFamily: inter.style.fontFamily,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      max: 100,
      title: {
        text: 'Humidity (%)',
        style: {
          fontFamily: inter.style.fontFamily,
          fontSize: '14px',
        },
      }
    },
    legend: {
      show: true,
      fontFamily: inter.style.fontFamily,
      fontSize: '12px',
    },
  };

  return (
    <div className='p-5 w-[90%] flex-4 bg-ultralight_purple'>
      {loading ? (
        <div>
          <p>Connecting to MQTT broker...</p>
        </div>
      ) : sensorData ? (
        <div className='flex flex-col gap-5'>
          <div id='temperature-chart' className='bg-white p-2 rounded-lg'>
            <ReactApexChart options={temperatureOptions} series={temperatureSeries} type="line" height={350} />
          </div>
          <div id='humidity-chart' className='bg-white p-2 rounded-lg'>
            <ReactApexChart options={humidityOptions} series={humiditySeries} type="line" height={350} />
          </div>
        </div>
      ) : (
        <p>Waiting for sensor data...</p>
      )}
    </div>
  );
};

export default SensorChart;

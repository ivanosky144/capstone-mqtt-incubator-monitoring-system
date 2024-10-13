import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import mqtt, { MqttClient } from 'mqtt';
import { Inter } from 'next/font/google';
import axios from 'axios';

const inter = Inter({
    weight: ['500'],
    subsets: ['latin']
});

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

  const mqttBrokerUrl = process.env.NEXT_PUBLIC_MQTT_CONNECTION || "mosquitto.org";
  const [loading, setLoading] = useState(true);
  const topic = "sensor/dht";

  useEffect(() => {
    const connectToMQTT = async () => {
      const client: MqttClient = mqtt.connect(mqttBrokerUrl);

      await new Promise<void>((resolve, reject) => {
        client.on("connect", () => {
          console.log("[message]: Connected to MQTT broker");
          setLoading(false);
          resolve();
        });

        client.on("error", (err) => {
          console.log("[err]: Error connecting to MQTT broker");
          reject(err);
        });
      });

      await new Promise<void>((resolve, reject) => {
        client.subscribe(topic, { qos: 1 }, (err) => {
          if (err) {
            console.log("[err]: Error subscribing to MQTT topic");
            reject(err);
          } else {
            console.log("[message]: Subscribed to topic");
            resolve();
          }
        });
      });

      const sensorKeys: (keyof SensorData)[] = ['sensor1', 'sensor2', 'sensor3', 'sensor4'];

      client.on("message", (topic, message, packet) => {
        console.log(`[message]: Retained message ${packet.retain}`);

        try {
          const parsedData: SensorData = JSON.parse(message.toString());
          
          console.log(`[message]: Received message ${parsedData}`);
          setSensorData(parsedData);
          
          const timestamp = new Date().getTime();

          const sensorReadings = {
            sensor1: { temperature: parsedData.sensor1.temperature, humidity: parsedData.sensor1.humidity },
            sensor2: { temperature: parsedData.sensor2.temperature, humidity: parsedData.sensor2.humidity },
            sensor3: { temperature: parsedData.sensor3.temperature, humidity: parsedData.sensor3.humidity },
            sensor4: { temperature: parsedData.sensor4.temperature, humidity: parsedData.sensor4.humidity },
          };


          setTemperatureSeries((prevSeries) => {
            const updateSeries = prevSeries.map((sensor, index) => {
              const sensorKey = sensorKeys[index];
              const newDataPoint = { x: timestamp, y: parsedData[sensorKey].temperature};
              return {
                ...sensor,
                data: [...sensor.data, newDataPoint].slice(-10)
              }
            });
            return updateSeries;
          });

          setHumiditySeries((prevSeries) => {
            const updateSeries = prevSeries.map((sensor, index) => {
              const sensorKey = sensorKeys[index];
              const newDataPoint = { x: timestamp, y: parsedData[sensorKey].humidity};
              return {
                ...sensor,
                data: [...sensor.data, newDataPoint].slice(-10)
              }
            });
            return updateSeries;
          });
    
        } catch (err) {
          console.log("[err]: Error parsing MQTT message");
        }
      });
    };

    connectToMQTT();

    return () => {
      const client: MqttClient = mqtt.connect(mqttBrokerUrl);
      client.end();
    };
  }, []);

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
      range: 50000, 
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
      range: 50000, 
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

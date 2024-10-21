import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import mqtt, { MqttClient } from 'mqtt';
import { Inter } from 'next/font/google';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const inter = Inter({
  weight: ['500'],
  subsets: ['latin'],
});

interface SensorData {
  temperature: number
  humidity: number
}

const SensorChart: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [temperatureSeries, setTemperatureSeries] = useState([
    { name: 'Sensor 1', data: [] as { x: number; y: number }[] },
    { name: 'Sensor 2', data: [] as { x: number; y: number }[] },
    { name: 'Sensor 3', data: [] as { x: number; y: number }[] },
    { name: 'Sensor 4', data: [] as { x: number; y: number }[] },
  ]);
  const [humiditySeries, setHumiditySeries] = useState([
    { name: 'Sensor 1', data: [] as { x: number; y: number }[] },
    { name: 'Sensor 2', data: [] as { x: number; y: number }[] },
    { name: 'Sensor 3', data: [] as { x: number; y: number }[] },
    { name: 'Sensor 4', data: [] as { x: number; y: number }[] },
  ]);

  const [loading, setLoading] = useState(true);
  const [temperatureRange, setTemperatureRange] = useState({ min: 0, max: 50 });
  const [humidityRange, setHumidityRange] = useState({ min: 0, max: 100 });

  const mqttBrokerUrl = 'wss://test.mosquitto.org:8081';
  const topic = 'sensor/dht';
  let client: MqttClient | null = null;

  useEffect(() => {
    client = mqtt.connect(mqttBrokerUrl);

    client.on('connect', () => {
      console.log('[MQTT] Connected to broker');
      setLoading(false);
      client?.subscribe(topic, { qos: 1 }, (err) => {
        if (err) console.error('[MQTT] Subscription error:', err);
        else console.log(`[MQTT] Subscribed to topic: ${topic}`);
      });
    });

    client.on('error', (err) => console.error('[MQTT] Error:', err));
    client.on('offline', () => console.warn('[MQTT] Client offline'));
    client.on('reconnect', () => console.log('[MQTT] Reconnecting...'));

    client.on('message', (receivedTopic, message) => {
      console.log(`[MQTT] Message received on ${receivedTopic}:`, message.toString());
    
      try {
        const parsedData: SensorData[] = JSON.parse(message.toString());
        setSensorData(parsedData);
        updateChartSeries(parsedData);

        saveSensorData(parsedData);
      } catch (err) {
        console.error('[MQTT] Message parse error:', err);
      }
    });
    

    return () => {
      client?.end();
    };
  }, []);

  const updateChartSeries = (data: SensorData[]) => {
    const timestamp = new Date().getTime();
  
    setTemperatureSeries((prevSeries) =>
      prevSeries.map((sensor, index) => ({
        ...sensor,
        data: [...sensor.data, { x: timestamp, y: data[index]?.temperature }].slice(-10),
      }))
    );
  
    setHumiditySeries((prevSeries) =>
      prevSeries.map((sensor, index) => ({
        ...sensor,
        data: [...sensor.data, { x: timestamp, y: data[index]?.humidity }].slice(-10),
      }))
    );
  };
  

  const saveSensorData = async (data: SensorData[]) => {
    const payload: any = {
      user_id: '670dfb6eccaff40c3f3b713e',
    };

    for (let i = 1; i < 5; i++) {
      payload.sensor_id = i;
      
      if (data[i]) {
        payload.temperature = data[i]?.temperature;
        payload.humidity = data[i]?.humidity;
      }

      const response = await fetch('/api/sensor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(payload)
      });
    }
  };

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
      min: temperatureRange.min,
      max: temperatureRange.max,
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
      min: humidityRange.min,
      max: humidityRange.max,
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
    <div className="p-5 w-[90%] flex-4 bg-ultralight_purple">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
        </div>
      ) : sensorData ? (
        <div className="flex flex-col gap-5">
          <div className="flex gap-4 justify-between">
            <div className="flex flex-col gap-3 w-[15%]">
              <h2>Set Temperature Range</h2>
              <div className="flex flex-col">
                <label>Min</label>
                <select onChange={(e) => setTemperatureRange({ ...temperatureRange, min: Number(e.target.value)})} value={temperatureRange.min}>
                  {[...Array(50).keys()].map((n) => (
                    <option key={n} value={n+1}>{n+1}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label>Max</label>
                <select onChange={(e) => setTemperatureRange({ ...temperatureRange, max: Number(e.target.value)})} value={temperatureRange.max}>
                  {[...Array(50).keys()].map((n) => (
                    <option key={n} value={n+1}>{n+1}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg w-[85%]">
              <ReactApexChart options={temperatureOptions} series={temperatureSeries} type="line" height={350} />
            </div>
          </div>
          <div className="flex gap-4 justify-between">
            <div className="flex flex-col gap-3 w-[15%]">
              <h2>Set Humidity Range</h2>
              <div className="flex flex-col">
                <label>Min</label>
                <select onChange={(e) => setHumidityRange({ ...humidityRange, min: Number(e.target.value)})} value={humidityRange.min}>
                  {[...Array(100).keys()].map((n) => (
                    <option key={n} value={n+1}>{n+1}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label>Max</label>
                <select onChange={(e) => setHumidityRange({ ...humidityRange, max: Number(e.target.value)})} value={humidityRange.max}>
                  {[...Array(100).keys()].map((n) => (
                    <option key={n} value={n+1}>{n+1}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg w-[85%]">
              <ReactApexChart options={humidityOptions} series={humiditySeries} type="line" height={350} />
            </div>
          </div>
        </div>
      ) : (
        <p>Waiting for sensor data...</p>
      )}
    </div>
  );
};

export default SensorChart;

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import mqtt, { MqttClient } from 'mqtt';
import { Inter } from 'next/font/google';
import { ToastContainer, toast } from 'react-toastify';
import useAuthStore from '@/store/auth_store';
import 'react-toastify/dist/ReactToastify.css';


const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const inter = Inter({
  weight: ['500'],
  subsets: ['latin'],
});


interface SensorData {
  temperature: number
  humidity: number
}
interface MQTTMessage {
  analog: SensorData[]
  i2c: SensorData
}

const SensorChart: React.FC = () => {
  const [analogSensorsData, setAnalogSensorsData] = useState<SensorData[]>([]);
  const [temperatureSeries, setTemperatureSeries] = useState([
    { name: 'Sensor Analog 1', data: [] as { x: number; y: number }[] },
    { name: 'Sensor Analog 2', data: [] as { x: number; y: number }[] },
    { name: 'Sensor Analog 3', data: [] as { x: number; y: number }[] },
    { name: 'Sensor Analog 4', data: [] as { x: number; y: number }[] },
    { name: 'Sensor I2C', data: [] as { x: number; y: number }[] },
  ]);
  const [humiditySeries, setHumiditySeries] = useState([
    { name: 'Sensor Analog 1', data: [] as { x: number; y: number }[] },
    { name: 'Sensor Analog 2', data: [] as { x: number; y: number }[] },
    { name: 'Sensor Analog 3', data: [] as { x: number; y: number }[] },
    { name: 'Sensor Analog 4', data: [] as { x: number; y: number }[] },
    { name: 'Sensor I2C', data: [] as { x: number; y: number }[] },
  ]);

  const [loading, setLoading] = useState(true);
  const [temperatureRange, setTemperatureRange] = useState({ min: 0, max: 50 });
  const [humidityRange, setHumidityRange] = useState({ min: 0, max: 100 });
  const userInfo = useAuthStore(state => state.user);

  const mqttBrokerUrl = 'wss://test.mosquitto.org:8081';
  const topic = 'sensor/dht';
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    clientRef.current = mqtt.connect(mqttBrokerUrl);

    clientRef.current.on('connect', () => {
      console.log('[MQTT] Connected to broker');
      setLoading(false);
      clientRef.current?.subscribe(topic, { qos: 1 }, (err) => {
        if (err) console.error('[MQTT] Subscription error:', err);
        else console.log(`[MQTT] Subscribed to topic: ${topic}`);
      });
    });

    clientRef.current.on('error', (err) => console.error('[MQTT] Error:', err));
    clientRef.current.on('offline', () => console.warn('[MQTT] Client offline'));
    clientRef.current.on('reconnect', () => console.log('[MQTT] Reconnecting...'));

    clientRef.current.on('message', (receivedTopic, message) => {
      console.log(`[MQTT] Message received on ${receivedTopic}:`, message.toString());
      try {
        const parsedData: MQTTMessage = JSON.parse(message.toString());
        setAnalogSensorsData(parsedData.analog);
        updateChartSeries(parsedData.analog, parsedData.i2c);
        saveSensorData(parsedData);
      } catch (err) {
        console.error('[MQTT] Message parse error:', err);
      }
    });

    return () => {
      clientRef.current?.end();
    };
  }, []);

  const updateChartSeries = (analogData: SensorData[], i2cData: SensorData) => {
    const timestamp = new Date().getTime();
    
    if (i2cData && i2cData.temperature > 38) {
      toast.warning('I2C Sensor temperature exceeded 38°C!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    analogData.forEach((sensorData, index) => {
      if (sensorData.temperature > 38) {
        toast.warning(`Sensor ${index + 1} temperature exceeded 38°C!`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
  
    setTemperatureSeries((prevSeries) =>
      prevSeries.map((sensor, index) => {
        if (index < 4) {
          return {
            ...sensor,
            data: [...sensor.data, { x: timestamp, y: analogData[index]?.temperature }].slice(-50),
          };
        } else {
          return {
            ...sensor,
            data: [...sensor.data, { x: timestamp, y: i2cData?.temperature }].slice(-50),
          };
        }
      })
    );
  
    setHumiditySeries((prevSeries) =>
      prevSeries.map((sensor, index) => {
        if (index < 4) {
          return {
            ...sensor,
            data: [...sensor.data, { x: timestamp, y: analogData[index]?.humidity }].slice(-50),
          };
        } else {
          return {
            ...sensor,
            data: [...sensor.data, { x: timestamp, y: i2cData?.humidity }].slice(-50),
          };
        }
      })
    );
  };
  

  const saveSensorData = async (message: MQTTMessage) => {
    const payload: any = {
      user_id: String(userInfo?.id),
    };
    console.log(message)
    const data = [
      ...message.analog,
      {
        temperature: message.i2c.temperature,
        humidity: message.i2c.humidity
      }
    ]
    console.log(data)

    if (message) {
      for (let i = 0; i <= 4; i++) {
        payload.sensor_id = i+1;
        
        if (data[i]) {
          payload.temperature = data[i]?.temperature;
          payload.humidity = data[i]?.humidity;
        }
  
        await fetch('/api/sensor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(payload)
        });
      }

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
      <ToastContainer />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
        </div>
      ) : analogSensorsData ? (
        <div className="flex flex-col gap-5">
          <div className="flex gap-4 justify-between">
            <div className="flex flex-col gap-3 w-[15%] bg-gray-50 rounded-lg p-2">
              <h2>Set Temperature Range</h2>
              <div className="flex flex-col">
                <label>Min</label>
                <select
                  onChange={(e) => setTemperatureRange({ ...temperatureRange, min: Number(e.target.value) })}
                  value={temperatureRange.min}
                  className="bg-purple-600 text-white rounded-lg p-1 appearance-none"
                  style={{ backgroundColor: '#6B46C1', color: 'white' }}
                >
                  {[...Array(50).keys()].map((n) => (
                    <option
                      key={n}
                      value={n + 1}
                      style={{ backgroundColor: '#6B46C1', color: 'white' }} 
                    >
                      {n + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label>Max</label>
                <select
                    onChange={(e) => setTemperatureRange({ ...temperatureRange, max: Number(e.target.value) })}
                    value={temperatureRange.max}
                    className="bg-purple-600 text-white rounded-lg p-1 appearance-none"
                    style={{ backgroundColor: '#6B46C1', color: 'white' }}
                >
                  {[...Array(50).keys()].map((n) => (
                    <option
                      key={n}
                      value={n + 1}
                      style={{ backgroundColor: '#6B46C1', color: 'white' }} 
                    >
                      {n + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg w-[85%]">
              <ReactApexChart options={temperatureOptions} series={temperatureSeries} type="line" height={350} />
            </div>
          </div>
          <div className="flex gap-4 justify-between">
            <div className="flex flex-col gap-3 w-[15%] bg-gray-50 rounded-lg p-2">
              <h2>Set Humidity Range</h2>
              <div className="flex flex-col">
                <label>Min</label>
                  <select
                    onChange={(e) => setHumidityRange({ ...humidityRange, min: Number(e.target.value) })}
                    value={humidityRange.min}
                    className="bg-purple-600 text-white rounded-lg p-1 appearance-none"
                    style={{ backgroundColor: '#6B46C1', color: 'white' }}
                  >
                    {[...Array(100).keys()].map((n) => (
                      <option
                        key={n}
                        value={n + 1}
                        style={{ backgroundColor: '#6B46C1', color: 'white' }} 
                      >
                        {n + 1}
                      </option>
                    ))}
                  </select>
              </div>
              <div className="flex flex-col">
                <label>Max</label>
                <select
                    onChange={(e) => setHumidityRange({ ...humidityRange, max: Number(e.target.value) })}
                    value={humidityRange.max}
                    className="bg-purple-600 text-white rounded-lg p-1 appearance-none"
                    style={{ backgroundColor: '#6B46C1', color: 'white' }}
                >
                  {[...Array(100).keys()].map((n) => (
                    <option
                      key={n}
                      value={n + 1}
                      style={{ backgroundColor: '#6B46C1', color: 'white' }} 
                    >
                      {n + 1}
                    </option>
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

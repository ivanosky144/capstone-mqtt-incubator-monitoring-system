import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import mqtt, { MqttClient } from 'mqtt';
import { Inter } from 'next/font/google';
import { ToastContainer, toast } from 'react-toastify';
import useAuthStore from '@/store/auth_store';
import 'react-toastify/dist/ReactToastify.css';
import { FaTemperatureHigh } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";



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
  sound_level: any
}

const SensorChart: React.FC = () => {
  const [analogSensorsData, setAnalogSensorsData] = useState<SensorData[]>([]);
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

  const [temperatureRange, setTemperatureRange] = useState({ min: 0, max: 50 });
  const [humidityRange, setHumidityRange] = useState({ min: 0, max: 100 });
  const [i2cSensorData, setI2CSensorData] = useState<SensorData>();
  const userInfo = useAuthStore(state => state.user);

  const initialTemperatureOptions: ApexOptions = {
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

  const initialHumidityOptions: ApexOptions = {
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


  const [temperatureOptions, setTemperatureOptions] = useState(initialTemperatureOptions);
  const [humidityOptions, setHumidityOptions] = useState(initialHumidityOptions);

  const mqttBrokerUrl = 'wss://test.mosquitto.org:8081';
  const topic = 'sensor/dht';
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {

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
    
    clientRef.current = mqtt.connect(mqttBrokerUrl);

    clientRef.current.on('connect', () => {
      console.log('[MQTT] Connected to broker');
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
        setI2CSensorData(parsedData.i2c);
        updateChartSeries(parsedData);
        saveSensorData(parsedData);
      } catch (err) {
        console.error('[MQTT] Message parse error:', err);
      }
    });

    return () => {
      clientRef.current?.end();
    };
  }, [userInfo?.id]);

  const playNotificationSound = () => {
    const audio = new Audio('/assets/notification-sound.mp3');
    audio.play().catch((err) => console.error('Error playing sound ', err));
  };
  

  const updateChartSeries = (sensorData: MQTTMessage) => {
    const timestamp = new Date().getTime();
    const { sound_level: soundLevel, i2c: i2cData, analog: analogData } = sensorData;

    // Show warning toasts if conditions are met
    if (soundLevel > 27) {
      toast.warning('Bayi sedang menangis!!!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      playNotificationSound();
    }

    const isTemperatureHigh = (i2cData?.temperature > 38) || analogData.some(sensorData => sensorData.temperature > 38);
  
    if (isTemperatureHigh) {
      toast.warning('Bahaya, suhu terlalu tinggi! Jangan digunakan terlebih dahulu!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      playNotificationSound();
    }
  
    // Update Temperature Series
    setTemperatureSeries((prevSeries) => {
      const isFirstData = prevSeries[0].data.length === 0;
  
      // Set initial x-axis range on first data point
      if (isFirstData) {
        console.log(timestamp)
        setTemperatureOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            min: timestamp,
            max: timestamp + 60000, // 1 minute window, adjust as needed
          },
        }));
      }
  
      return prevSeries.map((sensor, index) => {
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
      });
    });
  
    // Update Humidity Series
    setHumiditySeries((prevSeries) => {
      const isFirstData = prevSeries[0].data.length === 0;
  
      // Set initial x-axis range on first data point
      if (isFirstData) {
        setHumidityOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            min: timestamp,
            max: timestamp + 60000, // 1 minute window, adjust as needed
          },
        }));
      }
  
      return prevSeries.map((sensor, index) => {
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
      });
    });
  };
  
  


  return (
    <div className="md:p-5 w-[90%] flex-4 bg-ultralight_purple w-screen p-6 md:h-[100%] h-[85%] md:mt-20">
      <div className="flex gap-5 justify-center w-[100%] my-5">
        <div className="flex bg-white rounded-md py-5 px-6 md:w-[30%] justify-between w-[50%] items-center">
          <FaTemperatureHigh className='text-dark_purple text-7xl md:text-6xl'/>
          <div className="flex flex-col">
            <p className='text-purple font-semibold text-xl'>Temperature</p>
            <p className='md:text-5xl font-semibold text-4xl'>{analogSensorsData.length ? analogSensorsData[3]?.temperature : 0} °C</p>
          </div>
        </div>
        <div className="flex bg-white rounded-md py-5 px-6 gap-5 md:w-[30%] justify-between w-[50%] items-center">
          <IoIosWater className='text-dark_purple text-8xl'/>
          <div className="flex flex-col">
            <p className='text-purple font-semibold text-xl'>Humidity</p>
            <p className='md:text-5xl font-semibold text-4xl text-center'>{analogSensorsData.length ? analogSensorsData[3]?.humidity : 0} %</p>
          </div>
        </div>
      </div>
      
      <ToastContainer />
      {analogSensorsData ? (
        <div className="flex flex-col gap-5">
          <div className="flex gap-4 justify-between flex-col md:flex-row">
            <div className="flex flex-col gap-3 md:w-[12%] bg-gray-50 rounded-lg p-2 w-[100%]">
              <h2 className='text-sm'>Set Temperature Range</h2>
              <div className="flex md:flex-col gap-3 w-[60%] flex-row justify-between md:w-[100%]">
                <div className="flex md:flex-col flex-row gap-5 md:gap-2 items-center w-[30%] mr-2 md:w-[100%]">
                  <label className='text-xs w-[10%] md:w-[100%]'>Min</label>
                  <select
                    onChange={(e) => setTemperatureRange({ ...temperatureRange, min: Number(e.target.value) })}
                    value={temperatureRange.min}
                    className="bg-purple-600 text-white rounded-lg p-1 md:p-2 appearance-none w-[100%] text-xs text-center md:text-start"
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
                <div className="flex md:flex-col flex-row gap-5 items-center w-[30%] mr-2 md:w-[100%] md:gap-2">
                  <label className='text-xs w-[10%] md:w-[100%]'>Max</label>
                  <select
                      onChange={(e) => setTemperatureRange({ ...temperatureRange, max: Number(e.target.value) })}
                      value={temperatureRange.max}
                      className="bg-purple-600 text-white rounded-lg p-1 md:p-2 appearance-none w-[100%] text-xs text-center md:text-start"
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
            </div>
            <div className="bg-white px-20 py-6 rounded-lg md:w-[85%] w-[100%]">
              <ReactApexChart options={initialTemperatureOptions} series={temperatureSeries} type="line" height={360} />
            </div>
          </div>
          <div className="flex gap-4 justify-between flex-col md:flex-row">
            <div className="flex flex-col gap-3 md:w-[12%] bg-gray-50 rounded-lg p-2 w-[100%]">
              <h2 className='text-sm'>Set Humidity Range</h2>
              <div className="flex md:flex-col gap-3 w-[60%] flex-row justify-between md:w-[100%]">
                <div className="flex md:flex-col flex-row gap-5 items-center w-[30%] mr-2 md:w-[100%] md:gap-2">
                  <label className='text-xs w-[10%] md:w-[100%]'>Min</label>
                  <select
                    onChange={(e) => setHumidityRange({ ...humidityRange, min: Number(e.target.value) })}
                    value={humidityRange.min}
                    className="bg-purple-600 text-white rounded-lg p-1 md:p-2 appearance-none w-[100%] text-xs text-center md:text-start"
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
                <div className="flex md:flex-col flex-row gap-5 md:gap-2 items-center w-[30%] mr-2 md:w-[100%]">
                  <label className='text-xs w-[10%] md:w-[100%]'>Max</label>
                  <select
                      onChange={(e) => setHumidityRange({ ...humidityRange, max: Number(e.target.value) })}
                      value={humidityRange.max}
                      className="bg-purple-600 text-white rounded-lg p-1 md:p-2 appearance-none w-[100%] text-xs text-center md:text-start"
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
            </div>
            <div className="bg-white px-20 py-6 rounded-lg md:w-[85%] w-[100%]">
              <ReactApexChart options={initialHumidityOptions} series={humiditySeries} type="line" height={360} />
            </div>
          </div>
        </div>
      ) : (
        <p>Menunggu data dari sensor...</p>
      )}
    </div>
  );
};

export default SensorChart;

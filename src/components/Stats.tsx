import { ChangeEvent, useEffect, useState } from "react";

export default function Stats() {

    const [timeRange, setTimeRange] = useState({ start: "", end: "" });
    const [sensorData, setSensorData] = useState<any[]>([]);

    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTimeRange((prev) => ( {...prev, [name]: value } ));
    };

    const getDataHistories = async () => {
        try {
            const response = await fetch(`/api/sensor?user_id=${"670dfb6eccaff40c3f3b713e"}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', 
                },
            });
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            console.log(data)
            setSensorData(data);
            
        } catch(error) {
            console
        }
    };

    useEffect(() => {
        getDataHistories();
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <div className="p-3 rounded-lg bg-white">
                <div className="flex flex-col gap-1">
                    <p className="font-semibold text-lg text-center">Sensor 1 Stats</p>
                    <div className="flex justify-between">
                        <input 
                            type="datetime-local" 
                            name="start"
                            value={timeRange.start}
                            onChange={handleTimeChange}
                            className="p-1 text-sm rounded-lg bg-ultralight_purple text-dark_purple font-semibold w-[40%]"
                        />
                        <p className="text-dark_purple font-extrabold text-xl">—</p>
                        <input 
                            type="datetime-local" 
                            name="end"
                            value={timeRange.end}
                            onChange={handleTimeChange}
                            className="p-1 text-sm rounded-lg bg-ultralight_purple text-dark_purple font-semibold w-[40%]"
                        />                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-2 items-center m-2">
                                <p className="text-sm">Min Temp</p>
                                <p>25°C</p>
                            </div>
                            <div className="flex flex-col gap-2 items-center m-2">
                                <p className="text-sm">Max Temp</p>
                                <p>25°C</p>
                            </div>
                            <div className="flex flex-col gap-2 items-center m-2">
                                <p className="text-sm">Average Temp</p>
                                <p>25°C</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-2 items-center m-2">
                                <p className="text-sm">Min Hum</p>
                                <p>67%</p>
                            </div>
                            <div className="flex flex-col gap-2 items-center m-2">
                                <p className="text-sm">Max Hum</p>
                                <p>78%</p>
                            </div>
                            <div className="flex flex-col gap-2 items-center m-2">
                                <p className="text-sm">Average Hum</p>
                                <p>72%</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
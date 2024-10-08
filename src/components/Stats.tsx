

export default function Stats() {
    return (
        <div className="flex flex-col gap-3">
            <div className="p-3 rounded-lg bg-white">
                <div className="flex flex-col gap-1">
                    <p className="font-semibold text-lg text-center">Sensor 1 Stats</p>
                    <p className="p-1 text-sm rounded-lg bg-ultralight_purple text-dark_purple font-semibold w-[40%]">07 - 10 - 2024</p>
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
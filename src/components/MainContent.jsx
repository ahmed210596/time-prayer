import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from "./Prayer";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
const PRAYER_DETAILS = [
  { name: "الفجر", key: "Fajr", image: "https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921" },
  { name: "الظهر", key: "Dhuhr", image: "https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf" },
  { name: "العصر", key: "Asr", image: "https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf" },
  { name: "المغرب", key: "Maghrib", image: "https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5" },
  { name: "العشاء", key: "Isha", image: "https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d" },
];

const MainComponent = () => {
  
  const [city, setCity] = useState('tunis');
  const [prayerTimes, setPrayerTimes] = useState({});
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [remainingTime, setRemainingTime] = useState("");

  const fetchPrayerTimes = async (selectedCity) => {
    try {
      const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=tn&city=${selectedCity}`);
      setPrayerTimes(response.data.data.timings);
      console.log(response.data.data.timings)
      console.log(dayjs())
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };

 
 

  const calculateRemainingTime = () => {
    const now = dayjs();
    setCurrentTime(now);

    let nextPrayerTime = null;
    let nextPrayerName = "";

    // Determine the next prayer time
    for (const prayer of PRAYER_DETAILS) {
        const prayerTime = dayjs(`${now.format('YYYY-MM-DD')} ${prayerTimes[prayer.key]}`);
        if (prayerTime.isAfter(now)) {
            nextPrayerTime = prayerTime;
            nextPrayerName = prayer.name;
            break;
        }
    }

    if (!nextPrayerTime) {
        // If no prayer time is found for today, set to the first prayer of the next day
        const tomorrow = now.add(1, 'day');
        nextPrayerTime = dayjs(`${tomorrow.format('YYYY-MM-DD')} ${prayerTimes[PRAYER_DETAILS[0].key]}`);
        nextPrayerName = PRAYER_DETAILS[0].name;
    }

    // Calculate the difference in milliseconds
    const diff = nextPrayerTime.diff(now);

    // Calculate hours, minutes, and seconds from the difference
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Format the remaining time as HH:mm:ss
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    setRemainingTime(`${formattedTime} (${nextPrayerName})`);
};


  useEffect(() => {
    fetchPrayerTimes(city);
  }, [city]);

  useEffect(() => {
    calculateRemainingTime();
    const interval = setInterval(calculateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <>
      <Grid container>
        <Grid xs={6}>
          <div>
            <h2>{currentTime.format('hh:mm A dddd، D MMMM YYYY (UTC Z)')}</h2>
            <h1>الوقت في {city}</h1>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h2>متبقي حتى صلاة</h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: "25px", opacity: "0.1" }} />
      <Stack direction="row" justifyContent="space-around" sx={{ marginTop: "50px" }}>
        {PRAYER_DETAILS.map(prayer => (
          <Prayer key={prayer.key} name={prayer.name} time={prayerTimes[prayer.key]} image={prayer.image} />
        ))}
      </Stack>
      <Stack direction="row" justifyContent="center" sx={{ marginTop: "40px" }}>
        <FormControl sx={{ width: "20%" }}>
          <InputLabel id="city-select-label"><span style={{ color: "black" }}>المدينة</span></InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            value={city}
            label="City"
            onChange={handleChange}
          >
            <MenuItem value="tunis">Tunis</MenuItem>
            <MenuItem value="sousse">Sousse</MenuItem>
            {/* Add more cities as needed */}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
};

export default MainComponent;
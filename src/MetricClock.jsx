import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import "./MetricClock.css";

// Define getMetricTime before using it
const getMetricTime = (tz) => {
  const now = moment().tz(tz); // Use selected timezone
  const hours = now.hour();
  const minutes = now.minute();
  const seconds = now.second();

  const NEW_HOURS_PER_DAY = 25;
  const NEW_MINUTES_PER_HOUR = 100;
  const NEW_SECONDS_PER_MINUTE = 100;
  const SECONDS_PER_DAY = 24 * 60 * 60;

  // Calculate total traditional seconds
  const total_seconds = hours * 3600 + minutes * 60 + seconds;

  // Conversion rate between traditional seconds and new seconds
  const conversion_rate =
    (NEW_HOURS_PER_DAY * NEW_MINUTES_PER_HOUR * NEW_SECONDS_PER_MINUTE) /
    SECONDS_PER_DAY;

  // Calculate new time in new seconds
  const new_seconds = total_seconds * conversion_rate;

  // Convert new seconds to new time units
  const new_hours = Math.floor(new_seconds / (NEW_MINUTES_PER_HOUR * NEW_SECONDS_PER_MINUTE));
  const new_minutes = Math.floor((new_seconds % (NEW_MINUTES_PER_HOUR * NEW_SECONDS_PER_MINUTE)) / NEW_SECONDS_PER_MINUTE);
  const new_seconds_display = Math.floor(new_seconds % NEW_SECONDS_PER_MINUTE);

  return { new_hours, new_minutes, new_seconds_display };
};

const MetricClock = () => {
  const [time, setTime] = useState(getMetricTime("US/Central"));
  const [timezone, setTimezone] = useState("US/Central");

  const timezoneList = moment.tz.names();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getMetricTime(timezone));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timezone]);

  const handleTimezoneChange = (event) => {
    setTimezone(event.target.value);
  };

  return (
    <div className="metric-clock">
      <div className="digital-clock">
        {`${time.new_hours.toString().padStart(2, "0")}:${time.new_minutes.toString().padStart(2, "0")}:${time.new_seconds_display.toString().padStart(2, "0")}`}
      </div>
      <div className="explanation">
        <p><strong style={{ fontSize: "24px" }}>Metric Time:</strong></p>
        <ul>
          <li>- 25 hours per day</li>
          <li>- 100 minutes per hour</li>
          <li>- 100 seconds per minute</li>
        </ul>
      </div>
      <div className="timezone-selector">
        <label htmlFor="timezone-select">Select Timezone: </label>
        <select id="timezone-select" value={timezone} onChange={handleTimezoneChange}>
          {timezoneList.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MetricClock;

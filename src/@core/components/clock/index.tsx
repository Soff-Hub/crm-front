import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import IconifyIcon from "../icon";
import { timeToString } from "src/@core/utils/time-to-string";

const Clock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [hours, setHours] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateTime = () => {
    const newTime = new Date();
    setTime(newTime);
    setHours(newTime.getHours());
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      <IconifyIcon style={{ fontSize: '18px' }} icon={`noto-v1:${timeToString(hours)}-oclock`} />
      <Typography variant='body2'>{time.toLocaleTimeString()}</Typography>
    </Box>
  );
};

export default Clock;

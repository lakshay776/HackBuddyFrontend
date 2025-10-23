import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ targetDate, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          months,
          days,
          hours,
          minutes,
          seconds
        });
      } else {
        setTimeLeft({
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div className={`flex items-center space-x-1 text-sm ${className}`}>
      <Clock className="w-4 h-4" />
      <div className="flex space-x-2">
        {timeLeft.months > 0 && (
          <div className="text-center">
            <div className="font-bold text-lg">{formatNumber(timeLeft.months)}</div>
            <div className="text-xs text-gray-500">Months</div>
          </div>
        )}
        <div className="text-center">
          <div className="font-bold text-lg">{formatNumber(timeLeft.days)}</div>
          <div className="text-xs text-gray-500">Days</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">{formatNumber(timeLeft.hours)}</div>
          <div className="text-xs text-gray-500">Hours</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">{formatNumber(timeLeft.minutes)}</div>
          <div className="text-xs text-gray-500">Minutes</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">{formatNumber(timeLeft.seconds)}</div>
          <div className="text-xs text-gray-500">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;


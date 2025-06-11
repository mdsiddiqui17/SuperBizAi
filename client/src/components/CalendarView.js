import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ posts, onSelectDate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tileContent = ({ date }) => {
    const hasPost = posts.some(post =>
      new Date(post.scheduledTime).toDateString() === date.toDateString()
    );
    return hasPost ? <span style={{ color: 'red' }}>•</span> : null;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

  return (
    <div className="calendar-view">
      <Calendar
        onChange={handleDateClick}
        value={selectedDate}
        tileContent={tileContent}
      />
    </div>
  );
}

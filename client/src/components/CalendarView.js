import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import default styles
import './CalendarView.css'; // Import custom styles

// Setup the localizer by providing the required date-fns locales
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ posts, onSelectDate, onSelectPost, onReschedule }) => {
  // Event mapping and styling logic will go here in subsequent steps

  // Map posts to events for react-big-calendar
  const events = React.useMemo(() => {
    if (!posts || !Array.isArray(posts)) {
      return [];
    }
    return posts.reduce((acc, post) => {
      if (!post || !post.scheduledTime || !post.contentType) {
        // Skip posts that are missing essential data
        console.warn('Skipping post due to missing scheduledTime or contentType:', post);
        return acc;
      }
      const scheduledDate = new Date(post.scheduledTime);
      // Check if the date is valid
      if (isNaN(scheduledDate.getTime())) {
        console.warn('Skipping post due to invalid scheduledTime:', post);
        return acc;
      }

      acc.push({
        title: post.contentType, // This will be the displayed text on the event
        start: scheduledDate,
        end: scheduledDate, // Events are treated as points in time on the calendar
        allDay: false, // Assuming posts are not all-day events unless specified
        tooltipContent: `Content: ${post.contentText || 'N/A'}
Platforms: ${Array.isArray(post.platform) ? post.platform.join(', ') : (post.platform || 'N/A')}`,
        originalPost: post, // Store the original post data for callbacks
      });
      return acc;
    }, []);
  }, [posts]); // Recalculate events only when posts array changes

  const contentTypeColors = {
    Post: '#a7d1f5', // Soft blue
    Video: '#a7f5d1', // Soft green
    Custom: '#f5a7d1', // Soft pink
    Image: '#f5d1a7', // Soft orange (added for 'Image' contentType)
    default: '#d3d3d3', // Default soft gray for other types
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

    const eventStartDate = new Date(event.start);
    eventStartDate.setHours(0, 0, 0, 0); // Normalize event start date

    const postType = event.originalPost?.contentType || 'default';
    const backgroundColor = contentTypeColors[postType] || contentTypeColors.default;

    const style = {
      backgroundColor,
      borderRadius: '5px', // Slightly rounded corners
      opacity: 0.8,
      color: '#333', // Darker text for better readability on pastel backgrounds
      border: '1px solid #ccc', // Softer border
      display: 'block',
      padding: '2px 5px', // Some padding
      fontSize: '0.85em', // Slightly smaller font
    };

    // Optionally, change style if event is selected
    if (isSelected) {
      style.opacity = 1;
      style.fontWeight = 'bold';
      style.boxShadow = '0px 0px 5px rgba(0,0,0,0.3)';
    }

    // Highlight if the event is for today
    if (eventStartDate.getTime() === today.getTime()) {
      style.border = `2px solid #ffcc00`; // A distinct yellow border
      style.boxShadow = `${style.boxShadow ? style.boxShadow + ', ' : ''}0 0 10px #ffcc00`; // Add or append glow
    }

    const tooltipText = event.tooltipContent || event.title; // Use the new tooltipContent if available

    return {
      style,
      title: tooltipText, // Attempt to add title attribute this way
    };
  };

  const handleEventDrop = ({ event, start, end }) => {
    if (event.originalPost && event.originalPost._id) {
      if (onReschedule) {
        onReschedule(event.originalPost._id, start); // Pass postId and the new start Date
      }
    } else {
      console.warn('Dropped event is missing originalPost data or _id.');
    }
  };

  if (!posts) {
    return <div>Loading calendar or no posts to display...</div>;
  }

  return (
    <div style={{ height: '700px' }}> {/* Set a default height for the calendar container */}
      <Calendar
        localizer={localizer}
        events={events} // Mapped events will go here
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={event => onSelectPost(event.originalPost)}
        onSelectSlot={slotInfo => onSelectDate(slotInfo.start)}
        selectable // Allows slot selection
        eventPropGetter={eventStyleGetter}
        onEventDrop={handleEventDrop}
        // More props like defaultView, views, etc., can be added as needed.
        defaultView="month"
        views={['month', 'week', 'day']}
      />
    </div>
  );
};

export default CalendarView;

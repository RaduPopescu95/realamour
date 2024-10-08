// components/Calendar.js
"use client";

import React from "react";
import { InlineWidget } from "react-calendly";

const Calendar = () => {
  return (
    <div className="calendar-container" style={{ height: "100vh" }}>


      <InlineWidget 
        url="https://calendly.com/webdynamicx/30-minute-meeting-clone" 
        styles={{
          height: '100%',
          width: '100%',
          minHeight: '600px',
        }} 
      />
    </div>
  );
};

export default Calendar;

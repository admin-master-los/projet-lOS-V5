/**
 * Component: MeetingsCalendar
 * Calendrier visuel des rendez-vous
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMonthSchedule } from '../../hooks/useAvailability';
import { getDaysInMonth, getFirstDayOfMonth, getMonthName } from '../../utils/dateHelpers';
import { LoadingSpinner } from '../common/LoadingSpinner';

const MeetingsCalendar: React.FC = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  const { data: schedule, isLoading } = useMonthSchedule(currentYear, currentMonth);

  const days = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getMeetingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedule?.meetings.filter((m: any) => m.meeting_date === dateStr) || [];
  };

  const isBlocked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedule?.blockedDates.some((bd: any) => bd.blocked_date === dateStr);
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {getMonthName(currentMonth - 1)} {currentYear}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
            <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for first day offset */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Calendar days */}
          {days.map((day) => {
            const meetings = getMeetingsForDate(day);
            const blocked = isBlocked(day);
            const isToday =
              day.toDateString() === new Date().toDateString();

            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-2 rounded-lg border ${
                  isToday
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : blocked
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-white/10 bg-white/5'
                } hover:bg-white/10 transition-colors`}
              >
                <p className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-cyan-400' : 'text-white'
                }`}>
                  {day.getDate()}
                </p>

                {blocked && (
                  <p className="text-xs text-red-400">Bloqué</p>
                )}

                {meetings.length > 0 && (
                  <div className="space-y-1">
                    {meetings.slice(0, 2).map((meeting: any) => (
                      <div
                        key={meeting.id}
                        className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 truncate"
                        title={meeting.client_name}
                      >
                        {meeting.meeting_time.substring(0, 5)}
                      </div>
                    ))}
                    {meetings.length > 2 && (
                      <p className="text-xs text-gray-400">
                        +{meetings.length - 2} autre(s)
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MeetingsCalendar;

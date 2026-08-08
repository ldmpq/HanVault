import { useState } from 'react';

export const useSettings = () => {
  const [dailyGoal, setDailyGoal] = useState('steady');
  const [reviewPace, setReviewPace] = useState(50);
  const [audioAutoplay, setAudioAutoplay] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Streak Milestone!', desc: 'You reached a 12-day study streak. Keep it up!', time: '10m ago', unread: true, icon: '🔥' },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return {
    dailyGoal, setDailyGoal,
    reviewPace, setReviewPace,
    audioAutoplay, setAudioAutoplay,
    playbackSpeed, setPlaybackSpeed,
    notifications, markAllAsRead
  };
};
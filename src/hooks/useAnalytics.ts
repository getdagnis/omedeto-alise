import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const SESSION_KEY = 'alise_session_id';
const USER_LABEL_KEY = 'alise_user_label';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function getBrowserInfo() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
}

function getOSInfo() {
  const platform = navigator.platform;
  const ua = navigator.userAgent;
  if (platform.includes('Win')) return 'Windows';
  if (platform.includes('Mac')) return 'MacOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (platform.includes('Linux')) return 'Linux';
  return 'Unknown';
}

export function useAnalytics() {
  const [sessionId] = useState<string>(() => {
    let sId = localStorage.getItem(SESSION_KEY);
    const lastActive = localStorage.getItem('alise_last_active');
    const now = Date.now();

    if (!sId || !lastActive || now - parseInt(lastActive) > SESSION_TIMEOUT) {
      sId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sId);
    }
    localStorage.setItem('alise_last_active', now.toString());
    return sId;
  });

  const [userLabel] = useState<string>(() => {
    let label = localStorage.getItem(USER_LABEL_KEY);
    if (!label) {
      label = `user_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(USER_LABEL_KEY, label);
    }
    return label;
  });

  const trackEvent = useCallback(async (
    eventName: string, 
    params: { 
      category?: string;
      sound_id?: string;
      character_id?: string;
      metadata?: Record<string, unknown>;
    } = {}
  ) => {
    const { category, sound_id, character_id } = params;
    
    supabase.from('events').insert({
      event_name: eventName,
      event_category: category,
      session_id: sessionId,
      user_label: userLabel,
      route: window.location.pathname,
      referrer: document.referrer,
      sound_id,
      character_id,
      browser: getBrowserInfo(),
      os: getOSInfo(),
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      viewport_w: window.innerWidth,
      viewport_h: window.innerHeight,
    }).then(({ error }) => {
      if (error) console.error('Error tracking event:', error);
    });
  }, [sessionId, userLabel]);

  // Update last active on any interaction
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem('alise_last_active', Date.now().toString());
    };
    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('touchstart', updateActivity);
    return () => {
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
    };
  }, []);

  return { trackEvent };
}

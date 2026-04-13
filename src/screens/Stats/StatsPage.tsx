import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../supabase';
import { BarChart, Globe, Music, Users, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './StatsPage.module.sass';

type Event = {
  id: string;
  created_at: string;
  user_label: string;
  session_id: string;
  event_name: string;
  event_category?: string;
  route: string;
  sound_id?: string;
  character_id?: string;
  device_type: string;
  os: string;
  browser: string;
  viewport_w: number;
  viewport_h: number;
};

type SessionGroup = {
  sessionId: string;
  userLabel: string;
  startTime: string;
  duration: number;
  events: Event[];
  device: string;
  browser: string;
};

export default function StatsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching events:', error);
      else setEvents(data || []);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const toggleSession = (id: string) => {
    const next = new Set(expandedSessions);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedSessions(next);
  };

  const stats = useMemo(() => {
    const topSounds: Record<string, number> = {};
    const topRoutes: Record<string, number> = {};
    const eventNames: Record<string, number> = {};
    const browsers: Record<string, number> = {};
    const sessions: Record<string, SessionGroup> = {};

    events.forEach(e => {
      // Event counts
      eventNames[e.event_name] = (eventNames[e.event_name] || 0) + 1;
      
      // Top Sounds
      if (e.sound_id) {
        topSounds[e.sound_id] = (topSounds[e.sound_id] || 0) + 1;
      }

      // Top Routes
      topRoutes[e.route] = (topRoutes[e.route] || 0) + 1;

      // Browsers
      browsers[e.browser] = (browsers[e.browser] || 0) + 1;

      // Group Sessions
      if (!sessions[e.session_id]) {
        sessions[e.session_id] = {
          sessionId: e.session_id,
          userLabel: e.user_label,
          startTime: e.created_at,
          duration: 0,
          events: [],
          device: e.device_type,
          browser: e.browser
        };
      }
      sessions[e.session_id].events.push(e);
    });

    // Calculate session durations
    Object.values(sessions).forEach(s => {
      const times = s.events.map(e => new Date(e.created_at).getTime());
      s.duration = Math.max(...times) - Math.min(...times);
      s.startTime = new Date(Math.min(...times)).toISOString();
      // Sort events within session ascending
      s.events.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });

    const sortedSessions = Object.values(sessions).sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

    return {
      topSounds: Object.entries(topSounds).sort((a, b) => b[1] - a[1]).slice(0, 10),
      topRoutes: Object.entries(topRoutes).sort((a, b) => b[1] - a[1]).slice(0, 10),
      eventNames: Object.entries(eventNames).sort((a, b) => b[1] - a[1]).slice(0, 10),
      browsers: Object.entries(browsers).sort((a, b) => b[1] - a[1]),
      sessions: sortedSessions,
      totalEvents: events.length,
      totalUsers: new Set(events.map(e => e.user_label)).size
    };
  }, [events]);

  if (loading) return <div className={styles.loading}>INITIALIZING RADAR...</div>;

  const renderStatBar = (label: string, value: number, max: number) => (
    <div key={label} className={styles.statItem}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statBarContainer}>
        <div className={styles.statBar} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className={styles.statValue}>{value}</span>
    </div>
  );

  return (
    <div className={styles.statsPage}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>TOKYO TRAFFIC CONTROL</h1>
          <p style={{ opacity: 0.5, fontSize: '0.8rem', marginTop: '4px' }}>Real-time telemetry and user resonance metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--neon-pink)' }}>{stats.totalEvents}</div>
            <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>TOTAL EVENTS</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--neon-cyan)' }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>ACTIVE USERS</div>
          </div>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}><Music size={16} /> Top Sounds</h3>
          <div className={styles.statList}>
            {stats.topSounds.map(([label, val]) => renderStatBar(label, val as number, stats.topSounds[0][1] as number))}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}><Globe size={16} /> Top Routes</h3>
          <div className={styles.statList}>
            {stats.topRoutes.map(([label, val]) => renderStatBar(label, val as number, stats.topRoutes[0][1] as number))}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}><BarChart size={16} /> Interactions</h3>
          <div className={styles.statList}>
            {stats.eventNames.map(([label, val]) => renderStatBar(label, val as number, stats.eventNames[0][1] as number))}
          </div>
        </div>
      </div>

      <section className={styles.sessionsSection}>
        <h2 className={styles.cardTitle} style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          <Users size={20} /> Active Sessions
        </h2>
        
        {stats.sessions.map(session => (
          <div key={session.sessionId} className={styles.sessionRow}>
            <div className={styles.sessionHeader} onClick={() => toggleSession(session.sessionId)}>
              <span className={styles.sessionUser}>{session.userLabel}</span>
              <span className={styles.sessionTime}>
                {new Date(session.startTime).toLocaleString()}
              </span>
              <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                {session.browser} • {session.device}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {Math.floor(session.duration / 1000)}s • {session.events.length} ev
              </span>
              {expandedSessions.has(session.sessionId) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {expandedSessions.has(session.sessionId) && (
              <div className={styles.sessionDetails}>
                <div className={styles.eventTimeline}>
                  {session.events.map((e, idx) => (
                    <div key={idx} className={styles.eventItem}>
                      <span className={styles.eventTime}>{new Date(e.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      <span className={styles.eventName}>{e.event_name}</span>
                      <span className={styles.eventMeta}>
                        {e.route} {e.sound_id && `• Sound: ${e.sound_id}`} {e.character_id && `• Char: ${e.character_id}`}
                      </span>
                      <span style={{ marginLeft: 'auto', opacity: 0.3, fontSize: '0.6rem' }}>
                        {e.viewport_w}x{e.viewport_h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

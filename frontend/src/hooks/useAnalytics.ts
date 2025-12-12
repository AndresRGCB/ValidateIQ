import { useCallback, useRef, useEffect } from 'react';

interface AnalyticsState {
  visitorId: number | null;
  pageViewId: number | null;
  pageLoadTime: number;
  maxScrollDepth: number;
  lastTrackedMilestone: number;
}

const API_BASE = '/api/analytics';

export function useAnalytics() {
  const state = useRef<AnalyticsState>({
    visitorId: null,
    pageViewId: null,
    pageLoadTime: Date.now(),
    maxScrollDepth: 0,
    lastTrackedMilestone: 0,
  });

  const init = useCallback(async () => {
    try {
      const params = new URLSearchParams(window.location.search);

      const response = await fetch(`${API_BASE}/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrer: document.referrer || null,
          utm_source: params.get('utm_source'),
          utm_medium: params.get('utm_medium'),
          utm_campaign: params.get('utm_campaign'),
          utm_content: params.get('utm_content'),
          screen_width: window.screen.width,
          screen_height: window.screen.height,
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight,
        }),
      });

      const data = await response.json();
      state.current.visitorId = data.visitor_id;
      state.current.pageViewId = data.page_view_id;

      return data;
    } catch (error) {
      console.error('Analytics init error:', error);
      return null;
    }
  }, []);

  const trackEvent = useCallback(async (
    eventType: string,
    options: {
      category?: string;
      elementId?: string;
      elementClass?: string;
      elementText?: string;
      section?: string;
      properties?: Record<string, unknown>;
      scrollPosition?: number;
    } = {}
  ) => {
    if (!state.current.visitorId) return;

    try {
      await fetch(`${API_BASE}/event?visitor_id=${state.current.visitorId}&page_view_id=${state.current.pageViewId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          event_category: options.category,
          element_id: options.elementId,
          element_class: options.elementClass,
          element_text: options.elementText,
          section: options.section,
          properties: options.properties,
          scroll_position: options.scrollPosition ?? window.scrollY,
          time_since_page_load: Date.now() - state.current.pageLoadTime,
        }),
      });
    } catch (error) {
      console.error('Track event error:', error);
    }
  }, []);

  const trackSectionView = useCallback((sectionId: string) => {
    trackEvent('section_view', {
      section: sectionId,
      category: 'engagement'
    });
  }, [trackEvent]);

  const updateScrollDepth = useCallback((depth: number) => {
    if (depth > state.current.maxScrollDepth) {
      state.current.maxScrollDepth = depth;

      const milestones = [25, 50, 75, 90, 100];
      for (const milestone of milestones) {
        if (depth >= milestone && state.current.lastTrackedMilestone < milestone) {
          state.current.lastTrackedMilestone = milestone;
          trackEvent('scroll_milestone', {
            category: 'scroll',
            properties: { depth: milestone }
          });
        }
      }
    }
  }, [trackEvent]);

  const trackFormFocus = useCallback(() => {
    trackEvent('form_focus', { category: 'form', section: 'waitlist_form' });
  }, [trackEvent]);

  const trackFormFieldBlur = useCallback((fieldName: string, hasValue: boolean) => {
    trackEvent('form_field_blur', {
      category: 'form',
      section: 'waitlist_form',
      properties: { field_name: fieldName, has_value: hasValue }
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((success: boolean, feature?: string) => {
    trackEvent(success ? 'form_submit_success' : 'form_submit_error', {
      category: 'form',
      section: 'waitlist_form',
      properties: { feature_selected: feature }
    });
  }, [trackEvent]);

  const trackCTAClick = useCallback((buttonText: string, position: string) => {
    trackEvent('cta_click', {
      category: 'navigation',
      elementText: buttonText,
      properties: { position }
    });
  }, [trackEvent]);

  const trackFeatureHover = useCallback((featureName: string) => {
    trackEvent('feature_card_hover', {
      category: 'engagement',
      section: 'features',
      properties: { feature_name: featureName }
    });
  }, [trackEvent]);

  useEffect(() => {
    const sendBeacon = () => {
      if (!state.current.pageViewId) return;

      const data = JSON.stringify({
        page_view_id: state.current.pageViewId,
        time_on_page_seconds: Math.floor((Date.now() - state.current.pageLoadTime) / 1000),
        max_scroll_depth: state.current.maxScrollDepth,
        events_count: 0,
      });

      navigator.sendBeacon(`${API_BASE}/beacon`, data);
    };

    const handleBeforeUnload = () => sendBeacon();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendBeacon();
        trackEvent('tab_hidden', { category: 'engagement' });
      } else {
        trackEvent('tab_visible', { category: 'engagement' });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackEvent]);

  return {
    init,
    trackEvent,
    trackSectionView,
    updateScrollDepth,
    trackFormFocus,
    trackFormFieldBlur,
    trackFormSubmit,
    trackCTAClick,
    trackFeatureHover,
    getVisitorId: () => state.current.visitorId,
    getPageViewId: () => state.current.pageViewId,
    getPageLoadTime: () => state.current.pageLoadTime,
  };
}

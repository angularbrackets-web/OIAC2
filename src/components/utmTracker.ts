import { trackVisit } from '../lib/trackVisit';
import { trackDonation } from '../lib/trackDonation';

const VALID_UTM_SOURCES = [
    'facebook',
    'instagram',
    'youtube',
    'email',
    'whatsapp',
    'other',
  ] as const;
  
  type UtmSourceType = typeof VALID_UTM_SOURCES[number];
  
  function normalizeSource(source: string | null): UtmSourceType {
    const normalized = (source || '').toLowerCase();
    return VALID_UTM_SOURCES.includes(normalized as UtmSourceType)
      ? (normalized as UtmSourceType)
      : 'other';
  }
  
  export async function initUtmTracking() {
    const params = new URLSearchParams(window.location.search);
    const rawSource = params.get('utm_source');
    const source = normalizeSource(rawSource);
    const timestamp = new Date().toISOString();
  
    let utmId: string | null = null;
  
    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, timestamp }),
      });
  
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        utmId = result.utmId || null;
      } else {
        console.warn('UTM tracking failed:', result.message);
      }
    } catch (error) {
      console.error('UTM tracking error:', error);
    }
  
    // Track donation button click
    const donateButtons = document.getElementsByClassName('donate-keela');
    if (donateButtons.length > 0 && utmId) {
      Array.from(donateButtons).forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            await fetch('/api/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                source,
                timestamp: new Date().toISOString(),
                donateButtonClicked: true,
              }),
            });
          } catch (error) {
            console.error('Donation tracking failed:', error);
          }
        });
      });
    }
  }
  
  initUtmTracking();
  
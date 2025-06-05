import { trackVisit } from '../lib/trackVisit';
import { trackDonation } from '../lib/trackDonation';

export async function initUtmTracking() {
  const params = new URLSearchParams(window.location.search);
  const source = (params.get('utm_source') || 'direct').toLowerCase();
  let utmId: string | null = null;

  document.addEventListener("DOMContentLoaded", async () => {
    utmId = await trackVisit(source);

    const donateButtons = document.getElementsByClassName('donate-keela');
    if (donateButtons.length > 0 && utmId) {
      Array.from(donateButtons).forEach(button => {
        button.addEventListener('click', () => {
          trackDonation(utmId!); // `!` because we already checked utmId is truthy
        });
      });
    }
  });
}

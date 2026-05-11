'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const PixelScripts = () => {
  const [ids, setIds] = useState({
    fb_pixel_id: '',
    tt_pixel_id: '',
    google_ads_id: ''
  });

  useEffect(() => {
    const fetchIds = async () => {
      try {
        const { data } = await supabase.from('settings').select('*');
        if (data) {
          const idObj: any = {};
          data.forEach(item => {
            idObj[item.key] = item.value;
          });
          setIds(prev => ({ ...prev, ...idObj }));
        }
      } catch (err) {
        console.error('Error fetching pixel IDs:', err);
      }
    };
    fetchIds();
  }, []);

  return (
    <>
      {/* Facebook Pixel Base Code */}
      {ids.fb_pixel_id && (
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${ids.fb_pixel_id}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* TikTok Pixel Base Code */}
      {ids.tt_pixel_id && (
        <Script
          id="tt-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.Tawk_API = w.Tawk_API || {};
                w.Tawk_LoadStart = new Date();
                // TikTok script placeholder
                !function (w, d, t) {
                  w.ttq = w.ttq || [];
                  w.ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "setAnonymousId", "instance"];
                  w.ttq.setAnonymousId = function (t) { localStorage.setItem("tt_sessions_id", t) };
                  w.ttq.load = function (e, n) {
                    var t = "https://analytics.tiktok.com/i18n/pixel/events.js";
                    w.ttq._i = w.ttq._i || {}, w.ttq._i[e] = [], w.ttq._i[e]._u = t, w.ttq._t = w.ttq._t || {}, w.ttq._t[e] = +new Date, w.ttq._o = w.ttq._o || {}, w.ttq._o[e] = n || {};
                    var i = d.createElement("script");
                    i.type = "text/javascript", i.async = !0, i.src = t + "?sdkid=" + e + "&lib=" + "ttq";
                    var r = d.getElementsByTagName("script")[0];
                    r.parentNode.insertBefore(i, r)
                  };
                }(window, document, 'script');
                ttq.load('${ids.tt_pixel_id}');
                ttq.page();
              }(window, document, 'script');
            `,
          }}
        />
      )}
    </>
  );
};

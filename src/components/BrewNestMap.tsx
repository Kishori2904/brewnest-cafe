// Source: Google Maps Platform Code Assist
import React, { useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Clock, Phone, ExternalLink, RotateCcw, Compass, Car } from 'lucide-react';

const BREWNEST_COORDINATES = { lat: 28.5961, lng: 77.3402 }; // 123 Green Park, Sector 12, Noida
const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDvYdLtpffS3DMWbs8JZHDFrJp7Pij2xpg';

// Internal controller to re-center map to BrewNest
const MapRecenterControl: React.FC<{ onOpenInfo: () => void }> = ({ onOpenInfo }) => {
  const map = useMap();

  const handleRecenter = () => {
    if (map) {
      map.panTo(BREWNEST_COORDINATES);
      map.setZoom(16);
      onOpenInfo();
    }
  };

  return (
    <div className="absolute top-3 left-3 z-10">
      <button
        type="button"
        onClick={handleRecenter}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/95 dark:bg-[#1E1109]/95 text-stone-800 dark:text-amber-200 hover:bg-stone-100 dark:hover:bg-[#2C190D] shadow-md border border-stone-200/80 dark:border-amber-900/60 backdrop-blur-xs transition-all cursor-pointer"
        title="Recenter to BrewNest"
      >
        <RotateCcw className="w-3.5 h-3.5 text-[#8C5D3B] dark:text-amber-400" />
        <span>Recenter</span>
      </button>
    </div>
  );
};

export const BrewNestMap: React.FC = () => {
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(true);

  return (
    <div className="w-full space-y-4">
      {/* Map Header and Quick Nav Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EFE7DE] dark:bg-[#20140D] flex items-center justify-center border border-transparent dark:border-amber-900/40">
            <Compass className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-[#F7EAE1]">
              BrewNest Café Location & Directions
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Sector 12, Green Park, Noida (UP)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=28.5961,77.3402"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#2B1810] dark:bg-amber-600 hover:bg-[#1E110A] dark:hover:bg-amber-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-200" />
            <span>Get Directions</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Interactive Google Map Container */}
      <div className="relative h-[380px] sm:h-[420px] w-full rounded-2xl overflow-hidden border border-stone-300/80 dark:border-amber-950/60 shadow-lg bg-stone-100 dark:bg-[#150D08]">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']}>
          <MapRecenterControl onOpenInfo={() => setIsInfoWindowOpen(true)} />
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={BREWNEST_COORDINATES}
            defaultZoom={15}
            gestureHandling="cooperative"
            disableDefaultUI={false}
            zoomControl={true}
            mapTypeControl={true}
            streetViewControl={false}
            fullscreenControl={true}
            style={{ width: '100%', height: '100%' }}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {/* Custom Advanced Pin at BrewNest */}
            <AdvancedMarker
              position={BREWNEST_COORDINATES}
              onClick={() => setIsInfoWindowOpen(true)}
              title="BrewNest Café & Roastery"
            >
              <Pin
                background="#2B1810"
                borderColor="#D97706"
                glyphColor="#FEF3C7"
                scale={1.25}
              />
            </AdvancedMarker>

            {/* Interactive InfoWindow anchored at BrewNest coordinates */}
            {isInfoWindowOpen && (
              <InfoWindow
                position={BREWNEST_COORDINATES}
                onCloseClick={() => setIsInfoWindowOpen(false)}
                pixelOffset={[0, -42]}
                headerDisabled={false}
              >
                <div className="p-1 max-w-[240px] text-stone-900 font-sans">
                  <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-[#2B1810]">
                    <span>☕ BrewNest Café</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                    123 Green Park, Sector 12, Noida, Uttar Pradesh 201301
                  </p>
                  <div className="mt-2 pt-2 border-t border-stone-200/80 space-y-1 text-[10px] text-stone-500">
                    <div className="flex items-center gap-1 text-emerald-700 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>Open Daily · 8:00 AM – 10:00 PM</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-600">
                      <Phone className="w-3 h-3" />
                      <span>+91 98765 43210</span>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=28.5961,77.3402"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-1.5 px-2.5 rounded-md text-[11px] font-bold text-white bg-[#2B1810] hover:bg-[#1E110A] transition-colors"
                    >
                      Navigate in Google Maps
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Transit & Accessibility Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#1C1109] border border-stone-200 dark:border-amber-950/40 flex items-center gap-2 text-stone-700 dark:text-stone-300">
          <Navigation className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400 shrink-0" />
          <span className="truncate">Noida Sec 15 Metro (7 min)</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white dark:bg-[#1C1109] border border-stone-200 dark:border-amber-950/40 flex items-center gap-2 text-stone-700 dark:text-stone-300">
          <Car className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400 shrink-0" />
          <span className="truncate">Dedicated Valet & Parking</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white dark:bg-[#1C1109] border border-stone-200 dark:border-amber-950/40 flex items-center gap-2 text-stone-700 dark:text-stone-300">
          <MapPin className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400 shrink-0" />
          <span className="truncate">Opposite Green Park Pavilion</span>
        </div>
      </div>
    </div>
  );
};

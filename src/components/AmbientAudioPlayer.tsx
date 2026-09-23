import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ListMusic,
  Sliders,
  CloudRain,
  Coffee,
  Disc3,
  X,
  Radio,
  Sparkles,
} from 'lucide-react';
import { softMusicEngine, SOFT_SONGS_PLAYLIST, SongTrack } from '../utils/softMusicEngine';

export const AmbientAudioPlayer: React.FC = () => {
  const [, setTick] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Subscribe to engine state changes (progress, track change, play/pause, volume)
  useEffect(() => {
    const unsubscribe = softMusicEngine.subscribe(() => {
      setTick((t) => t + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const isPlaying = softMusicEngine.isPlaying();
  const currentTrack = softMusicEngine.getCurrentTrack();
  const progress = softMusicEngine.getCurrentProgress();
  const volume = softMusicEngine.getVolume();

  const handleTogglePlay = () => {
    softMusicEngine.togglePlay();
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    softMusicEngine.nextTrack();
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    softMusicEngine.previousTrack();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    softMusicEngine.setVolume(parseFloat(e.target.value));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    softMusicEngine.seek(parseInt(e.target.value, 10));
  };

  const handleSelectTrack = (idx: number) => {
    softMusicEngine.playTrack(idx);
    setShowPlaylist(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {/* 1. EXPANDED FULL SOFT MUSIC PLAYER MODAL */}
      {isExpanded && (
        <div className="absolute bottom-14 left-0 w-80 sm:w-96 bg-[#21140E]/95 backdrop-blur-xl rounded-3xl border border-amber-900/40 shadow-2xl p-5 text-white animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/40">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-amber-500/20 text-amber-300">
                <Music className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-serif font-bold text-sm text-amber-100 flex items-center gap-1.5">
                  <span>Soft Café Radio</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-amber-400/20 text-amber-300">
                    Live Synth
                  </span>
                </h3>
                <p className="text-[10px] text-stone-400">Gentle acoustic &amp; lo-fi songs for coffee</p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Minimize player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Song Display Card */}
          <div className="py-4">
            <div className="flex items-center gap-3.5 bg-black/30 p-3 rounded-2xl border border-amber-900/30">
              {/* Spinning Vinyl Visualizer */}
              <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 border-amber-400/40 shadow-md flex items-center justify-center bg-stone-900">
                <img
                  src={currentTrack.coverImage}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}
                />
                <div className="absolute w-3.5 h-3.5 rounded-full bg-[#21140E] border border-amber-300/60" />
              </div>

              {/* Title & Artist */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-xs">
                    {currentTrack.genre}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {currentTrack.tempo} BPM
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-100 truncate mt-1">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-stone-400 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Song description */}
            <p className="text-[11px] text-stone-400 leading-snug mt-2.5 px-1 italic">
              "{currentTrack.description}"
            </p>
          </div>

          {/* Scrubber / Progress Bar */}
          <div className="space-y-1.5 py-1">
            <div className="flex justify-between text-[10px] font-mono text-stone-400">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={currentTrack.duration}
              value={progress}
              onChange={handleSeek}
              className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-between pt-3">
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                showPlaylist
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-semibold'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 border-amber-900/40'
              }`}
              title="View all soft songs"
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Playlist</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Previous soft song"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer font-bold"
                title={isPlaying ? 'Pause song' : 'Play soft song'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950 ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Next soft song"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Quick volume toggle / popover indicator */}
            <div className="flex items-center gap-1.5 text-stone-400">
              <button
                onClick={() => softMusicEngine.setVolume(volume > 0 ? 0 : 0.35)}
                className="p-1.5 hover:text-white transition-colors cursor-pointer"
                title={volume === 0 ? 'Unmute' : 'Mute'}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-[10px] font-mono w-7 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Volume Slider bar */}
          <div className="pt-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-amber-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Ambient Sound Layer Mixer */}
          <div className="mt-4 pt-3 border-t border-amber-900/40">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-300 mb-2">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-amber-400" />
                <span>Ambient Sound Layers</span>
              </span>
              <span className="text-[10px] text-amber-400/80 font-normal">Mix with song</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() =>
                  softMusicEngine.setLayers(
                    !softMusicEngine.enableRainLayer,
                    softMusicEngine.enableChatterLayer,
                    softMusicEngine.enableVinylLayer
                  )
                }
                className={`px-2 py-1.5 rounded-xl border text-[10px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  softMusicEngine.enableRainLayer
                    ? 'bg-amber-900/40 border-amber-500/50 text-amber-200'
                    : 'bg-black/20 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <CloudRain className="w-3 h-3 text-sky-400" />
                <span>Soft Rain</span>
              </button>

              <button
                onClick={() =>
                  softMusicEngine.setLayers(
                    softMusicEngine.enableRainLayer,
                    !softMusicEngine.enableChatterLayer,
                    softMusicEngine.enableVinylLayer
                  )
                }
                className={`px-2 py-1.5 rounded-xl border text-[10px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  softMusicEngine.enableChatterLayer
                    ? 'bg-amber-900/40 border-amber-500/50 text-amber-200'
                    : 'bg-black/20 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Coffee className="w-3 h-3 text-amber-400" />
                <span>Café Hum</span>
              </button>

              <button
                onClick={() =>
                  softMusicEngine.setLayers(
                    softMusicEngine.enableRainLayer,
                    softMusicEngine.enableChatterLayer,
                    !softMusicEngine.enableVinylLayer
                  )
                }
                className={`px-2 py-1.5 rounded-xl border text-[10px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  softMusicEngine.enableVinylLayer
                    ? 'bg-amber-900/40 border-amber-500/50 text-amber-200'
                    : 'bg-black/20 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Disc3 className="w-3 h-3 text-amber-300" />
                <span>Vinyl Beat</span>
              </button>
            </div>
          </div>

          {/* Playlist Drawer Subview */}
          {showPlaylist && (
            <div className="mt-3 pt-3 border-t border-amber-900/40 space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <div className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider mb-1 px-1">
                Soft Songs Playlist (5 Tracks)
              </div>
              {SOFT_SONGS_PLAYLIST.map((song, idx) => {
                const isCurrent = song.id === currentTrack.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => handleSelectTrack(idx)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500/20 border border-amber-400/50 text-amber-100 font-semibold'
                        : 'bg-black/20 hover:bg-white/10 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono text-stone-400 w-4">
                        {isCurrent && isPlaying ? (
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        ) : (
                          `${idx + 1}`
                        )}
                      </span>
                      <div className="truncate">
                        <div className="truncate font-medium">{song.title}</div>
                        <div className="text-[10px] text-stone-400 truncate">{song.genre}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 shrink-0 ml-2">
                      {formatTime(song.duration)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. COMPACT FLOATING BAR / PILL TRIGGER */}
      <div className="relative flex items-center gap-2">
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl border transition-all cursor-pointer backdrop-blur-md ${
            isPlaying
              ? 'bg-[#2B1810]/95 text-amber-200 border-amber-400/60 shadow-amber-950/30 ring-2 ring-amber-400/30'
              : 'bg-white/95 text-stone-800 border-stone-300 hover:bg-white hover:text-amber-950 shadow-stone-900/10'
          }`}
          title={isPlaying ? `Playing: ${currentTrack.title} (Click to pause)` : 'Click to play soft café songs'}
        >
          {/* Visualizer / Icon */}
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-4 w-4">
              <span className="w-1 bg-amber-400 rounded-xs animate-[bounce_0.7s_infinite_100ms] h-full" />
              <span className="w-1 bg-amber-300 rounded-xs animate-[bounce_0.7s_infinite_300ms] h-2/3" />
              <span className="w-1 bg-amber-200 rounded-xs animate-[bounce_0.7s_infinite_200ms] h-4/5" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-amber-800/15 flex items-center justify-center text-amber-800">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
          )}

          {/* Current track title & status */}
          <div className="text-left flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight truncate max-w-[130px] sm:max-w-[160px]">
                {isPlaying ? currentTrack.title : 'Play Soft Songs'}
              </span>
            </div>
            <span className="text-[10px] leading-none opacity-75 truncate max-w-[130px] sm:max-w-[160px]">
              {isPlaying ? `${currentTrack.genre} · ${formatTime(progress)}` : 'Acoustic & Lo-Fi Playlist'}
            </span>
          </div>
        </button>

        {/* Quick Next Song Button when playing */}
        {isPlaying && (
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-[#2B1810]/95 hover:bg-[#382015] border border-amber-400/40 text-amber-200 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            title="Next soft song"
            aria-label="Next track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Controls / Drawer expander button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-9 h-9 rounded-full border flex items-center justify-center shadow-lg transition-all cursor-pointer backdrop-blur-md ${
            isExpanded
              ? 'bg-amber-500 text-stone-950 border-amber-400'
              : 'bg-white/90 text-stone-700 hover:text-amber-950 border-stone-300 hover:bg-white'
          }`}
          title="Open Soft Song & Ambiance Player"
          aria-label="Player controls"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

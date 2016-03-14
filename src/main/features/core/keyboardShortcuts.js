import _ from 'lodash';
import { globalShortcut } from 'electron';

globalShortcut.register('MediaPreviousTrack', () => {
  Emitter.sendToGooglePlayMusic('playback:previousTrack');
});

globalShortcut.register('MediaPlayPause', () => {
  Emitter.sendToGooglePlayMusic('playback:playPause');
});

globalShortcut.register('MediaNextTrack', () => {
  Emitter.sendToGooglePlayMusic('playback:nextTrack');
});

globalShortcut.register('MediaStop', () => {
  Emitter.sendToGooglePlayMusic('playback:stop');
});

const customHotkeysTemplate = {
  playPause: null,
  stop: null,
  previousTrack: null,
  nextTrack: null,
  thumbsUp: null,
  thumbsDown: null,
  increaseVolume: null,
  decreaseVolume: null,
};

const userHotkeys = Settings.get('hotkeys', {});

const customHotkeys = _.extend(customHotkeysTemplate, userHotkeys);


_.forIn(customHotkeys, (value, key) => {
  if (value) {
    globalShortcut.register(value, () => {
      Emitter.sendToGooglePlayMusic(`playback:${key}`);
    });
  }
});

Emitter.on('hotkey:set', (event, details) => {
  const key = details.action;

  if (customHotkeys[key] || customHotkeys[key] === null) {
    if (customHotkeys[key] && globalShortcut.isRegistered(customHotkeys[key])) {
      globalShortcut.unregister(customHotkeys[key]);
    }
    customHotkeys[key] = details.accelerator;
    if (customHotkeys[key]) {
      globalShortcut.register(customHotkeys[key], () => {
        Emitter.sendToGooglePlayMusic(`playback:${key}`);
      });
    }
    Settings.set('hotkeys', customHotkeys);
  }
});

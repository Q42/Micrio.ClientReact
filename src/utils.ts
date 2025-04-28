import type { Models } from "@micrio/client";

export const micrioEventTypes = [
	'show', 'pre-info', 'pre-data', 'print', 'load', 'lang-switch', 'zoom', 'move', 'draw', 'resize', 'panstart',
	'panend', 'pinchstart', 'pinchend', 'marker-open', 'marker-opened', 'marker-closed', 'tour-start', 'tour-stop',
	'tour-minimize', 'tour-step', 'serialtour-play', 'serialtour-pause', 'videotour-start', 'videotour-stop', 
	'videotour-play', 'videotour-pause', 'tour-ended', 'tour-event', 'audio-init', 'audio-mute', 'audio-unmute',
	'autoplay-blocked', 'media-play', 'media-pause', 'media-ended', 'timeupdate', 'page-open', 'page-closed', 'gallery-show',
	'grid-init', 'grid-load', 'grid-layout-set', 'grid-focus', 'grid-blur', 'splitscreen-start', 'splitscreen-stop', 'update',
] satisfies (keyof Models.MicrioEventMap)[]; // List of custom event types
// Type check to ensure all MicrioEventMap events are in the above array:
const _eventMapCheck: keyof Models.MicrioEventMap extends typeof micrioEventTypes[number] ? true : never = true;

export const micrioCustomAttributes = [
	'id', 'lang', 'data-path', 'data-inittype', 'data-coverlimit', 'lazyload', 'data-skipmeta', 'data-static', 
	'data-router', 'data-gtag', 'data-camspeed', 'data-freemove', 'data-zoomlimit', 'data-view', 'data-focus', 
	'data-keeprendering', 'data-normalize-dpr', 'data-events', 'data-keys', 'data-pinch-zoom', 'data-scroll-zoom', 
	'data-control-zoom', 'data-two-finger-pan', 'data-zooming', 'data-dragging', 'data-ui', 'data-controls', 'data-fullscreen', 
	'data-social', 'data-logo', 'data-logo-org', 'data-toolbar', 'data-show-info', 'data-minimap', 'data-minimap-hide', 
	'data-minimap-height', 'data-minimap-width', 'muted', 'volume', 'data-mutedvolume', 'data-grid', 'data-limited',
] satisfies (keyof Models.Attributes.MicrioCustomAttributes)[]; // List of custom attributes
// Type check to ensure all MicrioCustomAttributes are in the above array:
const _customAttrCheck: keyof Models.Attributes.MicrioCustomAttributes extends typeof micrioCustomAttributes[number] ? true : never = true;

const kebabToCamel = (str: string): string =>
	str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

export const eventPropToKebabMap = Object.fromEntries(
	micrioEventTypes.map((e) => [`on${e.charAt(0).toUpperCase() + kebabToCamel(e.slice(1))}`, e]),
) as Record<string, string>;

export const attributePropToKebabMap = Object.fromEntries(
	micrioCustomAttributes.map((a) => [kebabToCamel(a), a]),
) as Record<string, string>;

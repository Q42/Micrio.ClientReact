import React, { useRef, useEffect, type HTMLAttributes } from 'react';
// Assuming types are exported under 'Models' based on user feedback
import type { HTMLMicrioElement } from '@micrio/client';
import '@micrio/client'; // Import to register the <micr-io> custom element
import { CustomAttributeProps, EventProps, micrioCustomAttributes, micrioEventTypes, MicrioProps } from './types';

// --- Helper Functions ---
const camelToKebab = (str: string): string =>
  str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);

const kebabToCamel = (str: string): string =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const eventPropToKebabMap = Object.fromEntries(
  micrioEventTypes.map((e) => [`on${e.charAt(0).toUpperCase() + kebabToCamel(e.slice(1))}`, e]),
) as Record<string, string>;

const attributePropToKebabMap = Object.fromEntries(
  micrioCustomAttributes.map((a) => [kebabToCamel(a), a]),
) as Record<string, string>;

// --- Type Definitions ---

const Micrio: React.FC<MicrioProps> = ({ children, ...props }) => {
  const micrioRef = useRef<HTMLMicrioElement>(null);
  // Store handlers in ref to avoid re-running effect on handler change
  const eventHandlersRef = useRef<EventProps>({});

  // Keep event handlers ref updated
  useEffect(() => {
    eventHandlersRef.current = Object.keys(eventPropToKebabMap).reduce((acc, propKey) => {
      const key = propKey as keyof EventProps;
      if (props[key]) {
        // Cast to any to resolve complex intersection type assignment error
        acc[key] = props[key] as any;
      }
      return acc;
    }, {} as EventProps);
  }, [props]); // Re-run only if props themselves change

  // --- Attribute Synchronization ---
  useEffect(() => {
    const element = micrioRef.current;
    if (!element) return;

    // Iterate over the defined attribute props
    Object.entries(attributePropToKebabMap).forEach(([propKey, attrKey]) => {
      const value = props[propKey as keyof CustomAttributeProps];
      const attrKeyString = attrKey as string; // Ensure string type for DOM methods

      // Handle boolean attributes (presence means true)
      if (typeof value === 'boolean') {
        if (value) {
          element.setAttribute(attrKeyString, '');
        } else {
          element.removeAttribute(attrKeyString);
        }
      } else if (value !== undefined && value !== null) {
        // Handle other types (convert to string, handle arrays/objects if needed)
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        element.setAttribute(attrKeyString, stringValue);
      } else {
        // Remove attribute if prop is undefined or null
        element.removeAttribute(attrKeyString);
      }
    });
  }, [props]); // Re-run if attribute props change

  // --- Event Listener Management ---
  useEffect(() => {
    const element = micrioRef.current;
    if (!element) return;

    // Store listeners added in this effect run for cleanup
    const addedListeners: { [key: string]: EventListener } = {};

    // Iterate over the defined event props
    Object.entries(eventPropToKebabMap).forEach(([propKey, eventKey]) => {
      const handler = eventHandlersRef.current[propKey as keyof EventProps];
      const eventKeyString = eventKey as string; // Ensure string type for DOM methods

      if (handler) {
        const listener = (event: Event) => {
          // Call the latest handler from the ref
          const currentHandler = eventHandlersRef.current[propKey as keyof EventProps];
          if (currentHandler) {
            // Cast handler to any before calling to bypass strict intersection check
            (currentHandler as any)(event as CustomEvent<any>);
          }
        };
        addedListeners[eventKeyString] = listener; // Use string key for index
        element.addEventListener(eventKeyString, listener);
      }
    });

    // Cleanup function
    return () => {
      if (!element) return;
      Object.entries(addedListeners).forEach(([eventKeyString, listener]) => {
        element.removeEventListener(eventKeyString, listener); // Use string key
      });
    };
  }, []); // Run only once on mount to set up listeners

  // Separate standard HTML props from our custom/mapped props
  const standardHtmlProps: HTMLAttributes<HTMLElement> = {};
  for (const key in props) {
    if (
      !attributePropToKebabMap.hasOwnProperty(key) &&
      !eventPropToKebabMap.hasOwnProperty(key) &&
      key !== 'children'
    ) {
      standardHtmlProps[key as keyof HTMLAttributes<HTMLElement>] = props[key as keyof typeof props];
    }
  }

  // Pass standard HTML props directly. Micrio props are handled by useEffect.
  // We don't pass Micrio props directly to <micr-io> via spread because
  // React might not handle custom element attributes/props correctly,
  // especially complex types or boolean attributes. Setting them manually ensures correctness.
  return (
    <micr-io ref={micrioRef} {...standardHtmlProps}>
      {children}
    </micr-io>
  );
};

export default Micrio;

import React, { useRef, useEffect, type HTMLAttributes, useImperativeHandle } from 'react';
import { HTMLMicrioElement } from '@micrio/client';
import '@micrio/client'; // This import will ensure the custom element is registered
import { CustomAttributeProps, EventProps, MicrioProps } from './types';
import { attributePropToKebabMap, eventPropToKebabMap } from './utils';

export const Micrio = React.forwardRef<HTMLMicrioElement, MicrioProps>(({ children, ...props }, ref) => {
	const micrioRef = useRef<HTMLMicrioElement>(null);
	const eventHandlersRef = useRef<Record<string, (evt: CustomEvent) => any>>({});

	// This allows the parent component to access the custom element directly
	// and use its methods or properties as needed.
	useImperativeHandle(ref, () => micrioRef.current as HTMLMicrioElement, [micrioRef]);

	// Attribute synchronization to the kebab-case attributes of the custom element
	// TODO: in reality Micrio doesn't watch most attributes for changes, so we need to either watch them all
	// or communicate clearly that you can only set most attributes at initial render and that they won't change after that.
	useEffect(() => {
		const element = micrioRef.current;
		if (!element) return;

		const existingAttributes = element.getAttributeNames();

		// Iterate over the defined attribute props
		Object.entries(attributePropToKebabMap).forEach(([propKey, attrKey]) => {
			const value = props[propKey as keyof CustomAttributeProps];
			if (value !== undefined && value !== null) {
				// Handle other types (convert to string, handle arrays/objects if needed)
				// (booleans are also set as a string "true" or "false", because micrio has boolean attributes that are false by default)
				const stringValue = typeof value === 'object' 
					? JSON.stringify(value)
					: String(value);
				element.setAttribute(attrKey, stringValue);
			} else if (existingAttributes.includes(attrKey)) {
				// Remove attribute if prop is undefined or null
				element.removeAttribute(attrKey);
			}
		});
	}, [props]); // Re-run if attribute props change

	// Adding event listeners to the custom element for each event prop that was passed
	useEffect(() => {
		const element = micrioRef.current;
		if (!element) return;

		// Store listeners added in this effect run for cleanup
		const addedListeners: Record<string, (evt: CustomEvent) => any> = {};

		// Iterate over the defined event props
		Object.entries(eventPropToKebabMap).forEach(([propKey, eventKey]) => {
			const handler = props[propKey as keyof EventProps];

			if (handler && eventHandlersRef.current[eventKey] !== handler) {
				addedListeners[eventKey] = handler;
				element.addEventListener(eventKey as any, handler);
				eventHandlersRef.current[eventKey] = handler; // Store the current handler for comparison
			} else if (!handler && eventHandlersRef.current[eventKey]) {
				// If the handler is now undefined, remove the existing listener
				const preExistingListener = eventHandlersRef.current[eventKey];
				element.removeEventListener(eventKey as any, preExistingListener);
				delete eventHandlersRef.current[eventKey]; // Clean up the stored handler
			}
		});

		return () => {
			if (!element) return;
			Object.entries(addedListeners).forEach(([eventKey, listener]) => {
				element.removeEventListener(eventKey as any, listener);
			});
		};
	}, [props]);

	// Separate standard HTML props from our custom/mapped props
	const standardHtmlProps: HTMLAttributes<HTMLElement> = {};
	for (const key in props) {
		if (!attributePropToKebabMap.hasOwnProperty(key) && !eventPropToKebabMap.hasOwnProperty(key)) {
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
});

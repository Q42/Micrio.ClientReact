import type { HTMLMicrioElement, Models } from "@micrio/client";
import type { HTMLAttributes } from "react";

// Use the JSX declaration provided by the user
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'micr-io': React.DetailedHTMLProps<
        // Allow standard HTML attributes + Micrio-specific attributes on the element
        Models.Attributes.MicrioCustomAttributes & React.HTMLAttributes<HTMLMicrioElement>,
        HTMLMicrioElement
      >;
    }
  }
}

// Helper type to convert kebab-case to camelCase
type KebabToCamel<S extends string> = 
  S extends `${infer T}-${infer U}` 
    ? `${T}${Capitalize<KebabToCamel<U>>}` 
    : S;

// Explicitly define props based on Micrio attributes (camelCase)
// This avoids complex mapped types and ensures clarity
export type CustomAttributeProps = { [K in keyof Models.Attributes.MicrioCustomAttributes as KebabToCamel<K>]?: Models.Attributes.MicrioCustomAttributes[K] }

export type EventProps = { [K in keyof Models.MicrioEventDetails as `on${Capitalize<KebabToCamel<K>>}`]?: (event: CustomEvent<Models.MicrioEventDetails[K]>) => any };

// Combine with standard HTML attributes, excluding potential overlaps (id and lang)
export interface MicrioProps extends
  Omit<HTMLAttributes<HTMLElement>, keyof EventProps | 'lang'>,
  CustomAttributeProps, 
  EventProps {
    ref?: React.RefObject<HTMLMicrioElement>;
  }

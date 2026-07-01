// src/components/icons/CustomIcons.tsx
"use client";

import React from 'react';

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'style' | 'className'> {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
}

// ─── Icônes utilitaires existantes ────────────────────────────────────────────

export function AgendaMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M4.5 5.2C4.5 4.27 5.27 3.5 6.2 3.5H16.3C17.23 3.5 18 4.27 18 5.2V18.3C18 19.23 17.23 20 16.3 20H6.2C5.27 20 4.5 19.23 4.5 18.3V5.2Z"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <path d="M8 2.2V5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M14.5 2.2V5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M4.5 8.4H18" stroke="currentColor" strokeWidth={strokeWidth}/>
      <circle cx="7.6" cy="11.4" r="0.55" fill="currentColor"/>
      <circle cx="11.1" cy="11.4" r="0.55" fill="currentColor"/>
      <circle cx="7.6" cy="14.4" r="0.55" fill="currentColor"/>
      <path d="M13.6 17.6L20.2 11L18.4 9.2L13.7 11.6L11 10.7L9.9 11.8L12.4 13.2L11.1 15.6L12.2 16.7L13.6 14L13.6 17.6Z"
        fill="currentColor"/>
    </svg>
  );
}

export function RoutePlanet({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <circle cx="11.5" cy="12" r="7.2" stroke="currentColor" strokeWidth={strokeWidth}/>
      <path d="M11.5 4.8C8.9 7.4 8.9 16.6 11.5 19.2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M11.5 4.8C14.1 7.4 14.1 16.6 11.5 19.2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M4.6 9.6C7.3 10.7 15.7 10.7 18.4 9.6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M4.3 14.2C7.2 13.2 15.8 13.2 18.7 14.2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M19.4 5.4C19.4 6.85 17.6 9 17.6 9C17.6 9 15.8 6.85 15.8 5.4C15.8 4.41 16.61 3.6 17.6 3.6C18.59 3.6 19.4 4.41 19.4 5.4Z"
        fill="currentColor"/>
      <circle cx="17.6" cy="5.35" r="0.65" fill="white"/>
    </svg>
  );
}

export function LocaleMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M12 21.5C12 21.5 19 14.86 19 9.7C19 5.72 15.866 2.5 12 2.5C8.134 2.5 5 5.72 5 9.7C5 14.86 12 21.5 12 21.5Z"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <path d="M12 6.6C14.2 6.6 15.5 8.1 15.5 9.9C13.3 9.9 12 9.9 12 9.9C12 9.9 10.7 9.9 8.5 9.9C8.5 8.1 9.8 6.6 12 6.6Z"
        fill="currentColor"/>
      <path d="M12 9.9C12 11.8 12 13.3 12 13.3" stroke="currentColor" strokeWidth={strokeWidth * 0.7} strokeLinecap="round"/>
    </svg>
  );
}

export function MissiveMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <rect x="2.5" y="5.5" width="19" height="13.5" rx="2"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <path d="M3.2 6.3L12 12.6L20.8 6.3"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="17.6" cy="15.4" r="2.3" stroke="currentColor" strokeWidth={strokeWidth * 0.78}/>
      <path d="M16.6 15.4L17.3 16.1L18.7 14.6"
        stroke="currentColor" strokeWidth={strokeWidth * 0.78} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function RingMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M7.6 10.3C8.9 12.9 11.1 15.1 13.7 16.4L15.7 14.4C16 14.1 16.4 14 16.8 14.1C18 14.5 19.2 14.7 20.5 14.7C21.1 14.7 21.5 15.1 21.5 15.7V19C21.5 19.6 21.1 20 20.5 20C11.4 20 4 12.6 4 3.5C4 2.9 4.4 2.5 5 2.5H8.3C8.9 2.5 9.3 2.9 9.3 3.5C9.3 4.8 9.5 6 9.9 7.2C10 7.6 9.9 8 9.6 8.3L7.6 10.3Z"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M14.5 5.2C16.3 5.6 17.7 7 18.1 8.8" stroke="currentColor" strokeWidth={strokeWidth * 0.75} strokeLinecap="round"/>
      <path d="M14.9 2.4C17.9 2.9 20.3 5.3 20.8 8.3" stroke="currentColor" strokeWidth={strokeWidth * 0.75} strokeLinecap="round"/>
    </svg>
  );
}

// ─── Famille "Tampon de Voyage" — réseaux sociaux ─────────────────────────────

const SOCIAL_BADGE = "M7.5 2.6H16.2L21.4 7.8V16.2L16.2 21.4H7.5L2.3 16.2V7.8L7.5 2.6Z";
const SOCIAL_SPARK = "M19.1 3.7L19.6 4.9L20.8 5.4L19.6 5.9L19.1 7.1L18.6 5.9L17.4 5.4L18.6 4.9L19.1 3.7Z";

export function SocialFacette({ size = 20, className, style, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d={SOCIAL_BADGE} stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <path d="M13.6 8.4H12.5C11.2 8.4 10.2 9.4 10.2 10.7V12.2H8.5V14.5H10.2V19H12.6V14.5H14.3L14.6 12.2H12.6V10.9C12.6 10.4 13 10 13.5 10H14.6V8.5C14.6 8.5 14.1 8.4 13.6 8.4Z"
        fill="currentColor"/>
      <path d={SOCIAL_SPARK} fill="currentColor"/>
    </svg>
  );
}

export function SocialEnvol({ size = 20, className, style, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d={SOCIAL_BADGE} stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <path d="M17.5 9.3C17.1 9.5 16.7 9.6 16.3 9.7C16.7 9.4 17.1 8.9 17.2 8.4C16.8 8.6 16.4 8.8 15.9 8.9C15.5 8.5 15 8.2 14.4 8.2C13.2 8.2 12.3 9.1 12.3 10.3C12.3 10.5 12.3 10.6 12.4 10.8C10.6 10.7 9 9.8 7.9 8.5C7.7 8.8 7.6 9.2 7.6 9.6C7.6 10.3 8 11 8.5 11.4C8.2 11.4 7.9 11.3 7.6 11.1V11.2C7.6 12.2 8.3 13 9.2 13.2C9 13.3 8.8 13.3 8.6 13.3C8.5 13.3 8.3 13.3 8.2 13.3C8.5 14.1 9.2 14.7 10.1 14.7C9.4 15.3 8.5 15.6 7.5 15.6C7.3 15.6 7.2 15.6 7 15.6C7.9 16.2 9.1 16.5 10.3 16.5C14.4 16.5 16.6 13.1 16.6 10.2C16.6 10.1 16.6 10 16.6 9.9C17 9.6 17.4 9.3 17.5 9.3Z"
        fill="currentColor"/>
      <path d={SOCIAL_SPARK} fill="currentColor"/>
    </svg>
  );
}

export function SocialNoeud({ size = 20, className, style, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d={SOCIAL_BADGE} stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <circle cx="9" cy="9.3" r="1.2" fill="currentColor"/>
      <path d="M9 11.8V16.2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M11.8 16.2V13.4C11.8 12.3 12.6 11.4 13.7 11.4C14.8 11.4 15.6 12.3 15.6 13.4V16.2"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.8 16.2V11.9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d={SOCIAL_SPARK} fill="currentColor"/>
    </svg>
  );
}

export function SocialEcran({ size = 20, className, style, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d={SOCIAL_BADGE} stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <rect x="6.8" y="9" width="10.4" height="7.3" rx="2.2" stroke="currentColor" strokeWidth={strokeWidth}/>
      <path d="M10.4 10.9L14.6 12.65L10.4 14.4V10.9Z" fill="currentColor"/>
      <path d={SOCIAL_SPARK} fill="currentColor"/>
    </svg>
  );
}

/**
 * SocialObjectif — badge tampon avec boîtier photo + objectif concentrique (Instagram).
 */
export function SocialObjectif({ size = 20, className, style, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d={SOCIAL_BADGE} stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <rect x="6.5" y="9" width="11" height="8" rx="1.8"
        stroke="currentColor" strokeWidth={strokeWidth * 0.88}/>
      <rect x="9" y="7.8" width="3.5" height="1.4" rx="0.6"
        stroke="currentColor" strokeWidth={strokeWidth * 0.78}/>
      <circle cx="12" cy="13" r="2.2" stroke="currentColor" strokeWidth={strokeWidth * 0.88}/>
      <circle cx="12" cy="13" r="0.9" fill="currentColor"/>
      <circle cx="15.4" cy="10" r="0.6" fill="currentColor"/>
      <path d={SOCIAL_SPARK} fill="currentColor"/>
    </svg>
  );
}

// ─── Nouvelles icônes utilitaires ─────────────────────────────────────────────

/**
 * WaveMark — remplace MessageCircle (bouton WhatsApp).
 *
 * Redesignée fidèlement d'après les SVG WhatsApp officiels fournis :
 * bulle arrondie avec queue en bas à gauche (style WhatsApp),
 * et le motif intérieur caractéristique : corps de téléphone
 * avec les trois arcs concentriques de signal vocal — signature
 * immédiatement reconnaissable sans copier le logo officiel.
 */
export function WaveMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      {/* Bulle arrondie avec queue angulaire bas-gauche — style WhatsApp */}
      <path
        d="M12 2.5C7.03 2.5 3 6.53 3 11.5C3 13.3 3.52 14.98 4.42 16.4L3 21L7.74 19.62C9.1 20.48 10.49 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 2.5 12 2.5Z"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round"/>
      {/* Combiné téléphonique stylisé — silhouette WhatsApp intérieure */}
      <path
        d="M8.5 9.8C8.9 10.7 9.6 11.6 10.5 12.4C11.4 13.2 12.3 13.8 13.2 14.1L14.1 13.2C14.3 13 14.6 12.96 14.8 13.06C15.4 13.3 15.9 13.42 16.5 13.42C16.78 13.42 17 13.64 17 13.92V15.5C17 15.78 16.78 16 16.5 16C11.25 16 7 11.75 7 6.5C7 6.22 7.22 6 7.5 6H9.08C9.36 6 9.58 6.22 9.58 6.5C9.58 7.1 9.7 7.68 9.94 8.2C10.02 8.4 9.98 8.62 9.8 8.8L8.5 9.8Z"
        stroke="currentColor" strokeWidth={strokeWidth * 0.82} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

/**
 * CordeMark — remplace Handshake (SidebarCTA, LatestNews).
 */
export function CordeMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M2.5 14.5L5 8.5C5.3 7.7 6.2 7 7.5 7H9.5L11 9.5"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path
        d="M21.5 9.5L19 8C18.3 7.4 17.2 7 16 7L13 9.5"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 9.5C11 9.5 12 10.5 12 11.5"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M13 9.5C13 9.5 12 10.5 12 11.5"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <circle cx="12" cy="11.5" r="1.4" fill="currentColor"/>
      <path d="M2.5 14.5L5.5 17H11L12 15.5"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21.5 14.5L18.5 17H13L12 15.5"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/**
 * CaptureMark — remplace Camera (PartnershipCTA, salons).
 */
export function CaptureMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M2.5 9C2.5 7.9 3.4 7 4.5 7H7L8.5 4.5H15.5L17 7H19.5C20.6 7 21.5 7.9 21.5 9V17C21.5 18.1 20.6 19 19.5 19H4.5C3.4 19 2.5 18.1 2.5 17V9Z"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth={strokeWidth * 0.88}/>
      <circle cx="12" cy="13" r="1.3" fill="currentColor"/>
      <path d="M17.5 9.5L18.6 8.4"
        stroke="currentColor" strokeWidth={strokeWidth * 0.8} strokeLinecap="round"/>
      <path d="M5.5 9.5H7.2M5.5 9.5V11.2"
        stroke="currentColor" strokeWidth={strokeWidth * 0.75} strokeLinecap="round"/>
    </svg>
  );
}

/**
 * PlanMark — remplace Layout (publicité display).
 */
export function PlanMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <rect x="2.5" y="3" width="19" height="18" rx="2"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <rect x="4.5" y="5" width="5" height="14" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="11" y="5" width="8.5" height="5.5" rx="1"
        stroke="currentColor" strokeWidth={strokeWidth * 0.78} fill="none"/>
      <line x1="11" y1="13.5" x2="19.5" y2="13.5"
        stroke="currentColor" strokeWidth={strokeWidth * 0.78} strokeLinecap="round"/>
      <line x1="11" y1="16" x2="19.5" y2="16"
        stroke="currentColor" strokeWidth={strokeWidth * 0.78} strokeLinecap="round"/>
      <line x1="11" y1="18.5" x2="16.5" y2="18.5"
        stroke="currentColor" strokeWidth={strokeWidth * 0.78} strokeLinecap="round"/>
    </svg>
  );
}

/**
 * PlumeMark — remplace PenTool (contenus sponsorisés).
 */
export function PlumeMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M4 20L7.5 16.5"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path
        d="M7.5 16.5C7.5 16.5 9 14.5 12 12C15 9.5 18 5 20 4C20 4 20.5 8 18 11C15.5 14 11.5 15.5 7.5 16.5Z"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M20 4L13 13"
        stroke="currentColor" strokeWidth={strokeWidth * 0.65} strokeLinecap="round" opacity="0.7"/>
      <circle cx="13" cy="13" r="1.3" stroke="currentColor" strokeWidth={strokeWidth * 0.78} fill="none"/>
      <line x1="10" y1="16.5" x2="13" y2="13"
        stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity="0.6"/>
      <line x1="16" y1="9" x2="13" y2="13"
        stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity="0.6"/>
      <circle cx="10" cy="16.5" r="0.75" fill="currentColor"/>
      <circle cx="16" cy="9" r="0.75" fill="currentColor"/>
    </svg>
  );
}

/**
 * VolumeMark — remplace BookOpen (magazine, sidebar).
 */
export function VolumeMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M12 6C12 6 9 4.5 4 5V18C9 17 12 18.5 12 18.5V6Z"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <path d="M12 6C12 6 15 4.5 20 5V18C15 17 12 18.5 12 18.5V6Z"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <line x1="6" y1="9" x2="10.5" y2="8.5"
        stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity="0.7"/>
      <line x1="6" y1="12" x2="10.5" y2="11.5"
        stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity="0.7"/>
      <line x1="6" y1="15" x2="10.5" y2="14.5"
        stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity="0.45"/>
      <line x1="18" y1="9" x2="13.5" y2="8.5"
        stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity="0.7"/>
      <line x1="18" y1="12" x2="13.5" y2="11.5"
        stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity="0.7"/>
      <line x1="18" y1="15" x2="13.5" y2="14.5"
        stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity="0.45"/>
      <line x1="12" y1="5.5" x2="12" y2="19"
        stroke="currentColor" strokeWidth={strokeWidth * 0.9} strokeLinecap="round"/>
    </svg>
  );
}

/**
 * TribuneMark — remplace Mic2 (couverture salons).
 */
export function TribuneMark({ size = 20, className, style, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={className} style={style} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M12 3C10.3 3 9 4.3 9 6V12C9 13.7 10.3 15 12 15C13.7 15 15 13.7 15 12V6C15 4.3 13.7 3 12 3Z"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
      <line x1="10" y1="7.5" x2="14" y2="7.5"
        stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity="0.6"/>
      <line x1="10" y1="10.5" x2="14" y2="10.5"
        stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity="0.6"/>
      <path d="M7 11.5C7 14.8 9.2 17.5 12 17.5C14.8 17.5 17 14.8 17 11.5"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="12" y1="17.5" x2="12" y2="20.5"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="9" y1="20.5" x2="15" y2="20.5"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}
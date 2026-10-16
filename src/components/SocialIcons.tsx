import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const LinkedinIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={className}
    {...props}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0 0-3.34 1.67 1.67 0 0 0 0 3.34m1.4 9.74v-8.37H5.06v8.37h2.8z" />
  </svg>
);

export const YoutubeIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={className}
    {...props}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={className}
    {...props}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const WhatsappIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={className}
    {...props}
  >
    <path d="M12.031 0C5.394 0 0 5.394 0 12.031c0 2.115.552 4.179 1.603 5.998L.062 24l6.155-1.614a11.966 11.966 0 0 0 5.814 1.49h.005c6.634 0 12.029-5.396 12.029-12.031 0-3.214-1.252-6.234-3.525-8.508A11.95 11.95 0 0 0 12.031 0zm0 22.015h-.004a9.96 9.96 0 0 1-5.076-1.39l-.364-.216-3.771.988 1.006-3.676-.237-.378a9.957 9.957 0 0 1-1.536-5.312c0-5.508 4.482-9.99 9.991-9.99 2.668 0 5.176 1.04 7.062 2.925a9.932 9.932 0 0 1 2.922 7.064c0 5.509-4.482 9.99-9.99 9.99zm5.474-7.472c-.3-.15-1.775-.876-2.05-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.49a8.98 8.98 0 0 1-1.668-2.072c-.175-.3-.019-.462.131-.611.136-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.585-.492-.505-.675-.514-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375s-1.05 1.026-1.05 2.502 1.075 2.903 1.225 3.103c.15.2 2.115 3.23 5.124 4.531.716.31 1.275.495 1.71.634.719.229 1.373.197 1.89.12.577-.086 1.775-.726 2.025-1.427.25-.701.25-1.302.175-1.427-.075-.125-.275-.2-.575-.35z" />
  </svg>
);

export const ZoomIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={className}
    {...props}
  >
    <path d="M4.5 5.5A2.5 2.5 0 0 0 2 8v8a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5V8a2.5 2.5 0 0 0-2.5-2.5h-9zm13 3.42l3.418-2.279A1 1 0 0 1 22.5 7.47v9.06a1 1 0 0 1-1.582.83L17.5 15.08V8.92z" />
  </svg>
);

export const GoogleMeetIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <rect x="2" y="5" width="13" height="14" rx="2.5" fill="#00832d" />
    <path d="M15 9.5l6-4.5v14l-6-4.5V9.5z" fill="#00ac47" />
    <path d="M15 9.5l4-3v11l-4-3V9.5z" fill="#006622" opacity="0.3" />
    <path d="M2 16.5V19h2.5l7-7-2.5-2.5-7 7z" fill="#26a69a" opacity="0.4" />
  </svg>
);

export const TeamsIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={className}
    {...props}
  >
    <path d="M19.5 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm1.5 2h-3a1 1 0 0 0-1 1v4.5a3.5 3.5 0 0 0 3.5 3.5h.5a1 1 0 0 0 1-1V10.5a1 1 0 0 0-1-1zm-8-3a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm2 3h-4a2 2 0 0 0-2 2v6.5a4.5 4.5 0 0 0 4.5 4.5h.5a4.5 4.5 0 0 0 4.5-4.5V11.5a2 2 0 0 0-2-2zM5.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1.5 2H4a1 1 0 0 0-1 1v3.5A2.5 2.5 0 0 0 5.5 17h.5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1z" />
  </svg>
);

export const GmailIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={className}
    {...props}
  >
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

export const HostingerIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={className}
    {...props}
  >
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8l7 3.5v7.4l-7 3.5-7-3.5v-7.4l7-3.5zM8 9v6h2.5v-2h3v2H16V9h-2.5v2h-3V9H8z" />
  </svg>
);

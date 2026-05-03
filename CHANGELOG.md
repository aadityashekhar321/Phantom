# Changelog

All notable changes to Phantom will be documented in this file.

## [Unreleased]

## [1.2.0] - 2024-12-21

### Added
- **Server-Backed Share Link Revocation**: Expiring secure links with true server-side revocation (not device-local).
- **Share Link Registry API**: `/api/share/register`, `/api/share/revoke`, `/api/share/status` endpoints for persistent link management.
- **Encrypted Attachments Vault**: Batch file encryption and bundled `.phantom` archive support with unlock & restore flow.
- **Reduced Motion Accessibility**: Respects `prefers-reduced-motion` media query across all animated components.
- **Motion Safety Fallback**: GlassCard animations disable gracefully for users preferring reduced motion.

### Changed
- **Share Vault UI**: Consolidated revocation controls into single cleaner Share Vault panel.
- **Footer Legal Links**: Simplified to single "Legal Hub" entry point (removed individual policy link duplication).
- **GlassCard 3D Tilt**: Respects reduced-motion preference; spring physics smoothing applied.
- **Vault Advanced Section**: Constrained 3D hover overflow with perspective clipping to prevent horizontal scrollbar.
- **Link Expiry Labels**: Updated copy to reflect server-managed (not device-local) revocation.

### Fixed
- **Share Link Validation**: Server now validates link status before accepting payload (prevents revoked/expired links from loading).
- **Archive Restore Path**: Fixed `.phantom` file restore flow to properly unlock and download individual files.
- **Motion Fallback**: Animations now safely disable when `prefers-reduced-motion: reduce` is set.

## [1.1.0] - 2024-12-20

### Added
- **Legal & Compliance Hub**: Privacy Policy, Security Policy, Terms of Service, Accessibility Statement, Data Practices pages.
- **Shared PolicyPage Component**: Unified layout for all policy pages with consistent styling.
- **Legal Hub Landing Page**: Centralized entry point for all legal documents with visual cards.
- **Card Animations**: Framer Motion hover effects and entry transitions on policy cards.
- **Mouse-Parallax Tilt**: 3D hover tilt effect on GlassCard components with spring smoothing.
- **Overflow Safety**: Clipped perspective wrapper on Vault Advanced Image Handling section to prevent page overflow.
- **Footer Legal Links**: Updated footer to include Legal Hub and all policy pages.

### Changed
- **PolicyPage Component**: Refactored policy pages to use shared layout pattern.
- **Footer Navigation**: Simplified legal links to single Legal Hub entry point.
- **GlassCard Motion**: Added Framer Motion support with reduced-motion accessibility fallback.

### Fixed
- **Analytics Telemetry Removal**: Removed unused telemetry tracking.
- **Canvas Compatibility**: Added polyfill for canvas.roundRect on older browsers.
- **Password Generator Entropy Bias**: Fixed rejection sampling to ensure uniform distribution.
- **Locale Hydration**: Fixed SSR mismatch by setting document.lang on mount.
- **Share-Link Size Guard**: Added payload size validation before URL generation.
- **TypeScript Compatibility**: Fixed global.d.ts for proper Web Crypto API typing.

## [1.0.0] - 2024-12-15
- Initial release of Phantom with core encryption features.

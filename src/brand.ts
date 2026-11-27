/** Public brand-colour reference: https://vinuni.edu.vn/wp-content/uploads/2025/04/VINUNIVERSITY-BRAND-COLOUR.pdf */
export const brand = {
  name: 'VinUni AR Map',
  shortName: 'VinUni AR Map',
  description: 'Khám phá khuôn viên VinUni, tìm phòng và trải nghiệm dẫn đường với mascot.',
  colors: { red: '#C4232A', blue: '#35426E', secondaryBlue: '#2E548A', background: '#101624' },
} as const

export const savedPlacesKey = 'vinuni-ar-map.saved.v1'
// Read only as a migration fallback, so renaming the app does not lose bookmarks.
export const legacySavedPlacesKey = 'sunshine.saved.v1'

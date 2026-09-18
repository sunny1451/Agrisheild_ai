export type ThemeId = 'emerald' | 'ocean' | 'indigo' | 'teal' | 'amber' | 'midnight';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  primaryColor: string; // #064D3B Primary dark green
  secondaryColor: string; // #2E7D32 Secondary green
  bgColor: string; // #EAF6E5 Light green background
  accentColor: string; // #66BB6A Accent green
  sidebarBg: string;
  sidebarActiveBg: string;
  sidebarText: string;
  sidebarActiveText: string;
  sidebarMutedText: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  accentButtonBg: string;
  accentButtonHover: string;
  brandIconBg: string;
  brandIconText: string;
  gaugeScoreColor: string;
  cardHighlightBorder: string;
  previewColor: string;
}

export const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'AgriShield Green',
    subtitle: 'Primary Dark Green & Pure Agriculture Theme',
    primaryColor: '#064D3B',
    secondaryColor: '#2E7D32',
    bgColor: '#EAF6E5',
    accentColor: '#66BB6A',
    sidebarBg: 'bg-[#064D3B]',
    sidebarActiveBg: 'bg-[#2E7D32]',
    sidebarText: 'text-white',
    sidebarActiveText: 'text-white',
    sidebarMutedText: 'text-[#EAF6E5]/80',
    accentBg: 'bg-[#EAF6E5]',
    accentText: 'text-[#064D3B]',
    accentBorder: 'border-[#66BB6A]/40',
    accentButtonBg: 'bg-[#064D3B]',
    accentButtonHover: 'hover:bg-[#2E7D32]',
    brandIconBg: 'bg-[#2E7D32]',
    brandIconText: 'text-white',
    gaugeScoreColor: '#064D3B',
    cardHighlightBorder: 'border-[#66BB6A] ring-2 ring-[#66BB6A]/20',
    previewColor: '#064D3B'
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Sapphire',
    subtitle: 'Precision IoT & High-Tech Blue',
    primaryColor: '#064D3B',
    secondaryColor: '#2E7D32',
    bgColor: '#EAF6E5',
    accentColor: '#66BB6A',
    sidebarBg: 'bg-[#064D3B]',
    sidebarActiveBg: 'bg-[#2E7D32]',
    sidebarText: 'text-white',
    sidebarActiveText: 'text-white',
    sidebarMutedText: 'text-[#EAF6E5]/80',
    accentBg: 'bg-[#EAF6E5]',
    accentText: 'text-[#064D3B]',
    accentBorder: 'border-[#66BB6A]/40',
    accentButtonBg: 'bg-[#064D3B]',
    accentButtonHover: 'hover:bg-[#2E7D32]',
    brandIconBg: 'bg-[#2E7D32]',
    brandIconText: 'text-white',
    gaugeScoreColor: '#064D3B',
    cardHighlightBorder: 'border-[#66BB6A] ring-2 ring-[#66BB6A]/20',
    previewColor: '#2563eb'
  },
  indigo: {
    id: 'indigo',
    name: 'Enterprise Indigo',
    subtitle: 'Modern Clean Digital Twin',
    primaryColor: '#064D3B',
    secondaryColor: '#2E7D32',
    bgColor: '#EAF6E5',
    accentColor: '#66BB6A',
    sidebarBg: 'bg-[#064D3B]',
    sidebarActiveBg: 'bg-[#2E7D32]',
    sidebarText: 'text-white',
    sidebarActiveText: 'text-white',
    sidebarMutedText: 'text-[#EAF6E5]/80',
    accentBg: 'bg-[#EAF6E5]',
    accentText: 'text-[#064D3B]',
    accentBorder: 'border-[#66BB6A]/40',
    accentButtonBg: 'bg-[#064D3B]',
    accentButtonHover: 'hover:bg-[#2E7D32]',
    brandIconBg: 'bg-[#2E7D32]',
    brandIconText: 'text-white',
    gaugeScoreColor: '#064D3B',
    cardHighlightBorder: 'border-[#66BB6A] ring-2 ring-[#66BB6A]/20',
    previewColor: '#6366f1'
  },
  teal: {
    id: 'teal',
    name: 'Hydro Teal',
    subtitle: 'Aquatic & Water Management',
    primaryColor: '#064D3B',
    secondaryColor: '#2E7D32',
    bgColor: '#EAF6E5',
    accentColor: '#66BB6A',
    sidebarBg: 'bg-[#064D3B]',
    sidebarActiveBg: 'bg-[#2E7D32]',
    sidebarText: 'text-white',
    sidebarActiveText: 'text-white',
    sidebarMutedText: 'text-[#EAF6E5]/80',
    accentBg: 'bg-[#EAF6E5]',
    accentText: 'text-[#064D3B]',
    accentBorder: 'border-[#66BB6A]/40',
    accentButtonBg: 'bg-[#064D3B]',
    accentButtonHover: 'hover:bg-[#2E7D32]',
    brandIconBg: 'bg-[#2E7D32]',
    brandIconText: 'text-white',
    gaugeScoreColor: '#064D3B',
    cardHighlightBorder: 'border-[#66BB6A] ring-2 ring-[#66BB6A]/20',
    previewColor: '#14b8a6'
  },
  amber: {
    id: 'amber',
    name: 'Solar Harvest',
    subtitle: 'Warm Agronomic Earth & Sun',
    primaryColor: '#064D3B',
    secondaryColor: '#2E7D32',
    bgColor: '#EAF6E5',
    accentColor: '#66BB6A',
    sidebarBg: 'bg-[#064D3B]',
    sidebarActiveBg: 'bg-[#2E7D32]',
    sidebarText: 'text-white',
    sidebarActiveText: 'text-white',
    sidebarMutedText: 'text-[#EAF6E5]/80',
    accentBg: 'bg-[#EAF6E5]',
    accentText: 'text-[#064D3B]',
    accentBorder: 'border-[#66BB6A]/40',
    accentButtonBg: 'bg-[#064D3B]',
    accentButtonHover: 'hover:bg-[#2E7D32]',
    brandIconBg: 'bg-[#2E7D32]',
    brandIconText: 'text-white',
    gaugeScoreColor: '#064D3B',
    cardHighlightBorder: 'border-[#66BB6A] ring-2 ring-[#66BB6A]/20',
    previewColor: '#f59e0b'
  },
  midnight: {
    id: 'midnight',
    name: 'Obsidian Midnight',
    subtitle: 'High-Contrast Dark Theme',
    primaryColor: '#064D3B',
    secondaryColor: '#2E7D32',
    bgColor: '#EAF6E5',
    accentColor: '#66BB6A',
    sidebarBg: 'bg-[#064D3B]',
    sidebarActiveBg: 'bg-[#2E7D32]',
    sidebarText: 'text-white',
    sidebarActiveText: 'text-white',
    sidebarMutedText: 'text-[#EAF6E5]/80',
    accentBg: 'bg-[#EAF6E5]',
    accentText: 'text-[#064D3B]',
    accentBorder: 'border-[#66BB6A]/40',
    accentButtonBg: 'bg-[#064D3B]',
    accentButtonHover: 'hover:bg-[#2E7D32]',
    brandIconBg: 'bg-[#2E7D32]',
    brandIconText: 'text-white',
    gaugeScoreColor: '#064D3B',
    cardHighlightBorder: 'border-[#66BB6A] ring-2 ring-[#66BB6A]/20',
    previewColor: '#064D3B'
  }
};


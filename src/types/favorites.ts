import { ActiveTab } from '@/components/Sidebar';

export type FavoriteKey = ActiveTab | 'STRATEGIC_ACCOUNTS' | 'QUOTATIONS_PI' | string;

export interface PageDefinition {
  id: FavoriteKey;
  targetTab: ActiveTab;
  subTab?: string;
  label: string;
  shortLabel: string;
  category: string;
  badge?: string;
  phase?: string;
  description: string;
  iconName: string;
}

export interface FavoriteItem {
  id: FavoriteKey;
  addedAt: number;
}

import type { Path } from '$app/types';
import type { LucideIcon } from '@lucide/svelte';

export interface NavItem {
  title: string;
  url: Path;
  icon: LucideIcon;
}

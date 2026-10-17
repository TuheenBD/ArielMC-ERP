export type AccountHeadType = 'EXPENSE' | 'INCOME';

export interface AccountHead {
  id: string;
  name: string;
  code?: string;
  type: AccountHeadType;
  description?: string;
  subCategories: string[];
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

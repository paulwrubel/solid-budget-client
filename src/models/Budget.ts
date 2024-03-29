export interface Category {
    id: string;
    groupID: string;
    name: string;
    sort: number;

    allocations: { amount: number; month: number }[];
}

export interface CategoryGroup {
    id: string;
    name: string;
    sort: number;
}

export interface Account {
    id: string;
    name: string;
    isOffBudget?: boolean;
}

export interface Transaction {
    id: string;
    accountID?: string;
    timestamp: number;
    categoryID?: string;
    note?: string;
    amount: number;
}

export interface BudgetHeader {
    id: string;
    name: string;
    createdAt: number;
    modifiedAt: number;
    accessedAt: number;
}

export interface Budget extends BudgetHeader {
    categoryGroups?: CategoryGroup[];
    categories?: Category[];
    accounts?: Account[];
    transactions?: Transaction[];
}

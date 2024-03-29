/* eslint-disable sonarjs/no-identical-functions */
import dayjs from "dayjs";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "data/Store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useBudgetHeaders = () =>
    useAppSelector((state) => state.metadata.budgetHeaders);

export const useActiveBudgetID = () =>
    useAppSelector((state) => state.core.activeBudgetID);

export const useSelectedMonth = () =>
    useAppSelector(
        (state) =>
            state.core.selectedMonth ?? dayjs().startOf("month").valueOf(),
    );

export const useAccountIDs = () =>
    useAppSelector((state) =>
        (state.budget?.accounts ?? []).map((account) => account.id),
    );

export const useAccounts = () =>
    useAppSelector((state) => state.budget?.accounts ?? []);

export const useActiveBudgetHeader = () =>
    useAppSelector((state) =>
        state.metadata.budgetHeaders?.find(
            (header) => header.id === state.core.activeBudgetID,
        ),
    );

export const useAccount = (id: string) =>
    useAppSelector((state) =>
        state.budget?.accounts?.find((account) => account.id === id),
    );

export const useCategories = () =>
    useAppSelector((state) =>
        (state.budget?.categories ?? []).filter(
            ({ groupID }) => groupID !== "__cg_id_0__",
        ),
    );

export const useCategoriesIncludeSystem = () =>
    useAppSelector((state) => state.budget?.categories ?? []);

export const useCategoriesByGroupID = (groupID: string) =>
    useCategories().filter((category) => category.groupID === groupID);

export const useCategoryGroups = () =>
    useAppSelector((state) =>
        (state.budget?.categoryGroups ?? []).filter(
            ({ id }) => id !== "__cg_id_0__",
        ),
    );

export const useCategoryGroupsIncludeSystem = () =>
    useAppSelector((state) => state.budget?.categoryGroups ?? []);

export const useTransactions = () =>
    useAppSelector((state) => state.budget?.transactions ?? []);

export const useTransactionsByAccountID = (accountID: string) =>
    useAppSelector((state) =>
        (state.budget?.transactions ?? []).filter(
            (transaction) => transaction.accountID === accountID,
        ),
    );

export const useAllocatedByCategoryIDAndMonth = (
    categoryID: string,
    month: number,
) =>
    useAppSelector(
        (state) =>
            state.budget?.categories
                ?.find(({ id }) => id === categoryID)
                ?.allocations?.find(({ month: catMonth }) => month === catMonth)
                ?.amount ?? 0,
    );

export const useActivityByCategoryIDAndMonth = (
    categoryID: string,
    month: number,
) =>
    useAppSelector(
        (state) =>
            state.budget?.transactions
                ?.filter(
                    ({ timestamp, categoryID: tCategoryID }) =>
                        tCategoryID === categoryID &&
                        dayjs(timestamp).isBetween(
                            dayjs(month),
                            dayjs(month).add(1, "month"),
                            "day",
                            "[)",
                        ),
                )
                ?.reduce((total, { amount }) => total + amount, 0) ?? 0,
    );

export const useBalanceByCategoryIDAndMonth = (
    categoryID: string,
    month: number,
) =>
    useAppSelector(
        (state) =>
            // get transaction values for this category before or equal to this month
            (state.budget?.transactions
                ?.filter(
                    ({ timestamp, categoryID: tCategoryID }) =>
                        tCategoryID === categoryID &&
                        dayjs(timestamp).isBefore(dayjs(month).add(1, "month")),
                )
                ?.reduce((total, { amount }) => total + amount, 0) ?? 0) +
            // get category allocations for this category before or equal to this month
            (state.budget?.categories
                ?.find(({ id }) => id === categoryID)
                ?.allocations?.filter(({ month: catMonth }) =>
                    dayjs(catMonth).isBefore(dayjs(month).add(1, "month")),
                )
                .reduce((total, { amount }) => total + amount, 0) ?? 0),
    );

export const useTotalBalanceByMonth = (month: number) =>
    useAppSelector(
        (state) =>
            state.budget?.categories?.reduce(
                (catTotal, { id: categoryID, allocations }) =>
                    catTotal +
                        // get transaction values for this category before or equal to this month
                        (state.budget?.transactions
                            ?.filter(
                                ({ timestamp, categoryID: tCategoryID }) =>
                                    tCategoryID === categoryID &&
                                    dayjs(timestamp).isBefore(
                                        dayjs(month).add(1, "month"),
                                    ),
                            )
                            ?.reduce(
                                (total, { amount }) => total + amount,
                                0,
                            ) ?? 0) +
                        // get category allocations for this category before or equal to this month
                        allocations
                            ?.filter(({ month: catMonth }) =>
                                dayjs(catMonth).isBefore(
                                    dayjs(month).add(1, "month"),
                                ),
                            )
                            ?.reduce(
                                (total, { amount }) => total + amount,
                                0,
                            ) ?? 0,
                0,
            ) ?? 0,
    );

export const useTotalActivityByMonth = (month: number) =>
    useAppSelector(
        (state) =>
            state.budget?.transactions
                ?.filter(({ timestamp }) =>
                    dayjs(timestamp).isSame(dayjs(month), "month"),
                )
                ?.reduce((total, { amount }) => total + amount, 0) ?? 0,
    );

export const useTotalAllocatedByMonth = (month: number) =>
    useAppSelector(
        (state) =>
            state.budget?.categories?.reduce(
                (total, { allocations }) =>
                    total +
                        allocations
                            ?.filter(({ month: catMonth }) =>
                                dayjs(catMonth).isSame(dayjs(month), "month"),
                            )
                            ?.reduce(
                                (aTotal, { amount }) => aTotal + amount,
                                0,
                            ) ?? 0,
                0,
            ) ?? 0,
    );

export const useTotalAllocatedSoFar = (month: number) =>
    useAppSelector(
        (state) =>
            state.budget?.categories?.reduce(
                (total, { allocations }) =>
                    total +
                        allocations
                            ?.filter(({ month: catMonth }) =>
                                dayjs(catMonth).isBefore(
                                    dayjs(month).add(1, "month"),
                                ),
                            )
                            ?.reduce(
                                (aTotal, { amount }) => aTotal + amount,
                                0,
                            ) ?? 0,
                0,
            ) ?? 0,
    );

export const useTotalAllocated = () =>
    useAppSelector(
        (state) =>
            state.budget?.categories?.reduce(
                (total, { allocations }) =>
                    total +
                        allocations?.reduce(
                            (aTotal, { amount }) => aTotal + amount,
                            0,
                        ) ?? 0,
                0,
            ) ?? 0,
    );

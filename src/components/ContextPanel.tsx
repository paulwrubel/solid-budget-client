/* eslint-disable sonarjs/no-duplicate-string */
import { Box, Paper, Typography } from "@mui/material";

import dayjs, { extend as dayjsExtend } from "dayjs";
import IsBetween from "dayjs/plugin/isBetween";
import IsSameOrBefore from "dayjs/plugin/isSameOrBefore";

import {
    useAccounts,
    useSelectedMonth,
    useTotalActivityByMonth,
    useTotalAllocated,
    useTotalAllocatedByMonth,
    useTotalAllocatedSoFar,
    useTotalBalanceByMonth,
    useTransactions,
} from "data/Hooks";
import { formatCurrencyCents } from "Utils";

const ContextPanel: React.FC = () => {
    dayjsExtend(IsBetween);
    dayjsExtend(IsSameOrBefore);

    const accounts = useAccounts();

    const selectedMonth = useSelectedMonth();
    // const categories = useCategories();
    const transactions = useTransactions();

    const totalBalance = useTotalBalanceByMonth(selectedMonth);
    const totalActivityThisMonth = useTotalActivityByMonth(selectedMonth);
    const totalAllocated = useTotalAllocated();
    const totalAllocatedThisMonth = useTotalAllocatedByMonth(selectedMonth);
    const totalAllocatedSoFar = useTotalAllocatedSoFar(selectedMonth);

    const today = dayjs().startOf("day");
    const transactionsTotal =
        transactions
            .filter(
                (t) =>
                    !accounts.find((a) => a.id === t.accountID)?.isOffBudget &&
                    dayjs(t.timestamp).isSameOrBefore(today),
            )
            .reduce((total, { amount }) => total + amount, 0) ?? 0;
    const totalUnallocated = transactionsTotal - totalAllocated;
    console.log(`total unallocated: ${formatCurrencyCents(totalUnallocated)}`);
    console.log("=");
    console.log(
        `transactions total: ${formatCurrencyCents(transactionsTotal)}`,
    );
    console.log("-");
    console.log(`total allocated: ${formatCurrencyCents(totalAllocated)}`);
    console.log("--- ALSO ---");
    console.log(
        `total activity this month: ${formatCurrencyCents(
            totalActivityThisMonth,
        )}`,
    );

    const totalAllocatedInFuture = totalAllocated - totalAllocatedSoFar;

    return (
        <Paper
            square
            elevation={0}
            sx={{ height: 1, bgcolor: "primary.light" }}
            color="blue"
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: 1,
                        boxSizing: "border-box",
                        m: 1,
                        backgroundColor:
                            totalUnallocated === 0
                                ? undefined
                                : totalUnallocated > 0
                                ? "warning.light"
                                : "error.light",
                    }}
                >
                    <Box
                        sx={{
                            p: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h4">
                            {formatCurrencyCents(totalUnallocated)}
                        </Typography>
                        {totalUnallocated === 0 && (
                            <Typography>All Funds Allocated</Typography>
                        )}
                        {totalUnallocated > 0 && (
                            <Typography>Unallocated Funds</Typography>
                        )}
                        {totalUnallocated < 0 && (
                            <Typography>Overallocated Funds</Typography>
                        )}
                        {totalUnallocated !== 0 &&
                            totalAllocatedInFuture !== 0 && (
                                <Typography variant="subtitle2">
                                    {formatCurrencyCents(
                                        totalAllocatedInFuture,
                                    )}{" "}
                                    allocated in the future
                                </Typography>
                            )}
                    </Box>
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        width: 1,
                        boxSizing: "border-box",
                        m: 1,
                        p: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "stretch",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography>Total Allocated</Typography>
                            <Typography>
                                {formatCurrencyCents(totalAllocatedThisMonth)}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography>Total Activity</Typography>
                            <Typography>
                                {formatCurrencyCents(totalActivityThisMonth)}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography>Total Balance</Typography>
                            <Typography>
                                {formatCurrencyCents(totalBalance)}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Paper>
    );
};

export default ContextPanel;

import { Box, Divider, Paper, SxProps, Typography } from "@mui/material";

const Item = ({
    children,
    sx,
}: {
    children: React.ReactNode;
    sx?: SxProps;
}) => {
    return <Box sx={{ px: 1, boxSizing: "border-box", ...sx }}>{children}</Box>;
};

// const Divider = () => {
//     return (
//         <Box
//             sx={{
//                 alignSelf: "stretch",
//                 mx: 1,
//                 border: "1px solid",
//                 borderColor: "gray",
//                 // borderRadius: "full",
//             }}
//         />
//     );
// };

const TransactionsLabelsRow = ({
    all,
    isOnBudget,
    columnRatios,
}: // styleHeight,
{
    all: boolean;
    isOnBudget: boolean;
    columnRatios: number[];
    // styleHeight: number;
}) => {
    let columnIndex = 0;

    return (
        <Paper
            square
            elevation={1}
            sx={{
                flex: "0 0 auto",
                mb: 0.4,
                // position: "sticky",
                // top: 64,
                // height: styleHeight,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {all && (
                    <>
                        <Item sx={{ width: columnRatios[columnIndex++] }}>
                            <Typography>Account</Typography>
                        </Item>
                        <Divider orientation="vertical" flexItem />
                    </>
                )}
                <Item sx={{ width: columnRatios[columnIndex++] }}>
                    <Typography>Date</Typography>
                </Item>
                <Divider orientation="vertical" flexItem />
                {isOnBudget && (
                    <Item
                        sx={{
                            width: columnRatios[columnIndex++],
                            // maxWidth: columnRatios[columnIndex++],
                        }}
                    >
                        <Typography>Category</Typography>
                    </Item>
                )}
                <Divider orientation="vertical" flexItem />
                <Item sx={{ width: columnRatios[columnIndex++] }}>
                    <Typography>Note</Typography>
                </Item>
                <Divider orientation="vertical" flexItem />
                <Item sx={{ width: columnRatios[columnIndex++] }}>
                    <Typography sx={{ textAlign: "right" }}>Outflow</Typography>
                </Item>
                <Divider orientation="vertical" flexItem />
                <Item sx={{ width: columnRatios[columnIndex++] }}>
                    <Typography sx={{ textAlign: "right" }}>Inflow</Typography>
                </Item>
            </Box>
        </Paper>
    );
};

export default TransactionsLabelsRow;

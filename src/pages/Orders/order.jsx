import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowDown, ArrowUp, Search, Table } from "lucide-react";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { FadeLoader } from "react-spinners";
import CloseIcon from "@mui/icons-material/Close";
import { darkOnlyInputSx, darkOnlySelectSx } from "../../app/muiStyle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../app/theme/themeContext";
import NoOrder from "../../app/components/noOrder";
import { orders } from "./order";

const Orders = () => {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [filterOrder, setFilterOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);

  const handleOpenDialog = () => setDialog(true);
  const handleCloseDialog = () => setDialog(false);

  const columns = [
    { field: "id", headerName: "Order", width: 70 },
    { field: "date", headerName: "Data", width: 130 },
    { field: "fullName", headerName: "Customer", width: 130 },
    {
      field: "status",
      headerName: "Payment status",
      width: 110,
      renderCell: (params) => {
        const value = params.value;

        let bg = "";
        let color = "";
        if (value === "Оплаченный") {
          bg = "#D1FAE5";
        }
        if (value === "В ожидании") {
          bg = "#E5E7EB";
        }
        if (value === "Оплаченный") {
          color = "#065F46";
        }
        if (value === "В ожидании") {
          color = "#374151";
        }

        return (
          <span
            style={{
              backgroundColor: bg,
              color: color,
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        const value = params.value;

        let bg = "";
        let color = "#fff";

        if (value === "Готовый") bg = "#F59E0B";
        if (value === "Отправленный") bg = "#6B7280";
        if (value === "Полученный") bg = "#2563EB";

        return (
          <span
            style={{
              backgroundColor: bg,
              color: color,
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            {value}
          </span>
        );
      },
    },
    { field: "totalPrice", headerName: "Total", width: 130 },
  ];

  const rows = orders.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    orderStatus: user.orderStatus,
    status: user.status,
    totalPrice: `$${user.totalPrice}`,
    date: user.date,
  }));

  const filter = rows
    .filter((elem) =>
      elem.fullName?.toLowerCase().includes(search.toLowerCase().trim()),
    )
    .sort((el1, el2) => {
      if (filterOrder == "Smail")
        return (
          parseFloat(el1.totalPrice?.replace("$", "")) -
          parseFloat(el2.totalPrice?.replace("$", ""))
        );
      if (filterOrder == "Big")
        return (
          parseFloat(el2.totalPrice?.replace("$", "")) -
          parseFloat(el1.totalPrice?.replace("$", ""))
        );
      return 0;
    });

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Box>
      <header className="flex justify-between px-2 items-center gap-3 flex-col md:flex-row">
        <Box className="flex justify-center gap-3 flex-col md:flex-row ">
          <TextField
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="поиск..."
            sx={darkOnlyInputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl
            sx={{ minWidth: 200, width: "100%", md: { width: 250 } }}
          >
            <InputLabel id="Filter">Фильтр</InputLabel>
            <Select
              labelId="Filter"
              value={filterOrder}
              onChange={(e) => setFilterOrder(e.target.value)}
              label="Filter"
              sx={darkOnlySelectSx}
            >
              <MenuItem value={"All"}>
                <span className="flex items-center gap-3">
                  <Table className="text-[12px]" />
                  Все покупки
                </span>
              </MenuItem>
              <MenuItem value={"Smail"}>
                <span className="flex items-center gap-3">
                  <ArrowDown className="text-[12px]" />
                  Мелкие покупки
                </span>
              </MenuItem>
              <MenuItem value={"Big"}>
                <span className="flex items-center gap-3">
                  <ArrowUp className="text-[12px]" />
                  Крупные покупки
                </span>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          className="flex gap-2 justify-center items-center "
          sx={{ backgroundColor: "red", color: "white" }}
          variant="contained"
          onClick={() => handleOpenDialog()}
          disabled={orders.length === 0}
        >
          Oчистить <DeleteIcon />
        </Button>
      </header>
      <main className="flex justify-center items-center pt-10">
        {loading ? (
          <FadeLoader
            color={theme === "light" ? "#0972fc" : "#8B5CF6"}
            className="mt-10"
          />
        ) : rows.length === 0 ? (
          <Box>
            <NoOrder />
          </Box>
        ) : (
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filter}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{
                border: 0,
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                },
              }}
            />
          </Paper>
        )}
      </main>

      <Dialog
        open={dialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box className="flex justify-between flex-col pr-5 pb-3">
          <Box className="flex justify-between items-center ">
            <DialogTitle id="alert-dialog-title">Удалить все заказы</DialogTitle>
            <CloseIcon className="cursor-pointer" onClick={handleCloseDialog} />
          </Box>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography sx={{ color: theme == "light" ? "black" : "white" }}>
                Чтобы удалить записи, нажмите красную кнопку. <br /> Вы
                действительно хотите удалить все заказы?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained">Отмена</Button>
            <Button color="error" variant="outlined" autoFocus>Удалить</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Orders;

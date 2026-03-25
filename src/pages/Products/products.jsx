
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Plus, Search, Table } from "lucide-react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { FadeLoader } from "react-spinners";
import { useTheme } from "../../app/theme/themeContext";
import { getCategories } from "../../features/Category/categories";
import { deleteProduct, getProducts } from "../../features/Products/products";
import { darkOnlyInputSx, darkOnlySelectSx } from "../../app/muiStyle";
import EmptyProducts from "../../app/components/ui/emptyProducts";
import { API } from "../../utils/config.js";

const paginationModel = { page: 0, pageSize: 5 };

function Products() {
  const categories = useSelector((store) => store.category.categories);
  const products = useSelector((store) => store.product.products);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    setLoading(true);
    dispatch(getCategories()).finally(() => setLoading(false));
    dispatch(getProducts());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "#", width: 70 },
    { field: "productName", headerName: "Продукт", width: 140 },
    { field: "category", headerName: "Категория", width: 140 },
    {
      field: "quantity",
      headerName: "Количество",
      type: "number",
      width: 120,
    },
    {
      field: "brand",
      headerName: "Бренд",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "date",
      headerName: "дата",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "actions",
      headerName: "Действия",
      description: "This column used deletes and updating products",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <Box className="flex gap-2 items-center ">
          <Link to={`/dashboard/editProduct/${params.row.id}`}>
            <EditSquareIcon
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ cursor: "pointer", color: "#2563EB" }}
            />
          </Link>
          <DeleteIcon
            onClick={(e) => {
              dispatch(deleteProduct(params.row.id));
              e.stopPropagation();
            }}
            style={{ cursor: "pointer", color: "red" }}
          />
        </Box>
      ),
    },
  ];

  const filteredRows = products
    ?.filter((product) =>
      product?.productName?.toLowerCase().includes(search.toLowerCase().trim()),
    )
    .filter((product) =>
      filterProduct && filterProduct !== "All"
        ? product?.category === filterProduct
        : true,
    )
    .map((product) => ({
      id: product.productId,
      productName: product.productName,
      category: product.category,
      quantity: product.quantity,
      brand: product.brand,
      date: new Date(product.date).toLocaleDateString(),
    }));

  const rows = products.map((product, i) => ({
    id: product.productId,
    productName: product.productName,
    category: product.category,
    quantity: product.quantity,
    brand: product.brand,
    date: new Date(product.date).toLocaleDateString(),
  }));

  return (
    <>
      <Box className="flex justify-between gap-3 items-center flex-wrap">
        <Box className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <TextField
            fullWidth
            placeholder="поиск..."
            sx={darkOnlyInputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  <Search className="absolute right-5" />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FormControl
            sx={{ minWidth: 200, width: "100%", md: { width: 250 } }}
          >
            <InputLabel id="Filter">Фильтр</InputLabel>
            <Select
              labelId="Filter"
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              label="Filter"
              sx={darkOnlySelectSx}
            >
              <MenuItem value={"All"}>
                <span className="flex items-center gap-3">
                  <Table className="text-[12px]" />
                  Все
                </span>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  value={category.categoryName}
                  key={category.categoryId}
                >
                  <Box className="flex items-center gap-3">
                    <img
                      src={`${API}/images/${category.categoryImage}`}
                      width={17}
                      alt=""
                    />
                    <span>{category.categoryName}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Link to={`/dashboard/add-product`}>
            <Button variant="contained">
              <Plus />
              Добавить товар
            </Button>
          </Link>
        </Box>
      </Box>

      <Box className="flex justify-center items-center px-1 py-5">
        {rows.length === 0 && loading ? (
          <FadeLoader
            color={theme === "light" ? "#2563EB" : "#8B5CF6"}
            className="mt-10"
          />
        ) : rows.length === 0 ? (
          <EmptyProducts />
        ) : (
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{ border: 0 }}
            />
          </Paper>
        )}
      </Box>
    </>
  );
}

export default Products;

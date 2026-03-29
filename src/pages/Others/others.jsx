import {
  Box,
  Button,
  Dialog,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { API } from "../../utils/config.js";
import DeleteIcon from "@mui/icons-material/Delete";
import { Plus, Search } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useRef, useState } from "react";
import { FadeLoader } from "react-spinners";
import { useTheme } from "../../app/theme/themeContext";
import { useDispatch, useSelector } from "react-redux";
import EmptyProducts from "../../app/components/emptyProducts";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../features/Category/categories";
import { darkOnlyInputSx } from "../../app/muiStyle";
import UploadImage from "../../app/components/uploadImage";
import {
  addBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "../../features/Brands/brands.js";
import {
  deleteProduct,
  getProducts,
} from "../../features/Products/products.js";
import { Link } from "react-router-dom";

const Ohters = () => {
  const [value, setValue] = useState("1");
  const [searchCategories, setSearchCategories] = useState("");
  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [dialog, setDialog] = useState(false);
  const [dialogEdit, setDialogEdit] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [searchProducts, setSearchProducts] = useState("");
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [dialogEditCategory, setDialogEditCategory] = useState(false);
  const [idx, setIdx] = useState(null);
  const [idxCategory, setIdxCategory] = useState(null);
  const [newNameCategory, setNewNameCategory] = useState("");
  const fileRef = useRef(null);
  const { theme } = useTheme();

  const handleClose = () => setDialog(false);
  const handleOpen = () => setDialog(true);
  const handleOpenEdit = () => setDialogEdit(true);
  const handleCloseEdit = () => setDialogEdit(false);
  const handleCloseDialogEditCategory = () => setDialogEditCategory(false);
  const handleOpenDialogEditCategory = () => setDialogEditCategory(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const categories = useSelector((store) => store.category.categories);
  const brands = useSelector((store) => store.brands.brands);
  const { products, loading } = useSelector((store) => store.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    const getCategory = async () => {
      setIsLoadingCategory(true);
      dispatch(getCategories());
      setIsLoadingCategory(false);
    };
    getCategory();
  }, [dispatch]);

  const addNewCategory = () => {
    if (categoryName.trim() !== "" && image !== null && image !== "") {
      const formData = new FormData();
      formData.append("categoryName", categoryName);
      formData.append("categoryImage", image);
      dispatch(addCategory({ formData }));
      handleClose();
      setImage(null);
      setCategoryName("");
    }
  };

  const editCategory = () => {
    if (newNameCategory.trim() !== "") {
      const formData = new FormData();
      formData.append("categoryName", newNameCategory);
      formData.append("categoryImage", newImage);
      formData.append("categoryId", idxCategory);
      dispatch(updateCategory({ formData }));
      handleCloseDialogEditCategory();
      setNewImage(null);
    }
  };

  const filterProducts = products.filter((product) =>
    product.productName
      ?.toLowerCase()
      .includes(searchProducts.toLowerCase().trim()),
  );

  return (
    <>
      <Box className="flex justify-between items-center gap-2 flex-col md:flex-row">
        <Typography variant="h5">Другой</Typography>
        <Button
          variant="contained"
          className="flex gap-2"
          onClick={handleOpen}
          sx={{
            backgroundColor: theme === "light" ? "" : "#8B5CF6",
            color: "white",
          }}
        >
          <Plus /> Добавить категорию
        </Button>
      </Box>
      <Box className="mt-5">
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                "& .MuiTabs-indicator": {
                  backgroundColor: theme === "light" ? "" : "#8B5CF6",
                },
              }}
            >
              <Tab
                sx={{
                  flex: 1,
                  "&.Mui-selected": {
                    color: theme === "light" ? "" : "#8B5CF6",
                  },
                }}
                label="КАТЕГОРИИ"
                value="1"
              />
              <Tab
                sx={{
                  flex: 1,
                  "&.Mui-selected": {
                    color: theme === "light" ? "" : "#8B5CF6",
                  },
                }}
                label="БРЕНДЫ"
                value="2"
              />
              <Tab
                sx={{
                  flex: 1,
                  "&.Mui-selected": {
                    color: theme === "light" ? "" : "#8B5CF6",
                  },
                }}
                label="ПРОДУКТЫ"
                value="3"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            {categories?.data?.length !== 0 && (
              <TextField
                fullWidth
                value={searchCategories}
                onChange={(e) => setSearchCategories(e.target.value)}
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
            )}
            <Box className="flex flex-wrap justify-evenly mt-3 items-center gap-4 pt-2">
              {isLoadingCategory || categories.length === 0 ? (
                <Box>
                  <FadeLoader
                    color={theme === "light" ? "#008cff" : "#8B5CF6"}
                  />
                </Box>
              ) : categories.length === 0 ? (
                <Box>
                  <Typography variant="h5">
                    В настоящее время категорий нет. 0
                  </Typography>
                </Box>
              ) : categories?.filter((elem) =>
                  elem?.categoryName
                    ?.toLowerCase()
                    .includes(searchCategories?.toLowerCase().trim()),
                ).length === 0 ? (
                <Typography variant="h5">
                  Результаты по вашему запросу не найдены:
                  <span className="text-red-400"> {searchCategories}</span>
                </Typography>
              ) : (
                categories
                  ?.filter((elem) =>
                    elem?.categoryName
                      ?.toLowerCase()
                      .includes(searchCategories.toLowerCase().trim()),
                  )
                  .map((category) => {
                    return (
                      <Box
                        key={category.categoryId}
                        className="flex flex-col items-start  border-1 px-7 py-5 pt-7 border-gray-300 gap-3 pt-2 justify-start"
                      >
                        <Box className="flex justify-center items-center gap-5 flex-col md:flex-row">
                          <Box>
                            <img
                              src={`${API}/images/${category.categoryImage}`}
                              alt="image"
                              className="w-25 h-50 md:h-25 object-cover "
                            />
                          </Box>
                          <Box className="flex flex-col gap-1">
                            <EditIcon
                              onClick={() => {
                                handleOpenDialogEditCategory();
                                setIdxCategory(category.categoryId);
                                setNewNameCategory(category.categoryName);
                              }}
                              className="cursor-pointer text-blue-500"
                            />
                            <DeleteIcon
                              onClick={() =>
                                dispatch(
                                  deleteCategory({ id: category.categoryId }),
                                )
                              }
                              className="cursor-pointer text-red-500"
                            />
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="h" className="font-black">
                            {category.categoryName}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
              )}
            </Box>
          </TabPanel>
          <TabPanel value="2">
            <Box className="flex items-start gap-4 flex-col-reverse md:flex-row">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 200 }} aria-label="simple table">
                  <TableHead>
                    <TableRow className={`${theme === "light" ? "bg-[#F5F5F5]" : ""}`}>
                      <TableCell
                        sx={{ width: "70%" }}
                        className="text-[#5A607F]"
                      >
                        Бренды
                      </TableCell>
                      <TableCell
                        sx={{ width: "30%", textAlign: "left" }}
                        className="text-[#5A607F]"
                      >
                        Действие
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {brands?.map((brand) => (
                      <TableRow key={brand.brandId}>
                        <TableCell>{brand.brandName}</TableCell>
                        <TableCell>
                          <Box className="flex gap-2 items-center justify-start">
                            <EditIcon
                              onClick={() => {
                                handleOpenEdit();
                                setNewBrandName(brand.brandName);
                                setIdx(brand.brandId);
                              }}
                              className="cursor-pointer text-blue-500"
                            />
                            <DeleteIcon
                              onClick={() =>
                                dispatch(deleteBrand(brand.brandId))
                              }
                              className="cursor-pointer text-red-500"
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                className="border-1 border-gray-300 px-5 py-5  flex flex-col gap-2"
                sx={{ width: { xs: "100%", sm: 400, md: 500 } }}
              >
                <Typography variant="h6">Добавить новый бренд</Typography>
                <TextField
                  sx={darkOnlyInputSx}
                  variant="outlined"
                  onChange={(e) => setBrandName(e.target.value)}
                  value={brandName}
                  placeholder="Название бренда"
                />
                <Box className="flex justify-end mt-2">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme === "light" ? "" : "#8B5CF6",
                      color: "white",
                    }}
                    onClick={() => {
                      if (brandName.trim() !== "") {
                        dispatch(addBrand(brandName));
                        setBrandName("");
                      }
                    }}
                  >
                    Создать
                  </Button>
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel sx={{ overflowX: "hidden" }} value="3">
            {products.length !== 0 && (
              <Box className="pb-3">
                <TextField
                  fullWidth
                  value={searchProducts}
                  onChange={(e) => setSearchProducts(e.target.value)}
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
              </Box>
            )}
            <Box>
              {loading && products.length === 0 ? (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <FadeLoader
                    color={theme === "light" ? "#008cff" : "#8B5CF6"}
                  />
                </Box>
              ) : products.length === 0 ? (
                <EmptyProducts />
              ) : filterProducts.length === 0 ? (
                <Box className="flex justify-center items-center">
                  <Typography variant="h5">
                    Результаты не найдены:
                    <span className="text-red-500">{searchProducts}</span>
                  </Typography>
                </Box>
              ) : (
                <Box className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {filterProducts.map((elem) => (
                    <Box
                      key={elem.productId}
                      className="border border-gray-300 px-4 py-3"
                    >
                      <Box className="flex justify-center">
                        <img
                          src={`${API}/images/${elem?.images[0]?.image}`}
                          alt={elem.productName}
                          width={100}
                        />
                      </Box>
                      <Box className="pt-4 grid grid-cols-1 gap-1">
                        <Typography>{elem.productName}</Typography>
                        <Typography>Категория: {elem.category}</Typography>
                        <Box className="flex flex-wrap gap-2 pt-2">
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: "#2563EB" }}
                          >
                            <Link to={`/dashboard/editProduct/${elem.productId}`}>
                              <EditIcon className="cursor-pointer text-white" />
                            </Link>
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: "red" }}
                          >
                            <DeleteIcon
                              onClick={() =>
                                dispatch(deleteProduct(elem.productId))
                              }
                              className="cursor-pointer text-white"
                            />
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>
        </TabContext>
      </Box>

      <Dialog open={dialog} onClose={handleClose}>
        <Box className="pt-6 px-10 flex flex-col gap-4 pb-4">
          <Box className="flex justify-between gap-5 items-center">
            <Typography variant="h6">Добавить категорию</Typography>
            <CloseIcon className="cursor-pointer" onClick={handleClose} />
          </Box>
          <Box>
            <TextField
              fullWidth
              placeholder="Название категории"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileRef}
              className="hidden"
              onChange={(e) => {
                const file = e?.target?.files?.[0];
                setImage(file);
              }}
            />
          </Box>
          <Box>
            <UploadImage click={() => fileRef.current?.click()} />
          </Box>
          <Box className="flex justify-end gap-3 pt-2">
            <Button onClick={handleClose} variant="outlined">
              Отмена
            </Button>
            <Button variant="contained" onClick={addNewCategory}>
              Создать
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={dialogEditCategory} onClose={handleCloseDialogEditCategory}>
        <Box className="pt-6 px-10 flex flex-col gap-4 pb-4">
          <Box className="flex justify-between gap-5 items-center">
            <Typography variant="h6">Редактировать категорию</Typography>
            <CloseIcon
              className="cursor-pointer"
              onClick={handleCloseDialogEditCategory}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              placeholder="Новое название категории"
              value={newNameCategory}
              onChange={(e) => setNewNameCategory(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileRef}
              className="hidden"
              onChange={(e) => {
                const file = e?.target?.files?.[0];
                setNewImage(file);
              }}
            />
          </Box>
          <Box>
            <UploadImage click={() => fileRef.current?.click()} />
          </Box>
          <Box className="flex justify-end gap-3 pt-2">
            <Button onClick={handleCloseDialogEditCategory} variant="outlined">
              Отмена
            </Button>
            <Button variant="contained" onClick={editCategory}>
              Редактировать
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={dialogEdit} onClose={handleCloseEdit}>
        <Box className="pt-6 px-10 flex flex-col gap-4 pb-4">
          <Box className="flex justify-between gap-5 items-center">
            <Typography variant="h6">Новое название бренда</Typography>
            <CloseIcon className="cursor-pointer" onClick={handleCloseEdit} />
          </Box>
          <Box>
            <TextField
              fullWidth
              placeholder="Название бренда"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
          </Box>
          <Box className="flex justify-end gap-3 pt-2">
            <Button onClick={handleCloseEdit} variant="outlined">
              Отмена
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (newBrandName.trim() !== "") {
                  dispatch(
                    updateBrand({ brandId: idx, brandName: newBrandName }),
                  );
                  setNewBrandName("");
                  setIdx(null);
                  handleCloseEdit();
                }
              }}
            >
              Редактировать бренд
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Ohters;

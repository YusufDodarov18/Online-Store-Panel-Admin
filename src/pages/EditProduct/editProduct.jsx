import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Chip,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Switch as Swt } from "@mui/material";
import { alpha, keyframes, styled } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "../../app/theme/themeContext";
import { darkOnlyInputSx, darkOnlySelectSx } from "../../app/muiStyle";
import UploadImage from "../../app/components/ui/uploadImage";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProduct,
  getProducts,
  deleteImageFromProduct,
  addImageToProduct,
} from "../../features/Products/products";
import { getCategories } from "../../features/Category/categories";
import { getBrands } from "../../features/Brands/brands";
import { API } from "../../utils/config";
import { deleteColor, getColors } from "../../features/Colors/colors";
import AddColor from "../../app/components/ui/color";
import axiosRequest from "../../utils/axiosRequest";

const Switch = styled(Swt)(({ theme }) => ({
  width: 43,
  height: 23,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 3,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(20px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2563EB",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 17,
    height: 17,
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 14,
    backgroundColor: "#D1D5E0",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

function EditProduct() {
  const products = useSelector((store) => store.product.products);
  const brands = useSelector((store) => store.brands.brands);
  const categories = useSelector((store) => store.category.categories);
  const colors = useSelector((store) => store.color.colors);
  const dispatch = useDispatch();

  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [newProductName, setNewProductName] = useState("");
  const [newCode, setNewCode] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState(null);
  const [newDisCount, setNewDisCount] = useState(null);
  const [newQuantity, setNewQuantity] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingColors, setIsLoadingColors] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [color, setColor] = useState("#000000");
  const [colorName, setColorName] = useState("");
  const [openOptionThings, setOpenOptionThings] = useState(false);
  const [variant, setVariant] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [weights, setWeights] = useState([]);
  const [options, setOptions] = useState([
    { id: 1, name: "Размер", values: ["S", "M", "L", "XL"] },
    { id: 2, name: "Масса", values: ["10", "20", "30", "40"] },
  ]);
  const fileRef = useRef();

  const handleClickOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      dispatch(getProducts());
      setIsLoading(false);
    };
    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    const fetchColors = async () => {
      setIsLoadingColors(true);
      await dispatch(getColors());
      setIsLoadingColors(false);
    };
    fetchColors();
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const findProductById = products.find((e) => e.productId === id);
      if (findProductById) {
        setNewProductName(findProductById.productName);
        setNewCode(findProductById.code);
        setNewDescription(findProductById.description);
        setNewBrand(findProductById?.brand);
        setNewCategory(findProductById.category);
        setNewPrice(findProductById.price); 
        setNewDisCount(findProductById.disCount);
        setNewQuantity(findProductById.quantity);
        setNewImages(findProductById.images);
        setSelectedColors(findProductById?.colors || []);
        setSizes(findProductById?.sizes || []);
        setWeights(findProductById?.weights || []);
      }
    }
  }, [id, products]);

  const clearForm = () => {
    setNewProductName("");
    setNewCode("");
    setNewDescription("");
    setNewBrand("");
    setNewCategory("");
    setNewPrice(null);
    setNewDisCount(null);
    setNewQuantity(null);
    setSelectedColors([]);
  };

  const editProduct = async () => {
    if (
      !newProductName ||
      !newCode ||
      !newCategory ||
      !newPrice ||
      !newQuantity
    ) {
      toast.error("Please fill in all required fields.", {
        autoClose: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("productName", newProductName);
    formData.append("code", newCode || uuidv4());
    formData.append("description", newDescription);
    formData.append("count", newQuantity);
    formData.append("disCount", newDisCount || 0);
    formData.append("brand", newBrand);
    formData.append("category", newCategory);
    formData.append("price", newPrice);
    formData.append("colors", JSON.stringify(selectedColors));
    formData.append("size", JSON.stringify(sizes));
    formData.append("weight", JSON.stringify(weights));

    try {
      setLoading(true);
      await dispatch(updateProduct({ productId: id, formData }));
      navigate("/dashboard/products");
      clearForm();
    } catch (error) {
      console.error("EditProduct error:", error);
      toast.error("Failed to edit product.", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChip = (optionId, value) => {
    if (optionId === 1) {
      setSizes((prev) => {
        if (prev.includes(value)) {
          toast.error(`Size "${value}" removed!`, { autoClose: 2000 });
          return prev.filter((v) => v !== value);
        } else {
          toast.success(`Size "${value}" selected successfully!`, {
            autoClose: 2000,
          });
          return [...prev, value];
        }
      });
    } else if (optionId === 2) {
      setWeights((prev) => {
        if (prev.includes(value)) {
          toast.error(`Weight "${value}" removed!`, { autoClose: 2000 });
          return prev.filter((v) => v !== value);
        } else {
          toast.success(`Weight "${value}" selected successfully!`, {
            autoClose: 2000,
          });
          return [...prev, value];
        }
      });
    }
  };

  const handleDeleteChip = (optionId, value) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId
          ? { ...opt, values: opt.values.filter((v) => v !== value) }
          : opt,
      ),
    );
    toast.success("Deleted SuccessFully", { autoClose: 2000 });
  };

  const loadingColor = keyframes`
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }`;

  return (
    <>
      <Box className="p-6">
        <header className="hidden items-center justify-between mb-6 flex-wrap gap-2 md:flex">
          <Typography
            variant="h5"
            className="text-2xl font-bold flex gap-3 items-center"
          >
            <Link to="/dashboard/products">
              <span className="text-blue-600 hover:underline">Продукты</span>
            </Link>
            <span>/ Редактировать товар</span>
          </Typography>
          <Box className="flex gap-3">
            <Link to={`/dashboard/products`}>
              <Button
                variant="outlined"
                sx={{ backgroundColor: theme === "light" ? "" : "#1e293b" }}
              >
                Отмена
              </Button>
            </Link>
            <Button
              variant="contained"
              disabled={loading}
              onClick={editProduct}
            >
              {loading ? "Сбережения..." : "Сохранять"}
            </Button>
          </Box>
        </header>

        <main className="flex flex-col md:flex-row gap-8">
          {/* LEFT SIDE */}
          <Box className="md:w-[60%] space-y-6">
            <section>
              <Typography variant="h5" className="text-lg font-semibold mb-2">
                Новая информация
              </Typography>
              <Box className="flex gap-4 mt-7 flex-col md:flex-row">
                <TextField
                  className="w-full border px-3 py-1 rounded"
                  placeholder="Название продукта"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  sx={darkOnlyInputSx}
                />
                <TextField
                  type="number"
                  sx={darkOnlyInputSx}
                  className="md:w-100 md:w-[30%] border px-3 py-2 rounded"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="code"
                />
              </Box>
              <textarea
                className="w-full border-1 border-gray-400  outline-blue-500 px-3 py-2 mt-4 rounded h-32 resize-none"
                placeholder="Описание"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{
                  backgroundColor: theme == "light" ? "" : "#1e293b",
                }}
              />
            </section>
            <section>
              <Box className="flex gap-4 flex-col md:flex-row">
                <FormControl sx={{ m: 1, width: 250 }}>
                  <InputLabel id="Filter">Фильтр</InputLabel>
                  <Select
                    labelId="Filter"
                    label="Filter"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    sx={darkOnlySelectSx}
                  >
                    {categories.map((category) => (
                      <MenuItem
                        value={category.categoryName}
                        key={category.categoryId}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={`${API}/images/${category.categoryImage}`}
                            width={20}
                            alt=""
                          />
                          <span>{category.categoryName}</span>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: 200 }}>
                  <InputLabel id="category-label">Бренды</InputLabel>
                  <Select
                    labelId="category-label"
                    label="Brands"
                    sx={darkOnlySelectSx}
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                  >
                    {brands.length === 0 ? (
                      <MenuItem value="Not Brand">Не бренд</MenuItem>
                    ) : (
                      brands.map((brand) => (
                        <MenuItem value={brand.brandName} key={brand.brandId}>
                          {brand.brandName}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Box>
            </section>
            <Typography variant="h6" className="text-lg font-semibold mb-2">
              Цена
            </Typography>
            <Box className="flex gap-4 flex-col md:flex-row">
              <TextField
                sx={darkOnlyInputSx}
                type="number"
                placeholder="Цена товара"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              <TextField
                sx={darkOnlyInputSx}
                type="number"
                placeholder="Скидка"
                value={newDisCount}
                onChange={(e) => setNewDisCount(e.target.value)}
              />
              <TextField
                sx={darkOnlyInputSx}
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                type="number"
                placeholder="Количество"
              />
            </Box>
            <Box sx={{ mt: 6 }}>
              <Box sx={{ maxWidth: 800, mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Switch
                    checked={openOptionThings}
                    onChange={() => setOpenOptionThings((p) => !p)}
                  />
                  <Typography variant="body1">
                    К цене этого товара добавляется налог.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "1px solid #e2e4e9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2.5,
                    py: 2,
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      Различные варианты
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Этот товар имеет несколько вариантов.
                    </Typography>
                  </Box>
                  <Switch
                    checked={variant}
                    onChange={() => setVariant((p) => !p)}
                  />
                </Box>
                {variant && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>
                      Параметры
                    </Typography>
                    {options.map((option) => (
                      <Box
                        key={option.id}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          component="fieldset"
                          sx={{
                            border: "1px solid #e2e4e9",
                            borderRadius: "8px",
                            px: 1.5,
                            py: 0.5,
                            m: 0,
                          }}
                        >
                          <Box
                            component="legend"
                            sx={{
                              fontSize: 11,
                              color: "text.secondary",
                              px: 0.5,
                            }}
                          >
                            Вариант {option.id}
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, pb: 0.5 }}
                          >
                            {option.name}
                          </Typography>
                        </Box>
                        <Box
                          component="fieldset"
                          sx={{
                            border: "1px solid #e2e4e9",
                            borderRadius: "8px",
                            px: 1.5,
                            py: 0.5,
                            m: 0,
                          }}
                        >
                          <Box
                            component="legend"
                            sx={{
                              fontSize: 11,
                              color: "text.secondary",
                              px: 0.5,
                            }}
                          >
                            Ценить
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              pb: 0.5,
                            }}
                          >
                            {option.values.map((val) => (
                              <Chip
                                key={val}
                                label={val}
                                onClick={() => handleSelectChip(option.id, val)}
                                onDelete={() =>
                                  handleDeleteChip(option.id, val)
                                }
                                size="small"
                                sx={{
                                  backgroundColor:
                                    (option.id === 1 && sizes.includes(val)) ||
                                    (option.id === 2 && weights.includes(val))
                                      ? "#d1e7dd"
                                      : "#eef0f6",
                                  color: "#374151",
                                  fontSize: 13,
                                  borderRadius: "6px",
                                  height: 28,
                                  "& .MuiChip-deleteIcon": {
                                    color: "#9ca3af",
                                    fontSize: 14,
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Box
                        component="fieldset"
                        sx={{
                          border: "1px solid #e2e4e9",
                          borderRadius: "8px",
                          px: 1.5,
                          py: 1,
                          m: 0,
                        }}
                      >
                        <TextField
                          variant="standard"
                          placeholder="Вариант 2"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                          sx={{ "& input": { fontSize: 14 } }}
                        />
                      </Box>
                      <Box
                        component="fieldset"
                        sx={{
                          border: "1px solid #e2e4e9",
                          borderRadius: "8px",
                          px: 1.5,
                          py: 1,
                          m: 0,
                        }}
                      >
                        <TextField
                          variant="standard"
                          placeholder="Ценить"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                          sx={{ "& input": { fontSize: 14 } }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#2563EB",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      +Добавить еще
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box className="border-1 border-gray-300 px-4 py-5">
              <header className="flex justify-between items-center">
                <Typography variant="h" className="font-black">
                  Цветa:
                </Typography>
                <Button
                  sx={{ color: theme == "light" ? "" : "#236ee7" }}
                  onClick={handleClickOpen}
                >
                  Создать новый
                </Button>
              </header>
              <Box className="flex gap-3 flex-wrap justify-start items-center py-4">
                {isLoadingColors ? (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                          backgroundSize: "200% 100%",
                          animation: `${loadingColor} 1.5s infinite`,
                        }}
                      />
                    ))}
                  </Box>
                ) : colors?.data?.length > 0 ? (
                  colors.data.map((elem) => (
                    <Box
                      sx={{
                        backgroundColor: elem.color,
                        border: selectedColors?.find(
                          (item) => item?.colorId === elem?.colorId,
                        )
                          ? `2px solid #2563EB`
                          : "",
                      }}
                      key={elem.colorId}
                      className="relative group w-9 h-9 rounded-[50%] cursor-pointer"
                      onClick={() => {
                        setSelectedColors((prev) => {
                          const isExist = prev.find(
                            (item) => item?.colorId === elem?.colorId,
                          );
                          if (isExist) {
                            toast.info("Color removed from list!", {
                              autoClose: 2000,
                            });
                            return prev.filter(
                              (item) => item.colorId !== elem.colorId,
                            );
                          } else {
                            toast.success("Color added to list! Successfully", {
                              autoClose: 2000,
                            });
                            return [...prev, elem];
                          }
                        });
                      }}
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(deleteColor(elem.colorId));
                        }}
                        className="absolute -top-1 -right-1 hidden group-hover:flex w-5 h-5 bg-white text-red-500 rounded-full items-center justify-centertext-xs font-bold shadow"
                      >
                        <CloseIcon />
                      </span>
                    </Box>
                  ))
                ) : (
                  <Typography>Нет Цвет</Typography>
                )}
              </Box>
            </Box>
            <Box className="flex flex-col gap-4 mt-4">
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileRef}
                className="hidden"
                onChange={(e) => {
                  const files = e?.target?.files;
                  if (files && files.length > 0) {
                    dispatch(
                      addImageToProduct({
                        productId: id,
                        images: Array.from(files),
                      }),
                    );
                  }
                }}
              />
              <UploadImage click={() => fileRef.current?.click()} />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 250 }} aria-label="simple table">
                  <TableHead>
                    <TableRow className={`${theme === "light" ? "bg-[#F5F5F5]" : ""}`}>
                      <TableCell className="color-[#5A607F]">Фото</TableCell>
                      <TableCell className="color-[#5A607F]">
                        Имя файла
                      </TableCell>
                      <TableCell className="color-[#5A607F]">
                        Действие
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newImages.map((img, index) => (
                      <TableRow key={img.id || index}>
                        <TableCell className="indent-2">
                          <img
                            src={`${API}/images/${img.image}`}
                            className="w-10 h-10 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="indent-2">{img.image.slice(0, 10)}</TableCell>
                        <TableCell className="indent-3">
                          <DeleteIcon
                            onClick={() =>
                              dispatch(
                                deleteImageFromProduct({
                                  productId: id,
                                  imageId: img.id,
                                }),
                              )
                            }
                            className="text-[#7E84A3] cursor-pointer"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box className="flex flex-col-reverse gap-2 pt-6 md:hidden">
              <Link to={`/dashboard/products`} className="w-full">
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ backgroundColor: theme === "light" ? "" : "#1e293b" }}
                >
                  Отмена
                </Button>
              </Link>
              <Button
                variant="contained"
                disabled={loading}
                onClick={editProduct}
              >
                {loading ? "Сбережения..." : "Сохранять"}
              </Button>
            </Box>
          </Box>
        </main>
      </Box>

      <AddColor
        color={color}
        colorName={colorName}
        handleClose={handleClose}
        openDialog={openDialog}
        setColor={setColor}
        setColorName={setColorName}
      />
    </>
  );
}

export default EditProduct;

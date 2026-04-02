import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Chip,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch as Swt,
  Table,
  TableContainer,
  TextField,
  Typography,
  keyframes,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../app/theme/themeContext";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { darkOnlyInputSx, darkOnlySelectSx } from "../../app/muiStyle";
import { useDispatch, useSelector } from "react-redux";
import { deleteColor, getColors } from "../../features/Colors/colors";
import { addProduct } from "../../features/Products/products";
import CloseIcon from "@mui/icons-material/Close";
import { getBrands } from "../../features/Brands/brands";
import { getCategories } from "../../features/Category/categories";
import { API } from "../../utils/config";
import { toast } from "react-toastify";
import UploadImage from "../../app/components/uploadImage";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import AddColor from "../../app/components/color";

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

export default function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openOptionThings, setOpenOptionThings] = useState(false);
  const [color, setColor] = useState("#000000");
  const [colorName, setColorName] = useState("");
  const [variant, setVariant] = useState(false);
  const [isLoadingColors, setIsLoadingColors] = useState(false);
  const [weights, setWeights] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(null);
  const [disCount, setDisCount] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [options, setOptions] = useState([
    { id: 1, name: "Размер", values: ["S", "M", "L", "XL"] },
    { id: 2, name: "Масса", values: ["10", "20", "30", "40"] },
  ]);

  const fileRef = useRef(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleClickOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);

  const colors = useSelector((store) => store.color.colors);
  const brands = useSelector((store) => store.brands.brands);
  const categories = useSelector((store) => store.category.categories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchColors = () => {
      setIsLoadingColors(true);
      dispatch(getColors());
      setIsLoadingColors(false);
    };
    fetchColors();
  }, [dispatch]);

  const clearForm = () => {
    setProductName("");
    setCode(null);
    setDescription("");
    setBrand("");
    setCategory("");
    setPrice(null);
    setDisCount(null);
    setQuantity(null);
    setImages([]);
    setSelectedColors([]);
  };

  const addFormProduct = async () => {
    if (
      !productName.trim() ||
      !category.trim() ||
      !price ||
      isNaN(Number(price)) ||
      !quantity ||
      isNaN(Number(quantity)) ||
      images.length === 0
    ) {
      toast.error("Please fill in all required fields.", { autoClose: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("code", code || uuidv4());
    formData.append("description", description);
    formData.append("count", quantity);
    formData.append("brand", brand || "No Brand");
    formData.append("category", category);
    formData.append("price", price);
    formData.append("disCount", disCount);
    formData.append("colors", JSON.stringify(selectedColors));
    formData.append("size", JSON.stringify(sizes));
    formData.append("weight", JSON.stringify(weights));
    images.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });

    try {
      setLoading(true);
      await dispatch(addProduct(formData));
      setLoading(false);
      navigate("/dashboard/products");
      clearForm();
    } catch (error) {
      console.error("AddProduct error:", error);
      toast.error("Failed to add product.", { autoClose: 2000 });
    } finally {
      setLoading(false);
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

  const handleChangeFile = (e) => {
    const files = e?.target?.files;
    if (files) {
      setImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const addNewColor = (newColor) => {
    setSelectedColors((prev) => {
      const isExist = prev.find((item) => item.colorId === newColor.colorId);
      if (isExist) {
        toast.info("Color removed from list!", {
          autoClose: 2000,
        });
        return prev.filter((item) => item.colorId !== newColor.colorId);
      } else {
        toast.success("Color added to list! Successfully", {
          autoClose: 2000,
        });
        return [...prev, newColor];
      }
    });
  };

  const loadingColor = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

  return (
    <Box className="p-6">
      <header className="flex items-center justify-between mb-6 gap-2">
        <Typography
          variant="h5"
          className="text-2xl font-bold flex gap-3 items-center"
        >
          <Link to="/dashboard/products" className="flex gap-3 items-center">
            <ArrowLeft />
            <span className="text-blue-600 hover:underline">Продукты</span>
          </Link>
          <span>/Добавить новый</span>
        </Typography>
        <Box className="hidden gap-3 md:flex">
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
            onClick={addFormProduct}
          >
            {loading ? "Создание..." : "Создать"}
          </Button>
        </Box>
      </header>

      <main className="flex flex-col md:flex-row gap-8">
        {/* LEFT SIDE */}
        <Box className="md:w-[60%] space-y-6">
          <section>
            <Typography variant="h5" className="text-lg font-semibold mb-2">
              Информация
            </Typography>
            <Box className="flex gap-4 mt-7 flex-col md:flex-row">
              <TextField
                className="w-full border px-3 py-1 rounded"
                placeholder="Название продукта"
                sx={darkOnlyInputSx}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <TextField
                type="number"
                sx={darkOnlyInputSx}
                className="md:w-100 md:w-[30%] border px-3 py-2 rounded"
                placeholder="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Box>
            <textarea
              className="w-full border-1 border-gray-400  outline-blue-500 px-3 py-2 mt-4 rounded h-32 resize-none"
              placeholder="Описание..."
              style={{ backgroundColor: theme == "light" ? "" : "#1e293b" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>
          <section>
            <Box className="flex gap-4 flex-col md:flex-row">
              <FormControl sx={{ m: 1, width: 250 }}>
                <InputLabel id="Filter">Фильтр</InputLabel>
                <Select
                  labelId="Filter"
                  label="Filter"
                  sx={darkOnlySelectSx}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.length === 0 ? (
                    <MenuItem value="Not Category">Нет категория</MenuItem>
                  ) : (
                    categories.map((elem) => (
                      <MenuItem value={elem.categoryName} key={elem.categoryId}>
                        <div className="flex items-center gap-2">
                          <img
                            src={`${API}/images/${elem.categoryImage}`}
                            width={20}
                            alt=""
                          />
                          <span>{elem.categoryName}</span>
                        </div>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, width: 200 }}>
                <InputLabel id="category-label">Бренды</InputLabel>
                <Select
                  labelId="category-label"
                  label="Brands"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  sx={darkOnlySelectSx}
                >
                  {brands.length === 0 ? (
                    <MenuItem value="Not Brand">Нет брендa</MenuItem>
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
          <Typography variant="h6" className="text-lg font-semibold mb-4">
            Цена
          </Typography>
          <Box className="flex gap-4 flex-col mt-3 md:flex-row">
            <TextField
              sx={darkOnlyInputSx}
              type="number"
              placeholder="Цена товара"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              sx={darkOnlyInputSx}
              type="number"
              placeholder="Скидка"
              value={disCount}
              onChange={(e) => setDisCount(e.target.value)}
            />
            <TextField
              sx={darkOnlyInputSx}
              type="number"
              placeholder="Количество"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Box>
          <Box sx={{ mt: 6 }}>
            <Box sx={{ maxWidth: 800, mt: 2 }}>
              <Box
                sx={{ display: "flex", gap: 1, alignItems: "center", mb: 3 }}
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
                              onDelete={() => handleDeleteChip(option.id, val)}
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
                      border: selectedColors.find(
                        (item) => item.colorId === elem.colorId,
                      )
                        ? `2px solid #2563EB`
                        : "",
                    }}
                    key={elem.colorId}
                    className="relative group w-9 h-9 rounded-[50%] cursor-pointer"
                    onClick={()=> addNewColor(elem)}
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
              onChange={(e) => handleChangeFile(e)}
            />
            <UploadImage click={() => fileRef.current?.click()} />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 250 }} aria-label="simple table">
                <TableHead>
                  <TableRow className={`${theme === "light" ? "bg-[#F5F5F5]" : ""}`}>
                    <TableCell className="color-[#5A607F]">Фото</TableCell>
                    <TableCell className="color-[#5A607F]">Имя файла</TableCell>
                    <TableCell className="color-[#5A607F]">Действие</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {images.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell className="indent-2">
                        <img
                          src={
                            file instanceof File
                              ? URL.createObjectURL(file)
                              : file.url
                          }
                          className="w-10 h-10 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="indent-2">
                        {file.name
                          ? file.name.length > 10
                            ? file.name.slice(0, 10) + "..."
                            : file.name
                          : "Preview"}
                      </TableCell>
                      <TableCell className="indent-3">
                        <DeleteIcon
                          onClick={() =>
                            setImages(images.filter((_, i) => i !== index))
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
              onClick={addFormProduct}
            >
              {loading ? "Создание..." : "Создать"}
            </Button>
          </Box>
        </Box>
      </main>

      <AddColor
        color={color}
        colorName={colorName}
        handleClose={handleClose}
        openDialog={openDialog}
        setColor={setColor}
        setColorName={setColorName}
      />
    </Box>
  );
}

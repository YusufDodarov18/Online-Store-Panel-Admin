import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { addColor } from "../../../features/Colors/colors";

function AddColor({
  openDialog,
  handleClose,
  colorName,
  setColorName,
  color,
  setColor,
}) {
  const dispatch = useDispatch();

  const createNewColor = async () => {
    if (colorName.trim()) {
      dispatch(addColor({ color, colorName }));
      handleClose();
      setColor("#000000");
      setColorName("");
    }
  };
  return (
    <Dialog open={openDialog} onClose={handleClose}>
      <Box className="flex flex-col px-7 py-7">
        <header className="flex justify-between py-3">
          <Typography variant="h6">Новый Цвет</Typography>
          <CloseIcon className="cursor-pointer" onClick={handleClose} />
        </header>
        <main className="flex gap-5">
          <TextField
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            placeholder="Название цвета"
            type="text"
          />
          <Box className="w-30 h-14 flex items-center justify-evenly border-1 border-gray-300">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="cursor-pointer w-10 h-10 rounded-[14px]"
            />
            <span className="text-sm text-gray-600">{color}</span>
          </Box>
        </main>
        <Box className="pt-5 flex gap-4 justify-end">
          <Button onClick={handleClose} variant="outlined">
            Отмена
          </Button>
          <Button variant="contained" onClick={createNewColor}>
            Создать
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default AddColor;

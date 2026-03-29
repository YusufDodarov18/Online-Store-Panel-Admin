import { Box, Button, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

function UploadImage({ click }) {
  return (
    <Box className="py-5 px-3 flex flex-col gap-2">
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Изображения
      </Typography>
      <Box
        className="flex flex-col gap-3 justify-center items-center py-9 px-4 text-center border-dashed border-2 border-[#A1A7C4] dark:border-[#e5e6ec] cursor-pointer"
        onClick={click}
      >
        <Button
          sx={{
            bgcolor: "#E5E7EB",
            color: "black",
            fontWeight: "bold",
            borderRadius: "50%",
            width: 10,
            height: 60,
          }}
          variant="contained"
        >
          <FileUploadIcon />
        </Button>

        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          <span className="border-b-2 border-b-black dark:border-b-white">
            Нажмите, чтобы загрузить,
          </span>
          или перетащите.
        </Typography>
        <Typography sx={{ color: "#6C737F" }}>
          (SVG, JPG, PNG или GIF, максимальное разрешение 900x400)
        </Typography>
      </Box>
    </Box>
  );
}

export default UploadImage;

import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import { API } from "../../../utils/config";

const Product = ({ names, price, view, images }) => {
  // console.log(view)
  return (
    <TableRow>
       <TableCell className="flex items-center gap-3 py-3 font-bold">
         {images?.length>0?(
           <img 
             src={`${API}/images/${images}`} alt={names} 
             className="w-10 h-10 object-cover rounded" 
           />
         ):(
           <Box className="bg-[#ECF2FF] h-[40px] rounded-[5px] w-[40px]"></Box>
         )}
         {names}
       </TableCell>
       <TableCell>{price}</TableCell>
       <TableCell>{view}</TableCell>
    </TableRow>
  );
};

export default Product;

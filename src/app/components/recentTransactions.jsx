import { TableCell, TableRow, Box } from "@mui/material";
import { API } from "../../utils/config";

export default function RecentTransactions({ products }) {
  return (
    <>
      {products?.length > 0 ? (
        [...products]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((e) => (
            <TableRow
              key={e.id}
              className="transition"
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                className="flex items-center gap-3 py-2"
                component="th"
                scope="row"
              >
                {e.image ? (
                  <img
                    src={`${API}/images/${e.image}`}
                    alt={e.productName}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <Box className="bg-gray-200 w-12 h-12 rounded"></Box>
                )}
                <span className="font-semibold">{e.productName}</span>
              </TableCell>
              <TableCell className="py-2 text-gray-500">{e.category}</TableCell>
              <TableCell className="py-2 text-green-600">
                В наличии: {e.quantity}
              </TableCell>
              <TableCell className="py-2 font-bold">${e.price}</TableCell>
              <TableCell className="py-2 font-bold">
                {new Date(e.date).toLocaleDateString("en-GB")}
              </TableCell>
            </TableRow>
          ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-4 text-gray-500">
            Товары отсутствуют
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

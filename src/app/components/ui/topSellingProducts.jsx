import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../features/Products/products";
import { Box } from "@mui/material";
import { useTheme } from "../../theme/themeContext";
import {API} from "../../../utils/config"

const TopSellingProducts = () => {
  const products = useSelector((store) => store.product.products);
  const dispatch = useDispatch();
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return <div>
    {products?.length>0?(
			products.map(el=>{
				return <Box key={el.id} className={`${theme=="light"?"bg-white":"bg-gray-800"} flex items-center gap-4 p-3 rounded shadow-sm hover:shadow-md transition`}>
					<img src={`${API}/images/${el.images?.[0]?.image}`} alt={el.productName}  className='w-10 h-10 object-cover rounded' />
						<Box className='flex flex-col flex-1'>
							<h3 className='font-semibold '>
								{el.productName}
							</h3>
							<p className='text-sm text-gray-500'>{el.categoryName}</p>
							<p className='text-sm text-green-600'>
								В наличии: {el.count}
							</p>
						</Box>
						<div className='font-bold '>${el.price}</div>
				</Box>
				})
	  ) :
		  <p className='text-gray-500'>Товары отсутствуют</p>}
  </div>;
};

export default TopSellingProducts;

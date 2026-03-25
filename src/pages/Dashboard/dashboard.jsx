
import Box from '@mui/material/Box'
import muibox from "../../app/assets/div.MuiBox-root.png";
import cost from "../../app/assets/iconly-glass-discount.svg.png";
import profit from "../../app/assets/div.MuiBox-root (1).png";
import ReactApexChart from 'react-apexcharts'
import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import { useTheme } from '../../app/theme/themeContext'
import TopSellingProducts from '../../app/components/ui/topSellingProducts'
import { useSelector } from 'react-redux'
import Product from "../../app/components/ui/lastproducts";
import RecentTransactions from '../../app/components/ui/recentTransactions'


const options={
	chart: { type: 'line' },
	tooltip: { theme: 'dark' },
	xaxis: {
		categories: [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
		],
	},
}

const series=[
	{ name: 'Заказы', data: [10, 4, 16, 21, 15, 31, 20, 8, 5, 30, 10, 12]}
]


export default function Dashboard() {
  const {theme}=useTheme()
  
	const products =useSelector(store=>store.product?.products)

	const sortedProducts = [...products].sort((a, b) => b.views - a.views);

  return (
 	<div className='p-5 space-y-8'>
      
			<Box className='flex flex-col md:flex-row justify-between gap-5'>
				<section className='md:w-[60%] space-y-5'>
         	 <Box className='flex flex-col sm:flex-row justify-between gap-4'>
           		 <Box className='flex-1 h-[100px] cursor-pointer rounded-md bg-[#FEF3F2] p-5 flex items-center justify-center gap-4 text-black shadow'>
					<img src={muibox} alt='Sales Icon' className='w-14 h-14' />
           		   <Box>
						<p className='text-sm'>Продажи</p>
						<h2 className='text-1xl font-bold'>$152k</h2>
					</Box>
           		 </Box>
           		 <Box className='flex-1 h-[100px] cursor-pointer rounded-md bg-[#FFFAEB] p-5 flex items-center justify-center gap-4 text-black shadow'>
						<img src={cost} alt='Cost Icon' className='w-14 h-14' />
           		   <Box>
						<p className='text-sm'>Расходы</p>
						<h2 className='text-1xl font-bold'>$99.7k</h2>
					</Box>
           		 </Box>
           		 <Box className='flex-1 h-[100px] cursor-pointer rounded-md bg-[#F0FDF9] p-5 flex items-center justify-center gap-4 text-black shadow'>
						<img src={profit} alt='Profit Icon' className='w-14 h-14' />
						<Box>
							<p className='text-sm'>Выгода</p>
							<h2 className='text-1xl font-bold'>$32.1k</h2>
						</Box>
						</Box>
         		 </Box>

          <Box className='rounded-md border border-gray-200 p-5 shadow'>
				<h2 className='text-2xl font-bold mb-3'>Выручка от продаж</h2>
            	<ReactApexChart options={options} series={series} type='line' height={350}/>
          </Box>
        </section>

			{/* Правая панель — Топ продаваемые товары */}
        <section className='md:w-[35%] border border-gray-200 rounded-md p-5 shadow flex flex-col'>
          <Box className='flex justify-between items-center mb-5'>
            <h2 className='font-bold text-lg'>Самые продаваемые товары</h2>
			<Button className='text-blue-600 hover:text-blue-800 font-semibold transition'>Посмотреть все</Button>
          </Box>
		  <Box className='flex flex-col gap-4 overflow-y-auto max-h-[420px]'>
			<TopSellingProducts/>
		  </Box>
        </section>
      </Box>
			
		<section className='flex flex-col md:flex-row justify-between gap-5'>
				<Box className='md:w-[50%] p-5 border border-gray-200 rounded-md shadow overflow-auto max-h-[400px]'>
 					 <h3 className='text-xl font-bold mb-4'>Недавние сделки</h3>
 					 <TableContainer component={Paper}>
 					   <Table sx={{ minWidth: 650 }} aria-label="simple table">
 					     <TableHead className='border-b border-gray-300'>
 					       <TableRow>
 					         <TableCell>Продукт</TableCell>
 					         <TableCell>Категория</TableCell>
 					         <TableCell>Запас</TableCell>
 					         <TableCell>Цена</TableCell>
 					         <TableCell>Дата</TableCell>
 					       </TableRow>
 					     </TableHead>
 					     <TableBody>
							<RecentTransactions products={products}/>
 					     </TableBody>
 					   </Table>
 					 </TableContainer>
					</Box>

				{/* Top Products by Units Sold */}
				<Box className='md:w-[45%] p-5 border border-gray-200 rounded-md shadow overflow-auto max-h-[400px]'>
					<Typography className='text-xl font-bold mb-4'>Лучшие товары по количеству просмотров</Typography>
					<TableContainer component={Paper} className='mt-2'>
						<Table className='w-full table-auto text-left'>
							<TableHead className='border-b border-gray-300'>
								<TableRow>
									<TableCell className='py-2'>Имя</TableCell>
									<TableCell className='py-2'>Цена</TableCell>
									<TableCell className="py-2">Просмотры</TableCell>
								</TableRow>
						  </TableHead>
						  <TableBody>
								{sortedProducts?.length > 0 ? (
  									  sortedProducts?.map((el) => (
  									    <Product 
  									      key={el.id} 
  									      names={el.productName} 
  									      price={`$${el.price}`} 
  									      images={el.images?.[0]?.image} 
  									      view={el.viewCount} 
  									    />
  									  ))
  									) : (
  									  <TableRow>
  									    <TableCell colSpan={3} className='text-center py-4 text-gray-500'>
  									      Товары отсутствуют
  									    </TableCell>
  									  </TableRow>
  									)}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
		</section>
    </div>
  )
}

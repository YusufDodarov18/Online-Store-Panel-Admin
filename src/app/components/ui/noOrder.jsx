import notOrder from "../../assets/norOrder.png"
import { Typography } from "@mui/material";

const NoOrder = () => {
  return (
    <div className="flex justify-center flex-col items-center text-center pt-13">
        <img src={notOrder}  width={100} alt="img" />
        <Typography variant="h6">Заказов пока нет.</Typography>
        <p>На этой странице будут отображаться все предстоящие заказы из вашего магазина. <br />Если вы продаете товары офлайн, вы можете самостоятельно добавлять заказы.</p>
    </div>
  )
}

export default NoOrder

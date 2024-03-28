import { scheduleJob } from "node-schedule"
import db_connection from "../../DB/connection.js"
import { globalResponse } from "../middlewares/global-response.middleware.js"
import { rolleBackSavedModels } from "../middlewares/rolleBack-sevedModel.js"
import { rollebackMiddleware } from "../middlewares/rollwback-middleware.js"
import * as routers from "../modules/index.routes.js"
import { replaceCouponStatus } from "./crons.js"


export const  initiateApp= (app, express)=>{

    const port = process.env.PORT


    app.use(express.json())

    db_connection()
    app.use('/auth', routers.authRouter)
    app.use('/cart', routers.cartRouter)
    app.use('/category', routers.categRouter)
    app.use('/sub-category', routers.subCategRouter)
    app.use('/prouduct', routers.prouductRouter)
    app.use('/brand', routers.brandRouter)
    app.use('/coupon', routers.couponRouter)
    app.use('/order', routers.orderRouter)
    app.use('/review', routers.reviewRouter)

    app.use(globalResponse,
        rollebackMiddleware ,
        rolleBackSavedModels)

        // scheduleJob('40 * * * * *',()=>{ //<=عند الثانية 40 من دقيقة وكل ساعة اشتغل مرة واحدة
        
        //     console.log('log evry scound');
        // })
        //بعد 5ث طيب اعملها ازاي =>scheduleJob('*/5 * * * * *')
        // replaceCouponStatus()
    app.get('/', (req, res) => res.send('Hello World!'))
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))


}
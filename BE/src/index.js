import dotenv from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Op } from "sequelize";
import bodyParser from 'body-parser';
import { calcCrow } from './helpers/utils';
import models, { sequelize } from './models';
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
const jsonParser = bodyParser.json()


app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(jsonParser);

const { Vehicle, Sensor } = models;
app.post('/test', async (req, res) => {
    const start = new Date(req.body.start);
    const end = new Date(req.body.end);
    Vehicle.findAll({
        where: {
            dtime: {
                [Op.between]: [start, end]

            }
        }
    }).then(data => {
        const addedDistance = data.map((item,index) => {
            const { dataValues } = item;
            if(index === 0) return item;
            return {
                    ...dataValues,
                    distance: calcCrow(item.lat,item.lon, data[index-1].lat,data[index-1].lon)
            }
        });
        res.send(addedDistance);
    });
});

sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Example app listening on port ${process.env.PORT}!`)
    });
});

import { Op } from 'sequelize';
import {sequelize} from "./index";

const vehicle = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define('vehicleSensor', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        vid: {
            type: DataTypes.INTEGER,
        },
        lat: {
            type: DataTypes.DOUBLE,
        },
        lon: {
            type: DataTypes.DOUBLE,
        },
        speed: {
            type: DataTypes.DOUBLE,
        },
        course: {
            type: DataTypes.DOUBLE,
        },
        isvalid: {
            type: DataTypes.BOOLEAN,
        },
        dtime: {
            type: DataTypes.DATE,
        },
        iotypename: {
            type: DataTypes.STRING,
        },
        iovalue: {
            type: DataTypes.INTEGER
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
    return Vehicle;
};

module.exports = vehicle;

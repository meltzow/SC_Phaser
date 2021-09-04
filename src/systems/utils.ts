import {defineQuery, IWorld} from "bitecs";
import CPU from "../components/CPU";
import Velocity from "../components/Velocity";
import Rotation from "../components/Rotation";
import Input from "../components/Input";

export class utils {

    public static allUnits(){

        return defineQuery([CPU, Velocity, Rotation, Input])
        return flatten(Global.units);
    }

}

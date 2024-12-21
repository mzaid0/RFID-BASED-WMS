import { Reader, MaindBoard_Type, Module_Type, ReaderType } from "./enums";

export const reader: Reader = {
    specAntsCnt: 0,
    hardwareDetails: {
        board: MaindBoard_Type.MAINBOARD_NONE,
        module: Module_Type.MODOULE_NONE,
        logictype: ReaderType.MT_A7_TWOANTS,
        selfcheckants: 0
    }
}
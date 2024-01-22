import { atom } from "recoil";

export const groupAtom = atom({
    key: "groupAtom",
    default: [],
});

export const selectedGroupAtom = atom({
    key: "selectedGroupAtom",
    default: {
        _id: "",
        participants: [],
        groupName: "",
        user: "",
        groupCode: "",
        groupPic: "",
        admin: "",
    },
});

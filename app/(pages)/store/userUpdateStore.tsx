import {userStore, User} from "../../../utils/type"
import { create } from "zustand";
const useUserState=create<userStore>((set)=>({
    user:{email:null,password:null},
    login(user:User){
        set({user:user})
    },
    logout(){
        set({ user: { email: null, password: null } })
    }
}))
export default useUserState;
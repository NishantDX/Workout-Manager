import {User } from "../../../../utils/type";
import { create } from "zustand";
//import useWorkoutState from "./useworkoutState";

type UserStore={
  user:User;
  login:(user:User)=>Promise<void>;
  logout:()=>Promise<void>;
}


const useUserState = create<UserStore>((set) => ({
  user: { email: null, token: null },
  async login(User: User) {
    set({ user: User });
  },
  async logout() {
    // const {getWorkout}=useWorkoutState();
    // getWorkout(null)
    localStorage.removeItem('user');
    set({ user: { email: null, token: null } });
  },
}));
export default useUserState;

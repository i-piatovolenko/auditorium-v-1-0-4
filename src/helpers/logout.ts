import {client, isLoggedVar} from "../api/client";

export const handleLogout = async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  isLoggedVar(false);
  await client.resetStore();
};
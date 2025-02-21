import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const getUserItem = async (key: string) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Erreur de lecture sécurisée:", error);
    return null;
  }
};

export async function getUserInSecureStore() {
  const web = Platform.OS === "web";
  let token = null;
  if (web) {
    token = localStorage.getItem("token");
  }
  if (!web) {
    token = await getUserItem("token");
  }
  return token
}
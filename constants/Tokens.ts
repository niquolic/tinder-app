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

export async function getUserInfosInSecureStore() {
  const web = Platform.OS === "web";
  let user = null;
  if (web) {
    user = localStorage.getItem("user");
  }
  if (!web) {
    user = await getUserItem("user");
  }
  return user
}

export const saveSecureItem = async (key: string, value: string) => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    }
  } catch (error) {
    console.error("Erreur lors du stockage:", error);
  }
};
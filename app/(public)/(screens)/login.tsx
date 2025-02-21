import { useState } from "react";
import { useMutation } from "react-query";
import { View, TextInput, Button, Text, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/userStore";
import * as SecureStore from "expo-secure-store";

const LoginScreen = () => {
  const {setIsAuthenticated, setUser} : any = useUserStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("")

  const saveSecureItem = async (key: string, value: string) => {
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

  const mutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return fetch("https://api-tinder-next.vercel.app/api/auth/login", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: email, password }),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
        setUser(data);
        saveSecureItem("token", data.token);
        router.push("/");
      } else {
        setErrorMessage("L'utilisateur ou le mot de passe est incorrect.")
      }
    },
    onError: (error) => {
      console.error("error", error);
    },
  });

  const handleSubmit = () => {
    setErrorMessage("")
    mutation.mutate({ email, password });
  }

  const register = () => {
    router.push("/register");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "red",
          padding: 20,
          borderRadius: 10,
          width: "80%",
        }}
      >
        <TextInput
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        { errorMessage !== '' ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
        ) : null}
        <Button title="Login" onPress={handleSubmit} />
        <Text
          style={{ marginTop: 10, color: "blue", textAlign: "center" }}
          onPress={register}
        >
          Première connexion? Créer un compte
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
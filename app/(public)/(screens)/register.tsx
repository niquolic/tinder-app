import { useState } from "react";
import { useMutation } from "react-query";
import { View, TextInput, Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/userStore";
import * as SecureStore from "expo-secure-store";

const RegisterScreen = () => {
  const {setIsAuthenticated, setUser} : any = useUserStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");

  const saveSecureItem = async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error("Erreur lors du stockage:", error);
    }
  };

  const mutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({ username: email, password }),
        credentials: "include",
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      setIsAuthenticated(true);
      setUser(data);
      saveSecureItem("token", JSON.stringify(data));
      router.push("/");
    },
    onError: (error) => {
      console.error("error", error);
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ email, password });
  }

  const login = () => {
    router.push("/login");
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
        <TextInput
          placeholder="Prénom"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />
        <TextInput
          placeholder="Nom"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
        />
        <TextInput
          placeholder="Age"
          onChangeText={(text) => setAge(text)}
          value={age}
        />
        <Button title="Créer le compte" onPress={handleSubmit} />
        <Text
          style={{ marginTop: 10, color: "blue", textAlign: "center" }}
          onPress={login}
        >
          Déjà inscrit? Connectez-vous
        </Text>
      </View>
    </View>
  );
};

export default RegisterScreen;
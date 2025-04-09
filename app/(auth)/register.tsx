import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import * as Network from "expo-network";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setDebug("Démarrage de l'inscription...\n");

    try {
      // Vérifier la connectivité réseau
      const networkState = await Network.getNetworkStateAsync();
      setDebug(
        (prev) => prev + `État du réseau: ${JSON.stringify(networkState)}\n`
      );

      if (!networkState.isConnected || !networkState.isInternetReachable) {
        throw new Error("Pas de connexion internet");
      }

      const requestData = {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      };

      setDebug((prev) => prev + `Données: ${JSON.stringify(requestData)}\n`);
      setDebug((prev) => prev + `URL: ${apiUrl}/register\n`);

      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      setDebug((prev) => prev + `Statut HTTP: ${response.status}\n`);
      setDebug(
        (prev) =>
          prev +
          `Headers: ${JSON.stringify(
            Object.fromEntries(response.headers.entries())
          )}\n`
      );

      // Récupérer d'abord la réponse en texte brut
      const rawText = await response.text();
      setDebug(
        (prev) =>
          prev +
          `Réponse brute (50 premiers caractères): ${rawText.substring(
            0,
            50
          )}...\n`
      );

      let data;
      try {
        // Essayer de parser le texte en JSON
        data = JSON.parse(rawText);
        setDebug((prev) => prev + "Réponse parsée avec succès en JSON\n");
      } catch (parseError) {
        setDebug(
          (prev) =>
            prev + `Erreur de parsing JSON: ${(parseError as Error).message}\n`
        );
        // Si le texte commence par "<", c'est probablement du HTML
        if (rawText.trim().startsWith("<")) {
          setDebug(
            (prev) => prev + "La réponse semble être du HTML, pas du JSON\n"
          );
        }
        throw new Error(
          "La réponse du serveur n'est pas au format JSON valide"
        );
      }

      if (!response.ok) {
        const errorMessage = data.errors
          ? Object.values(data.errors).flat().join("\n")
          : data.message || "Erreur lors de l'inscription";
        throw new Error(errorMessage);
      }

      setDebug((prev) => prev + "Inscription réussie!\n");

      // Enregistrer le token
      await SecureStore.setItemAsync("userToken", data.access_token);
      await SecureStore.setItemAsync("userData", JSON.stringify(data.user));

      // Rediriger vers l'écran principal
      router.replace("/(tabs)");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite";

      setDebug((prev) => prev + `ERREUR: ${errorMessage}\n`);
      Alert.alert("Erreur d'inscription", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Inscription..." : "S'inscrire"}
        </Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {debug ? (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Informations de débogage:</Text>
          <Text style={styles.debugText}>{debug}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#90caf9",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "#007BFF",
    textAlign: "center",
    marginTop: 10,
  },
  debugContainer: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
  },
  debugTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  debugText: {
    fontFamily: "monospace",
    fontSize: 12,
  },
});

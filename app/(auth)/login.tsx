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
import { useAuth } from "@/contexts/AuthContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setDebug("Démarrage de la connexion...\n");

    try {
      setDebug((prev) => prev + `URL: ${apiUrl}/login\n`);

      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
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
      } catch (parseError) {}

      if (!response.ok) {
        const errorMessage = data.errors
          ? Object.values(data.errors).flat().join("\n")
          : data.message || "Identifiants incorrects";
        throw new Error(errorMessage);
      }

      setDebug((prev) => prev + "Connexion réussie!\n");

      // Utiliser le contexte d'authentification pour la connexion
      await signIn(data.access_token, data.user);

      // Pas besoin de rediriger, le contexte d'authentification s'en charge
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";

      setDebug((prev) => prev + `ERREUR: ${errorMessage}\n`);
      Alert.alert("Erreur de connexion", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Connexion</Text>

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

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Connexion..." : "Se connecter"}
        </Text>
      </TouchableOpacity>

      <View style={styles.links}>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Créer un compte</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Mot de passe oublié ?</Text>
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
  qrButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
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
  links: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
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

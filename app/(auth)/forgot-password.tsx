import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

const API_URL = "https://keep.kevindupas.com/api";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Erreur", "Veuillez saisir votre adresse email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi de l'email");
      }

      setMessageSent(true);
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  if (messageSent) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.title}>Email envoyé</Text>
        <Text style={styles.message}>
          Si un compte est associé à cet email, vous recevrez un lien pour
          réinitialiser votre mot de passe.
        </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Retour à la connexion</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Mot de passe oublié</Text>
      <Text style={styles.subtitle}>
        Saisissez votre adresse email pour recevoir un lien de réinitialisation.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
        </Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Retour à la connexion</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 6,
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
});

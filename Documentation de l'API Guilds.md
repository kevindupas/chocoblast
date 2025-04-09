# Documentation de l'API Guilds

Cette documentation décrit tous les points d'entrée (endpoints) de l'API pour l'application de guildes, destinée à être utilisée avec une application mobile React Native/Expo.

## Table des matières

- [Configuration](#configuration)
- [Authentification](#authentification)
- [Utilisateurs](#utilisateurs)
- [Guildes](#guildes)
- [Membres](#membres)
- [Invitations](#invitations)
- [Demandes d'adhésion](#demandes-dadhésion)
- [Gestion des images](#gestion-des-images)

## Configuration

### URL de base

```
https://votre-domaine.com/api
```

### Headers

Pour les endpoints authentifiés, ajoutez le token d'authentification dans le header :

```
Authorization: Bearer {token}
```

Pour les requêtes avec upload de fichiers, utilisez :

```
Content-Type: multipart/form-data
```

Sinon, utilisez :

```
Content-Type: application/json
Accept: application/json
```

## Authentification

### Inscription

Crée un nouvel utilisateur et retourne un token d'authentification.

- **URL** : `/register`
- **Méthode** : `POST`
- **Authentification** : Non
- **Content-Type** : `multipart/form-data`

**Paramètres** :

| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| name | string | Oui | Nom complet de l'utilisateur |
| username | string | Oui | Nom d'utilisateur unique |
| email | string | Oui | Email unique |
| password | string | Oui | Mot de passe (min 8 caractères) |
| password_confirmation | string | Oui | Confirmation du mot de passe |
| avatar | file | Non | Image de profil (max 1024 KB) |
| bio | string | Non | Biographie |

**Exemple de requête (avec avatar)** :

```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('username', 'johndoe');
formData.append('email', 'john@example.com');
formData.append('password', 'password123');
formData.append('password_confirmation', 'password123');
formData.append('avatar', {
  uri: imageUri,
  name: 'avatar.jpg',
  type: 'image/jpeg'
});
formData.append('bio', 'Développeur passionné');

fetch('https://votre-domaine.com/api/register', {
  method: 'POST',
  body: formData,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
```

**Réponse réussie** :

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://votre-domaine.com/storage/user-avatars/avatar123.jpg",
    "bio": "Développeur passionné",
    "created_at": "2025-04-09T12:00:00.000000Z",
    "updated_at": "2025-04-09T12:00:00.000000Z"
  },
  "token": "1|abcdefghijklmnopqrstuvwxyz123456"
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 201 | Utilisateur créé avec succès |
| 422 | Validation échouée (email ou username déjà utilisés, etc.) |

### Connexion

Connecte un utilisateur existant et retourne un token d'authentification.

- **URL** : `/login`
- **Méthode** : `POST`
- **Authentification** : Non
- **Content-Type** : `application/json`

**Paramètres** :

| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| email | string | Oui | Email de l'utilisateur |
| password | string | Oui | Mot de passe |

**Exemple de requête** :

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse réussie** :

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://votre-domaine.com/storage/user-avatars/avatar123.jpg",
    "bio": "Développeur passionné",
    "created_at": "2025-04-09T12:00:00.000000Z",
    "updated_at": "2025-04-09T12:00:00.000000Z"
  },
  "token": "1|abcdefghijklmnopqrstuvwxyz123456"
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Connexion réussie |
| 422 | Email ou mot de passe incorrect |

### Déconnexion

Révoque le token d'authentification actuel.

- **URL** : `/logout`
- **Méthode** : `POST`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Exemple de requête** :

```javascript
fetch('https://votre-domaine.com/api/logout', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer 1|abcdefghijklmnopqrstuvwxyz123456',
    'Content-Type': 'application/json',
  },
})
```

**Réponse réussie** :

```json
{
  "message": "Déconnecté avec succès"
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Déconnexion réussie |
| 401 | Non authentifié |

## Utilisateurs

### Profil

Récupère le profil de l'utilisateur connecté.

- **URL** : `/profile`
- **Méthode** : `GET`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://votre-domaine.com/storage/user-avatars/avatar123.jpg",
    "bio": "Développeur passionné",
    "created_at": "2025-04-09T12:00:00.000000Z",
    "updated_at": "2025-04-09T12:00:00.000000Z"
  }
}
```

### Mise à jour du profil

Met à jour le profil de l'utilisateur connecté.

- **URL** : `/profile`
- **Méthode** : `PUT`
- **Authentification** : Oui
- **Content-Type** : `multipart/form-data`

**Paramètres** :

| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| name | string | Non | Nom complet de l'utilisateur |
| username | string | Non | Nom d'utilisateur unique |
| email | string | Non | Email unique |
| avatar | file | Non | Image de profil (max 1024 KB) |
| bio | string | Non | Biographie |

**Exemple de requête** :

```javascript
const formData = new FormData();
formData.append('name', 'John Smith');
formData.append('avatar', {
  uri: imageUri,
  name: 'avatar.jpg',
  type: 'image/jpeg'
});

fetch('https://votre-domaine.com/api/profile', {
  method: 'PUT',
  body: formData,
  headers: {
    'Authorization': 'Bearer 1|abcdefghijklmnopqrstuvwxyz123456',
    'Content-Type': 'multipart/form-data',
  },
})
```

**Réponse réussie** :

```json
{
  "user": {
    "id": 1,
    "name": "John Smith",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://votre-domaine.com/storage/user-avatars/avatar456.jpg",
    "bio": "Développeur passionné",
    "created_at": "2025-04-09T12:00:00.000000Z",
    "updated_at": "2025-04-09T12:30:00.000000Z"
  }
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Profil mis à jour avec succès |
| 422 | Validation échouée |
| 401 | Non authentifié |

## Guildes

### Liste des guildes publiques

Récupère la liste des guildes publiques.

- **URL** : `/guilds`
- **Méthode** : `GET`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "guilds": [
    {
      "id": 1,
      "name": "Guild One",
      "slug": "guild-one",
      "description": "Description de la guilde",
      "banner": "https://votre-domaine.com/storage/guild-banners/banner123.jpg",
      "logo": "https://votre-domaine.com/storage/guild-logos/logo123.jpg",
      "owner_id": 1,
      "is_private": false,
      "created_at": "2025-04-09T12:00:00.000000Z",
      "updated_at": "2025-04-09T12:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "Guild Two",
      "slug": "guild-two",
      "description": "Une autre guilde",
      "banner": "https://votre-domaine.com/storage/guild-banners/banner456.jpg",
      "logo": "https://votre-domaine.com/storage/guild-logos/logo456.jpg",
      "owner_id": 2,
      "is_private": false,
      "created_at": "2025-04-09T13:00:00.000000Z",
      "updated_at": "2025-04-09T13:00:00.000000Z"
    }
  ]
}
```

### Mes guildes

Récupère les guildes dont l'utilisateur est propriétaire ou membre.

- **URL** : `/my-guilds`
- **Méthode** : `GET`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "owned_guilds": [
    {
      "id": 1,
      "name": "Guild One",
      "slug": "guild-one",
      "description": "Description de la guilde",
      "banner": "https://votre-domaine.com/storage/guild-banners/banner123.jpg",
      "logo": "https://votre-domaine.com/storage/guild-logos/logo123.jpg",
      "owner_id": 1,
      "is_private": false,
      "created_at": "2025-04-09T12:00:00.000000Z",
      "updated_at": "2025-04-09T12:00:00.000000Z"
    }
  ],
  "member_guilds": [
    {
      "id": 2,
      "name": "Guild Two",
      "slug": "guild-two",
      "description": "Une autre guilde",
      "banner": "https://votre-domaine.com/storage/guild-banners/banner456.jpg",
      "logo": "https://votre-domaine.com/storage/guild-logos/logo456.jpg",
      "owner_id": 2,
      "is_private": false,
      "created_at": "2025-04-09T13:00:00.000000Z",
      "updated_at": "2025-04-09T13:00:00.000000Z",
      "pivot": {
        "user_id": 1,
        "guild_id": 2,
        "role": "member"
      }
    }
  ]
}
```

### Créer une guilde

Crée une nouvelle guilde.

- **URL** : `/guilds`
- **Méthode** : `POST`
- **Authentification** : Oui
- **Content-Type** : `multipart/form-data`

**Paramètres** :

| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| name | string | Oui | Nom de la guilde |
| description | string | Non | Description de la guilde |
| is_private | boolean | Non | Si la guilde est privée (défaut: false) |
| logo | file | Non | Logo de la guilde (max 1024 KB) |
| banner | file | Non | Bannière de la guilde (max 2048 KB) |

**Exemple de requête** :

```javascript
const formData = new FormData();
formData.append('name', 'Ma Nouvelle Guilde');
formData.append('description', 'Description de ma guilde');
formData.append('is_private', true);
formData.append('logo', {
  uri: logoUri,
  name: 'logo.jpg',
  type: 'image/jpeg'
});
formData.append('banner', {
  uri: bannerUri,
  name: 'banner.jpg',
  type: 'image/jpeg'
});

fetch('https://votre-domaine.com/api/guilds', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': 'Bearer 1|abcdefghijklmnopqrstuvwxyz123456',
    'Content-Type': 'multipart/form-data',
  },
})
```

**Réponse réussie** :

```json
{
  "guild": {
    "id": 3,
    "name": "Ma Nouvelle Guilde",
    "slug": "ma-nouvelle-guilde",
    "description": "Description de ma guilde",
    "banner": "https://votre-domaine.com/storage/guild-banners/banner789.jpg",
    "logo": "https://votre-domaine.com/storage/guild-logos/logo789.jpg",
    "owner_id": 1,
    "is_private": true,
    "created_at": "2025-04-09T14:00:00.000000Z",
    "updated_at": "2025-04-09T14:00:00.000000Z"
  }
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 201 | Guilde créée avec succès |
| 422 | Validation échouée |
| 401 | Non authentifié |

### Détails d'une guilde

Récupère les détails d'une guilde spécifique.

- **URL** : `/guilds/{guild_id}`
- **Méthode** : `GET`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "guild": {
    "id": 1,
    "name": "Guild One",
    "slug": "guild-one",
    "description": "Description de la guilde",
    "banner": "https://votre-domaine.com/storage/guild-banners/banner123.jpg",
    "logo": "https://votre-domaine.com/storage/guild-logos/logo123.jpg",
    "owner_id": 1,
    "is_private": false,
    "created_at": "2025-04-09T12:00:00.000000Z",
    "updated_at": "2025-04-09T12:00:00.000000Z",
    "owner": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe"
    },
    "members": [
      {
        "id": 1,
        "name": "John Doe",
        "username": "johndoe",
        "pivot": {
          "guild_id": 1,
          "user_id": 1,
          "role": "admin"
        }
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "username": "janesmith",
        "pivot": {
          "guild_id": 1,
          "user_id": 2,
          "role": "member"
        }
      }
    ]
  }
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Succès |
| 403 | Accès refusé (guilde privée) |
| 404 | Guilde non trouvée |

### Mettre à jour une guilde

Met à jour une guilde existante.

- **URL** : `/guilds/{guild_id}`
- **Méthode** : `PUT`
- **Authentification** : Oui
- **Content-Type** : `multipart/form-data`

**Paramètres** :

| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| name | string | Non | Nom de la guilde |
| description | string | Non | Description de la guilde |
| is_private | boolean | Non | Si la guilde est privée |
| logo | file | Non | Logo de la guilde (max 1024 KB) |
| banner | file | Non | Bannière de la guilde (max 2048 KB) |

**Exemple de requête** :

```javascript
const formData = new FormData();
formData.append('name', 'Nouveau Nom');
formData.append('logo', {
  uri: logoUri,
  name: 'logo.jpg',
  type: 'image/jpeg'
});

fetch('https://votre-domaine.com/api/guilds/1', {
  method: 'PUT',
  body: formData,
  headers: {
    'Authorization': 'Bearer 1|abcdefghijklmnopqrstuvwxyz123456',
    'Content-Type': 'multipart/form-data',
  },
})
```

**Réponse réussie** :

```json
{
  "guild": {
    "id": 1,
    "name": "Nouveau Nom",
    "slug": "nouveau-nom",
    "description": "Description de la guilde",
    "banner": "https://votre-domaine.com/storage/guild-banners/banner123.jpg",
    "logo": "https://votre-domaine.com/storage/guild-logos/logo123-updated.jpg",
    "owner_id": 1,
    "is_private": false,
    "created_at": "2025-04-09T12:00:00.000000Z",
    "updated_at": "2025-04-09T15:00:00.000000Z"
  }
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Guilde mise à jour avec succès |
| 403 | Non autorisé (pas le propriétaire) |
| 422 | Validation échouée |
| 404 | Guilde non trouvée |

### Supprimer une guilde

Supprime une guilde existante.

- **URL** : `/guilds/{guild_id}`
- **Méthode** : `DELETE`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "message": "Guilde supprimée avec succès"
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Guilde supprimée avec succès |
| 403 | Non autorisé (pas le propriétaire) |
| 404 | Guilde non trouvée |

## Membres

### Liste des membres d'une guilde

Récupère la liste des membres d'une guilde.

- **URL** : `/guilds/{guild_id}/members`
- **Méthode** : `GET`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "members": [
    {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "https://votre-domaine.com/storage/user-avatars/avatar123.jpg",
      "pivot": {
        "guild_id": 1,
        "user_id": 1,
        "role": "admin"
      }
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "username": "janesmith",
      "email": "jane@example.com",
      "avatar": "https://votre-domaine.com/storage/user-avatars/avatar456.jpg",
      "pivot": {
        "guild_id": 1,
        "user_id": 2,
        "role": "member"
      }
    }
  ]
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Succès |
| 403 | Accès refusé |
| 404 | Guilde non trouvée |

### Supprimer un membre d'une guilde

Supprime un utilisateur d'une guilde.

- **URL** : `/guilds/{guild_id}/members/{user_id}`
- **Méthode** : `DELETE`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "message": "Membre supprimé avec succès"
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Membre supprimé avec succès |
| 403 | Non autorisé (pas admin ou propriétaire) |
| 404 | Guilde ou utilisateur non trouvé |

### Mettre à jour le rôle d'un membre

Modifie le rôle d'un membre dans une guilde.

- **URL** : `/guilds/{guild_id}/members/{user_id}/role`
- **Méthode** : `PUT`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Paramètres** :

| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| role | string | Oui | Nouveau rôle (member, moderator, admin) |

**Exemple de requête** :

```json
{
  "role": "moderator"
}
```

**Réponse réussie** :

```json
{
  "message": "Rôle mis à jour avec succès"
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Rôle mis à jour avec succès |
| 403 | Non autorisé (pas admin ou propriétaire) |
| 422 | Validation échouée |
| 404 | Guilde ou utilisateur non trouvé |

## Invitations

### Invitations reçues

Récupère la liste des invitations reçues par l'utilisateur.

- **URL** : `/invitations/received`
- **Méthode** : `GET`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "invitations": [
    {
      "id": 1,
      "guild_id": 2,
      "sender_id": 3,
      "recipient_id": 1,
      "token": "abc123def456",
      "status": "pending",
      "expires_at": "2025-04-16T12:00:00.000000Z",
      "created_at": "2025-04-09T12:00:00.000000Z",
      "updated_at": "2025-04-09T12:00:00.000000Z",
      "guild": {
        "id": 2,
        "name": "Guild Two",
        "logo": "https://votre-domaine.com/storage/guild-logos/logo456.jpg"
      },
      "sender": {
        "id": 3,
        "name": "Alice Johnson",
        "username": "alicej"
      }
    }
  ]
}
```

### Invitations envoyées

Récupère la liste des invitations envoyées par l'utilisateur.

- **URL** : `/invitations/sent`
- **Méthode** : `GET`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "invitations": [
    {
      "id": 2,
      "guild_id": 1,
      "sender_id": 1,
      "recipient_id": 4,
      "token": "ghi789jkl012",
      "status": "pending",
      "expires_at": "2025-04-16T13:00:00.000000Z",
      "created_at": "2025-04-09T13:00:00.000000Z",
      "updated_at": "2025-04-09T13:00:00.000000Z",
      "guild": {
        "id": 1,
        "name": "Guild One",
        "logo": "https://votre-domaine.com/storage/guild-logos/logo123.jpg"
      },
      "recipient": {
        "id": 4,
        "name": "Bob Wilson",
        "username": "bobw"
      }
    }
  ]
}
```

### Créer une invitation

Invite un utilisateur à rejoindre une guilde.

- **URL** : `/guilds/{guild_id}/invitations`
- **Méthode** : `POST`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Paramètres** :

| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| recipient_id | integer | Oui | ID de l'utilisateur à inviter |

**Exemple de requête** :

```json
{
  "recipient_id": 5
}
```

**Réponse réussie** :

```json
{
  "invitation": {
    "id": 3,
    "guild_id": 1,
    "sender_id": 1,
    "recipient_id": 5,
    "token": "mno345pqr678",
    "status": "pending",
    "expires_at": "2025-04-16T14:00:00.000000Z",
    "created_at": "2025-04-09T14:00:00.000000Z",
    "updated_at": "2025-04-09T14:00:00.000000Z"
  }
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 201 | Invitation créée avec succès |
| 403 | Non autorisé (pas membre de la guilde) |
| 422 | Utilisateur déjà membre ou invitation déjà envoyée |
| 404 | Guilde ou utilisateur non trouvé |

### Accepter une invitation

Accepte une invitation à rejoindre une guilde.

- **URL** : `/invitations/{invitation_id}/accept`
- **Méthode** : `PUT`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "message": "Invitation acceptée avec succès",
  "invitation": {
    "id": 1,
    "guild_id": 2,
    "sender_id": 3,
    "recipient_id": 1,
    "token": "abc123def456",
    "status": "accepted",
    "expires_at": "2025-04-16T12:00:00.000000Z",
    "created_at": "2025-04-09T12:00:00.000000Z",
    "updated_at": "2025-04-09T15:00:00.000000Z",
    "guild": {
      "id": 2,
      "name": "Guild Two",
      "logo": "https://votre-domaine.com/storage/guild-logos/logo456.jpg"
    }
  }
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Invitation acceptée avec succès |
| 403 | Non autorisé (pas le destinataire) |
| 422 | Invitation déjà traitée ou expirée |
| 404 | Invitation non trouvée |

### Refuser une invitation

Refuse une invitation à rejoindre une guilde.

- **URL** : `/invitations/{invitation_id}/decline`
- **Méthode** : `PUT`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "message": "Invitation refusée"
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Invitation refusée avec succès |
| 403 | Non autorisé (pas le destinataire) |
| 422 | Invitation déjà traitée |
| 404 | Invitation non trouvée |

## Demandes d'adhésion

### Demandes d'adhésion envoyées

Récupère les demandes d'adhésion envoyées par l'utilisateur.

- **URL** : `/join-requests/sent`
- **Méthode** : `GET`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "join_requests": [
    {
      "id": 1,
      "guild_id": 3,
      "user_id": 1,
      "message": "J'aimerais rejoindre votre guilde",
      "status": "pending",
      "created_at": "2025-04-09T14:00:00.000000Z",
      "updated_at": "2025-04-09T14:00:00.000000Z",
      "guild": {
        "id": 3,
        "name": "Guild Three",
        "logo": "https://votre-domaine.com/storage/guild-logos/logo789.jpg"
      }
    }
  ]
}
```

### Demandes d'adhésion reçues

Récupère les demandes d'adhésion pour une guilde spécifique.

- **URL** : `/guilds/{guild_id}/join-requests`
- **Méthode** : `GET`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "join_requests": [
    {
      "id": 2,
      "guild_id": 1,
      "user_id": 5,
      "message": "J'aimerais rejoindre votre guilde",
      "status": "pending",
      "created_at": "2025-04-09T15:00:00.000000Z",
      "updated_at": "2025-04-09T15:00:00.000000Z",
      "user": {
        "id": 5,
        "name": "Charlie Brown",
        "username": "charlieb",
        "avatar": "https://votre-domaine.com/storage/user-avatars/avatar789.jpg"
      }
    }
  ]
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Succès |
| 403 | Non autorisé (pas admin ou propriétaire) |
| 404 | Guilde non trouvée |

### Créer une demande d'adhésion

Envoie une demande pour rejoindre une guilde.

- **URL** : `/guilds/{guild_id}/join-requests`
- **Méthode** : `POST`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Paramètres** :

| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| message | string | Non | Message facultatif pour la demande |

**Exemple de requête** :

```json
{
  "message": "J'aimerais rejoindre votre guilde car j'apprécie votre communauté"
}
```

**Réponse réussie** :

```json
{
  "join_request": {
    "id": 3,
    "guild_id": 3,
    "user_id": 1,
    "message": "J'aimerais rejoindre votre guilde car j'apprécie votre communauté",
    "status": "pending",
    "created_at": "2025-04-09T16:00:00.000000Z",
    "updated_at": "2025-04-09T16:00:00.000000Z"
  },
  "message": "Votre demande d'adhésion a été envoyée avec succès."
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 201 | Demande créée avec succès |
| 422 | Utilisateur déjà membre ou demande déjà envoyée |
| 404 | Guilde non trouvée |

### Accepter une demande d'adhésion

Accepte une demande d'adhésion à une guilde.

- **URL** : `/join-requests/{join_request_id}/accept`
- **Méthode** : `PUT`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "message": "Demande d'adhésion acceptée avec succès.",
  "join_request": {
    "id": 2,
    "guild_id": 1,
    "user_id": 5,
    "message": "J'aimerais rejoindre votre guilde",
    "status": "accepted",
    "created_at": "2025-04-09T15:00:00.000000Z",
    "updated_at": "2025-04-09T16:30:00.000000Z"
  }
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Demande acceptée avec succès |
| 403 | Non autorisé (pas admin ou propriétaire) |
| 422 | Demande déjà traitée |
| 404 | Demande non trouvée |

### Refuser une demande d'adhésion

Refuse une demande d'adhésion à une guilde.

- **URL** : `/join-requests/{join_request_id}/decline`
- **Méthode** : `PUT`
- **Authentification** : Oui
- **Content-Type** : `application/json`

**Réponse réussie** :

```json
{
  "message": "Demande d'adhésion refusée.",
  "join_request": {
    "id": 2,
    "guild_id": 1,
    "user_id": 5,
    "message": "J'aimerais rejoindre votre guilde",
    "status": "declined",
    "created_at": "2025-04-09T15:00:00.000000Z",
    "updated_at": "2025-04-09T16:30:00.000000Z"
  }
}
```

**Codes de statut** :

| Code | Description |
|------|-------------|
| 200 | Demande refusée avec succès |
| 403 | Non autorisé (pas admin ou propriétaire) |
| 422 | Demande déjà traitée |
| 404 | Demande non trouvée |

## Gestion des images

### Téléchargement d'images avec React Native

Pour télécharger des images à partir de React Native, utilisez cette approche :

```javascript
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

// Fonction pour sélectionner et télécharger une image
const pickAndUploadImage = async (endpoint, additionalData = {}, token) => {
  // Demander les permissions
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (permissionResult.granted === false) {
    alert("L'accès à la galerie est nécessaire!");
    return null;
  }

  // Sélectionner l'image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], // Pour un avatar ou logo (carré)
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  // Créer le FormData
  const formData = new FormData();
  
  // Ajouter l'image
  const uri = result.assets[0].uri;
  const name = uri.split('/').pop();
  const type = 'image/jpeg'; // Ou déterminer dynamiquement
  
  formData.append('avatar', { uri, name, type }); // Ou 'logo', 'banner' selon le contexte
  
  // Ajouter d'autres données
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  try {
    // Envoyer la requête
    const response = await axios.post(`https://votre-domaine.com/api/${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error.response?.data || error.message);
    throw error;
  }
};

// Exemple d'utilisation
const updateProfileWithImage = async () => {
  try {
    const result = await pickAndUploadImage('profile', { name: 'Nouveau nom' }, 'your-token-here');
    console.log("Profil mis à jour:", result);
  } catch (error) {
    alert("Erreur lors de la mise à jour du profil");
  }
};

// Exemple pour créer une guilde avec logo et bannière
const createGuildWithImages = async () => {
  try {
    // D'abord sélectionner le logo
    const logoResult = await pickImage([1, 1]); // Aspect ratio carré
    
    // Puis sélectionner la bannière
    const bannerResult = await pickImage([4, 1]); // Aspect ratio bannière
    
    if (!logoResult || !bannerResult) {
      alert("Veuillez sélectionner les deux images");
      return;
    }
    
    const formData = new FormData();
    formData.append('name', 'Nouvelle Guilde');
    formData.append('description', 'Description de la guilde');
    formData.append('is_private', true);
    
    // Ajouter logo
    const logoUri = logoResult.assets[0].uri;
    formData.append('logo', {
      uri: logoUri,
      name: logoUri.split('/').pop(),
      type: 'image/jpeg'
    });
    
    // Ajouter bannière
    const bannerUri = bannerResult.assets[0].uri;
    formData.append('banner', {
      uri: bannerUri,
      name: bannerUri.split('/').pop(),
      type: 'image/jpeg'
    });
    
    const response = await axios.post('https://votre-domaine.com/api/guilds', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("Guilde créée:", response.data);
  } catch (error) {
    alert("Erreur lors de la création de la guilde");
  }
};

// Fonction utilitaire pour sélectionner une image
const pickImage = async (aspect = [1, 1]) => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (permissionResult.granted === false) {
    alert("L'accès à la galerie est nécessaire!");
    return null;
  }

  return await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: aspect,
    quality: 0.8,
  });
};
```

Cette documentation couvre tous les aspects de l'API de votre application de guildes. Pour l'intégrer avec React Native/Expo, nous recommandons d'utiliser Axios ou la fonction fetch pour les requêtes HTTP et expo-image-picker pour la gestion des images.
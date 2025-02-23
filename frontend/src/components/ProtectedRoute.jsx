import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    // Initialize les variable à null
    const [isAuthorized, setIsAuthorized] = useState(null);

    // To refresh the Token
    const refreshToken = async () => {
        // Récupère le token de rafraîchissement dans le local storage
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        try {
            // Envoie d'une requête POST avec refresh token pour vérifier si tout est ok
            const res = await api.post("/api/token/refresh/", {
                refresh: resfrehToken
            });
            // Si c'est un succès
            if (res.status === 200) {
                // Nouveau token d'accès est stocké et on authorise la connexion
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                // Sinon on décline la connexion
                setIsAuthorized(false)
            }
            // en cas d'erreur
        } catch (error) {
            // Affiche l'erreur
            console.log(error)
            // On décline la connexion
            setIsAuthorized(false)
        }
    };
    // check if we have a token
    const auth = async() => {
        // vérifie si un token est présent
        const token = localStorage.getItem(ACCESS_TOKEN)
        // Si pas de token, passe le IsAuthorize à false
        if (!token) {
            setIsAuthorized(false)
            return
        }
        // Si il y a un token alors on le décode
        const decoded = jwtDecode(token)
        // On extrait sa date d'expriation
        const tokenExpiration = decoded.exp
        // On récupère la date actuelle en s
        const now = Date.now()/1000
        // Check if the token is expired
        if (tokenExpiration < now) {
            // Si expiré on appel la fonction de refresh du token
            await refreshToken()
        } else {
            // Si token pas expiré alors on authorise la connexion
            setIsAuthorized(true)
        }
    };

        // Lancement de la vérification lros du montage du composant.
    // hook fourni par React pour gérer les effets de bors dans les composants fonctionnels.
    useEffect(() => {
        // Code a exécuter après le rendu.
        auth().catch(() => setIsAuthorized(false))
    },
    // tableau de dépendances, détermine quand l'effet doit être réexécuté. Si vide --> Une seule fois
    [])
    if (isAuthorized === null) {
        return <div>Loading...</div>
    }
    // Si autorisation alors affiche les enfants, sinon renvoie vers le login
    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute
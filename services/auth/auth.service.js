// ✔ Login com Google

// ✔ Logout

// ✔ Verificar usuário logado

// ✔ Escutar mudança de autenticação

// ✔ Retornar usuário atual

// ✔ Verificar se está autenticado

// ✔ (Futuramente) Verificar permissões

// ✔ (Futuramente) Atualizar perfil

// ✔ (Futuramente) Login por e-mail

// ✔ (Futuramente) Cadastro

// ✔ (Futuramente) Reset de senha

// services/auth/auth.service.js

import {
    auth,
    provider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "../../firebase.config.js";

/**
 * Login com Google
 */
export async function loginGoogle() {

    try {

        const result = await signInWithPopup(auth, provider);

        return result.user;

    } catch (error) {

        console.error("Erro no login:", error);

        throw error;

    }

}

/**
 * Logout
 */
export async function logout() {

    try {

        await signOut(auth);

    } catch (error) {

        console.error("Erro ao sair:", error);

        throw error;

    }

}

/**
 * Usuário atual
 */
export function getUser() {

    return auth.currentUser;

}

/**
 * Escuta alterações de autenticação
 */

export function onAuthChange(callback) {

    return onAuthStateChanged(auth, callback);

}

/**
 * Está autenticado?
 */
export function isAuthenticated() {

    return auth.currentUser !== null;

}
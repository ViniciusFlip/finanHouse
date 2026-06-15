import {
    db,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    query,
    orderBy,
    doc,
    deleteDoc,
    serverTimestamp
} from "../../firebase.config.js";
 
 import { getUser } from "../auth/auth.service.js";

export async function salvarLancamento(tipo, valor, descricao) {

    try {

        const user = getUser();

        if (!user) {
            throw new Error("Nenhum usuário autenticado.");
        }

        const docRef = await addDoc(
            collection(db, "lancamentos"),
            {
                uid: user.uid,
                userName: user.displayName,
                userEmail: user.email,
                userPhoto: user.photoURL,


                tipo,
                valor,
                descricao,
                createdAt: serverTimestamp()
            }
        );

        console.log("Documento salvo:", docRef.id);

    } catch (error) {

        console.error("Erro ao salvar:", error);

    }

}
export async function listarLancamentos() {

    try {

        const q = query(
            collection(db, "lancamentos"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    } catch (error) {

        console.error(error);

        return [];

    }

}

export async function excluirLancamento(id) {

    try {

        await deleteDoc(
            doc(db, "lancamentos", id)
        );

        console.log("Documento excluído:", id);

    } catch (error) {

        console.error("Erro ao excluir:", error);

        throw error;

    }

}

export async function atualizarLancamento(id, dados) {

    try {

        await updateDoc(
            doc(db, "lancamentos", id),
            dados
        );

        console.log("Documento atualizado:", id);

    } catch (error) {

        console.error("Erro ao atualizar:", error);

        throw error;

    }

}
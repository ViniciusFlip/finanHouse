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

export async function salvarLancamento(
    tipo,
    valor,
    categoria,
    descricao,
    data = null
) {

    try {

        const user = getUser();

        if (!user) throw new Error("Nenhum usuário autenticado.");

        let dataLancamento;

        if (data) {

            const [dia, mes, ano] = data.split("/");
            dataLancamento = new Date()

        } else {

            const agora = new Date();

            dataLancamento = data
                ? new Date(
                    ano,
                    mes - 1,
                    dia,
                    agora.getHours(),
                    agora.getMinutes(),
                    agora.getSeconds()
                )
                : agora;

        }

        const docRef = await addDoc(
            collection(db, "lancamentos"),
            {
                uid: user.uid,
                userName: user.displayName,
                userEmail: user.email,
                userPhoto: user.photoURL || null,

                tipo,
                categoria,
                valor,
                descricao,

                data: dataLancamento,
                createdAt: serverTimestamp()
            }
        );
console.log("Salvou:", {
    tipo,
    valor,
    categoria,
    descricao,
    data
});
        console.log("Documento salvo:", docRef.id);

    } catch (error) {

        console.error(error);

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

     if (dados.data) {

    const [dia, mes, ano] = dados.data.split("/");

    const agora = new Date();

    dados.data = new Date(
        `${ano}-${mes}-${dia}T${agora.getHours()}:${agora.getMinutes()}:${agora.getSeconds()}`
    );
}
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
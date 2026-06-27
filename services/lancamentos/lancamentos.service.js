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

    const agora = new Date();

    dataLancamento = new Date(
        ano,
        mes - 1,
        dia,
        agora.getHours(),
        agora.getMinutes(),
        agora.getSeconds()
    );

} else {

    dataLancamento = new Date();

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

            let date;

            // 🔥 caso venha string (input)
            if (typeof dados.data === "string") {

                const [dia, mes, ano] = dados.data.split("/");

                const agora = new Date();

                date = new Date(
                    ano,
                    mes - 1,
                    dia,
                    agora.getHours(),
                    agora.getMinutes(),
                    agora.getSeconds()
                );

            } 
            // 🔥 caso venha Timestamp ou Date
            else {

                const d = dados.data.toDate
                    ? dados.data.toDate()
                    : new Date(dados.data);

                const agora = new Date();

                date = new Date(
                    d.getFullYear(),
                    d.getMonth(),
                    d.getDate(),
                    agora.getHours(),
                    agora.getMinutes(),
                    agora.getSeconds()
                );
            }

            dados.data = date;
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
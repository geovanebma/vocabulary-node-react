import './App.css';
import { get, database, update, ref, query, orderByKey, limitToFirst, startAt } from "./firebase/firebase";
import { useState, useEffect } from "react";

function App() {
  const [posts, setPosts] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 200;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getPosts(page);
    }
  };

  const getPosts = async (page = 1) => {
    const itemsPerPage = 100;
    const startAtKey = (page - 1) * itemsPerPage;

    const dbRef = ref(database);
    const postsQuery = query(
      dbRef,
      orderByKey(),
      startAt(String(startAtKey)),
      limitToFirst(itemsPerPage)
    );

    try {
      const snapshot = await get(postsQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setPosts(data);
      } else {
        console.log("Nenhum dado disponível");
      }
    } catch (error) {
      console.error("Erro ao obter dados: ", error);
    }
  };

  const toggleLearnedStatus = async (itemId, currentStatus) => {
    const dbRef = ref(database, `/${itemId}`); // Referência ao item no Firebase

    try {
      // Atualiza o campo "learned" no Firebase
      await update(dbRef, { learned: !currentStatus });
      console.log(`O status do item ${itemId} foi atualizado para ${!currentStatus}`);
      // Atualiza o estado local
      setPosts((prevPosts) => ({
        ...prevPosts,
        [itemId]: { ...prevPosts[itemId], learned: !currentStatus },
      }));
    } catch (error) {
      console.error("Erro ao atualizar status: ", error);
    }
  };

  const showMeaning = (meanings) => {
    if (Array.isArray(meanings) && meanings.length > 0) {
      return `<ul>${meanings.map((m) => `<li>${m.meaning || "Sem significado disponível"}</li>`).join('')}</ul>`;
    }
    return "<div>Não há significados para esta palavra.</div>";
  };

  const handleShowPopup = (meanings) => {
    const content = showMeaning(meanings);
    setPopupContent(content); // Atualiza o conteúdo do popup
    setShowPopup(true); // Exibe o popup
  };

  const generatePageNumbers = () => {
    const visiblePages = 5; // Número de páginas visíveis na navegação
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;

    // Ajuste para não ultrapassar o total de páginas
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  useEffect(() => {
    getPosts(1);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h1>My English Vocabulary</h1>
          <div className="content">
            {posts ? (
              <table className="vocabularyTable">
                <thead>
                  <tr>
                    <th></th>
                    <th>Word</th>
                    <th>Meanings</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(posts).map(([id, item]) => (
                    <tr key={id}>
                      <td>
                        <input
                          type="checkbox"
                          className="chekword"
                          title="Select all"
                          checked={item.learned}
                          onChange={() => toggleLearnedStatus(id, item.learned)} // Corrigido
                        />
                      </td>
                      <td>{item.word}</td>
                      <td>
                        <i
                          className="bi bi-search meanings"
                          onClick={() => handleShowPopup(item.meanings)} // Corrigido
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Carregando...</p>
            )}
          </div>
          <div className="pagination">
            <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              Primeira
            </button>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Voltar
            </button>
            {generatePageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Próxima
            </button>
            <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
              Última
            </button>
          </div>
        </div>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <span className="close" onClick={() => setShowPopup(false)}>
                &times;
              </span>
              <div dangerouslySetInnerHTML={{ __html: popupContent }} />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;